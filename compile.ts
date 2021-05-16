import path from 'path';
import { readFile, readdir, rm, mkdir, writeFile } from 'fs/promises';

import sass from 'sass';
import yaml from 'yaml';
import marked from 'marked';
import handlebars from 'handlebars';
import { html_beautify } from 'js-beautify';
import chokidar from 'chokidar';

const enum ViewName { Resume, CoverLetter };

// File which contains the data needed for both the resume and the cover-letter.
const commonDataPath = path.join(__dirname, 'src/data/common.yml');
// File which contains the data needed for the resume.
const resumeDataPath = path.join(__dirname, 'src/data/resume.yml');
// File which contains the data needed for the cover-letter, if applicable.
const coverDataPath = path.join(__dirname, 'src/data/cover-letter.yml');
// File which contains the markdown body of the cover letter.
const coverBodyPath = path.join(__dirname, 'src/data/cover-letter.md');
// Folder which contains the helpers to register when rendering
const helperPath = path.join(__dirname, 'src/helpers');

// The folder to output things to.
const distPath = path.join(__dirname, 'dist');


/**
 * Wrapper for fsPromises.readFile that includes the Buffer.toString().
 * @param file File path to read from.
 * @returns A promise which will resolve with the file read as a string.
 */
const read = (file: string) => readFile(file).then(buff => buff.toString());


/**
 * Recursively runs through a file and registers all the partials it requires to
 * be rendered.
 * @param rawFile The string to search through for partials.
 * @param existing A list of partials already registered to Handlebars that
 * don't need to be re-registered.
 */
const getPartials = async (rawFile: string, existing: string[]) => {
  // Scan the file for partials
  const partials = Array.from(rawFile.matchAll(/{{>\s*([- \d\w]+)\s*}}/gmi));

  await Promise.all(partials.map(async ([, capture]) => {
    const partial = capture.trim();

    // If this partial is already registered found
    if (existing.indexOf(partial) !== -1) return;
    else existing.push(partial);

    try {
      const file = path.join(__dirname, 'src/partials', `${partial}.hbs`)
      const rawPartial = await read(file);

      // Register all the partials required for the partial we just found
      await getPartials(rawPartial, existing);
      handlebars.registerPartial(partial, rawPartial);
    } catch (error) {
      throw error; // NotImplementedException
    }
  }));
}


/**
 * Renders a Handlebars view, complete with specific handling for getting
 * cover-letter.md or resume.yml depending on which one is passed.
 * @param target Which of the two views to render.
 * @returns An HTML of the completed, rendered view.
 */
const renderView = async (target: ViewName) => {

  // Check the helpers folder and add any that are there. Do this first, as
  // other pieces may depend on helpers
  const helperFiles = await readdir(helperPath);
  const helpers = await Promise.all(
    helperFiles.filter(f => !f.startsWith('_')).map(async name => {
      const helper = path.parse(name).name;
      const file = path.join(helperPath, helper);

      const { default: func } = await import(file);
      handlebars.registerHelper(helper, func);

      return helper; // return name to add to list
    })
  );

  // Get the view
  const targetView = target == ViewName.Resume
    ? path.join(__dirname, 'src/views/index.hbs')
    : path.join(__dirname, 'src/views/cover-letter.hbs');

  const rawFile = await read(targetView);

  // Compile and register its partials
  const partials: string[] = [];
  await getPartials(rawFile, partials);

  // Compile the view
  const template = handlebars.compile(rawFile);

  // Get the common data first data
  let data = yaml.parse(await read(commonDataPath));

  if (target == ViewName.Resume) {
    // if this is the resume, get the data for it
    const resumeData = yaml.parse(await read(resumeDataPath));
    data = { ...data, ...resumeData };

  } else {
    // if this is the cover-letter, get the data for it (if applicable) and the
    // markdown
    let rawCoverData, rawCoverBody;
    try {
      rawCoverData = await read(coverDataPath);
    } catch (error) {
      rawCoverData = "";
    }

    try {
      rawCoverBody = await read(coverBodyPath);
    } catch (error) {
      rawCoverBody = "";
    }

    const coverData = yaml.parse(rawCoverData);
    const coverBody = marked(rawCoverBody, {
      gfm: true,
      sanitize: false,
      smartLists: true,
      headerIds: true,
      xhtml: true
    });

    data = { ...data, ...coverData, body: coverBody };
  }

  const output = template(data);

  partials.forEach(name => handlebars.unregisterPartial(name));
  helpers.forEach(name => handlebars.unregisterHelper(name));

  return output;
}


const outputView = async (target: ViewName) => {
  const rendered = await renderView(target);
  const output = html_beautify(rendered, {
    eol: '\n',
    indent_size: 2,
    end_with_newline: true,
    preserve_newlines: false,
    wrap_line_length: 80,
    extra_liners: [ 'head', 'body', '/html', 'section' ]
  });

  const name = target == ViewName.Resume ? 'index.html' : 'cover-letter.html';
  await writeFile(path.join(distPath, name), output, { encoding: 'utf-8' });
}


/**
 * Builds all Sass files in the /src/styles folder.
 * @param isWatchMode Whether or not the output should be compressed, among
 * other tweaks.
 */
const outputSass = async (isWatchMode: boolean) => {
  const files = await readdir(path.join(__dirname, 'src/styles'));

  await Promise.all(files.filter(f => !f.startsWith('_')).map(async name => {
    const file = path.join('src/styles', name);
    const parsed = path.parse(name);

    const outFile = `styles/${parsed.name}.min.css`;
    const mapFile = outFile + '.map';

    try {
      const result = sass.renderSync({
        file,
        ...(isWatchMode && { outFile }),
        sourceMap: isWatchMode,
        outputStyle: isWatchMode ? 'expanded' : 'compressed'
      });

      await Promise.all([
        writeFile(path.join(distPath, outFile), result.css),
        isWatchMode
          ? writeFile(path.join(distPath, mapFile), result.map)
          : Promise.resolve()
      ]);
    } catch (error) {
      console.error(`\n${error.formatted}\n`);
    }

  }));
}


/**
 * Main function
 * @param argv The argv passed to node, with the first two sliced off.
 */
const main = async (argv: string[]) => {
  // Remove the /dist/ directory first
  await rm(distPath, { recursive: true, force: true });
  await mkdir(distPath, { recursive: true });
  await mkdir(path.join(distPath, 'styles'), { recursive: true });

  if (
    argv.length !== 2 ||
    (argv[0] !== 'watch' && argv[0] !== 'build') ||
    (argv[1] !== 'index' && argv[1] !== 'cover' && argv[1] !== 'both')
  ) {
    console.error(
      "Incorrect arguments. Should be in the form of:\n" +
      "npm run {watch|build} -- {index|cover|both}"
    );
  }

  const modeArg = argv[0] as 'watch' | 'build';
  const fileArg = argv[1] as 'index' | 'cover' | 'both';

  const buildHandlebars = async () => {
    if (fileArg == 'index') await outputView(ViewName.Resume);
    else if (fileArg == 'cover') await outputView(ViewName.CoverLetter);
    else await Promise.all([
      outputView(ViewName.Resume),
      outputView(ViewName.CoverLetter)
    ]);
  }

  console.log("Building 'src' directory...");
  await Promise.all([ buildHandlebars(), outputSass(modeArg == 'watch') ]);

  if (modeArg == 'build') console.log("Done!");
  else {

    /**
     * Just need a basic watcher. Nothing fancy. Will just re-build all views
     * when any file changes. I'll at least split up Sass and Handlebars,
     * though.
     */

    console.log("Watching 'src' directory for changes...");
    const sentinel = chokidar.watch(path.join(__dirname, 'src'), {
      ignoreInitial: false
    });

    sentinel.on('change', async file => {
      if (path.basename(path.dirname(file)) == 'styles') {
        console.log(`${path.basename(file)} changed. Recompiling Sass...`)
        await outputSass(false);
      } else {
        console.log(`${path.basename(file)} changed. Rebuilding views...`);
        await buildHandlebars();
      }
    });

    process.on('SIGINT', (() => {
      sentinel.close()
    }).bind(null));
  }

}


main(process.argv.splice(2));