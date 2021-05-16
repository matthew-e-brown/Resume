import path from 'path';
import { readFile, rm, mkdir, writeFile } from 'fs/promises';

import sass from 'sass';
import yaml from 'yaml';
import marked from 'marked';
import handlebars from 'handlebars';
import { html_beautify } from 'js-beautify';

const enum ViewName { Resume, CoverLetter };

// File which contains the data needed for both the resume and the cover-letter.
const commonDataPath = path.join(__dirname, 'src/data/common.yml');
// File which contains the data needed for the resume.
const resumeDataPath = path.join(__dirname, 'src/data/resume.yml');
// File which contains the data needed for the cover-letter, if applicable.
const coverDataPath = path.join(__dirname, 'src/data/cover-letter.yml');
// File which contains the markdown body of the cover letter.
const coverBodyPath = path.join(__dirname, 'src/data/cover-letter.md');

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
  // Get the view
  const targetView = target === ViewName.Resume
    ? path.join(__dirname, 'src/views/index.hbs')
    : path.join(__dirname, 'src/views/cover-letter.hbs');

  const rawFile = await read(targetView);

  // Render its partials
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

  return template(data);
}


const make = async (target: ViewName) => {
  const rendered = await renderView(target);
  const output = html_beautify(rendered, {
    eol: '\n',
    indent_size: 2,
    end_with_newline: true,
    preserve_newlines: false,
    wrap_line_length: 80,
    extra_liners: [ 'head', 'body', '/html', 'section' ]
  });

  const name = target === ViewName.Resume ? 'index.html' : 'cover-letter.html';
  await writeFile(path.join(distPath, name), output, { encoding: 'utf-8' });
}

/**
 * Main function
 */
(async () => {
  // Remove the /dist/ directory first
  await rm(distPath, { recursive: true, force: true });
  await mkdir(distPath, { recursive: true });

  switch (process.argv[2] as 'index' | 'cover' | 'both') {
    case 'index':
      await make(ViewName.Resume);
      break;
    case 'cover':
      await make(ViewName.CoverLetter);
      break;
    case 'both':
      await Promise.all([
        make(ViewName.Resume),
        make(ViewName.CoverLetter)
      ]);
      break;
  }

  console.log('Done!');
})();