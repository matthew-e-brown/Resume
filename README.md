# My Resume

I got fed up with screwing around with styles in Microsoft Word and decided to
use CSS for my resume instead. Then, I decided to make it with Vue because, 1) I
wanted to use components and 2) because I can! 🥳

This app is actually a printable webpage which is designed to look like a
document. So, instead of exporting a PDF from Word, I simply open this site up
and CTRL+P the whole page. Because it relies on looking like a page, it is not
responsive. It is verified to print properly from Chrome and Firefox on Windows.
It should also print *mostly* properly on iOS Safari and Chrome, but there is
some font-size anomalies.

[In some older versions of Chrome][issue] (before 83), having Windows display
scaling set to anything other than 100% would affect the margins of the printed
page. Double check that you're up to date if you use this.


## Usage

If you like the look of my resume, feel free to fork this repository and use
this resume's theme as your own! I would be flattered if you did. 😊

Everything on it can be tweaked simply by editing [`resume.js`](src/resume.js).
See the [Data](#data) section for details.


### Running

This is just a Vue app, so you can install and run it with

```console
$ npm install
$ npm run serve
```

and build it with

```console
$ npm run build
```

It can be deployed to GitHub pages using

```console
$ npm run deploy
```

This command will include a build of the project.

The `CoverLetter.vue` view is not available in production &mdash; only when
running locally. See [below](#cover-letter).


### FontAwesome

This app uses a single Pro Icon from FontAwesome. If you have FontAwesome Pro,
you have nothing to worry about! Yay! That is, as long as you've previously done
the steps required to use FontAwesome with a package manager (see the
[FontAwesome Docs][fa-docs]).

If you don't, here's how to get it working (you're going to have a slightly
different bullet point, `long-arrow-alt-right` instead of `long-arrow-right`):

1.  Uninstall `@fortawesome/font-awesome-pro`, and install
    `@fortawesome/font-awesome-free`:
    ```console
    $ npm uninstall --save @fortawesome/font-awesome-pro
    $ npm install --save @fortawesome/font-awesome-free
    ```
2.  Go to [`main.js`](src/main.js) and change the imports from
    `font-awesome-pro` to `font-awesome-free`:
    ```javascript
    import '@fortawesome/fontawesome-{pro => free}/css/all.min.css';
    import '@fortawesome/fontawesome-{pro => free}/js/all.min.js';
    ```
3.  Head to [`ResumeSubsection.vue`](src/components/ResumeSubsection.vue) and
    get change the `content` and `font-family` declarations at the bottom of the
    file to the following:
    ```css
    * >>> ul ul li::before {
      /* ... */
      font-family: "Font Awesome 5 Free";
      content: "\f30b";
    }
    ```
4.  Done!


### Data

#### Body

When making this resume, Even I got a little lost sometimes with what object
correlated to what. Here's a quick cheatsheet:

```javascript
export const body = {
  "Blue, underlined (h2)": {
    "Light gray, off to the side (h3)": {
      "Black, within the subsection (h4)": `
        Parsed markdown text. Text is automatically dedented.
      `,
    },
  },
};
```

For level three and four headings, using *`__no-header__`* as the object's key
will allow you to have a blank header. This is useful when you only have one
subsection for a specific section.


#### Contact

For the most part, `resume.js` is pretty easy to follow. But, the `contact`
object (used for the grid of URLs, phone numbers, and other information at the
top of the page) has some additional features.

For the most basic usage, this is probably all you'll need:

```javascript
export const contact = {
  service: {
    url: 'https://example.com',
    display: 'Text to display in <a>'
  },
  // more service(s) ...
};
```

The `url` field can be omitted if it isn't necessary. Alternatively, the entire
service can be just a string:

```javascript
export const contact = {
  service: 'MyProfileName',
  // more service(s) ...
}
```

This will result in the `<a>` tag being replaced by a `<span>`.

By default, the following are recognized as services and have the proper
FontAwesome icons set for them when they're used as keys (in place of the
`service` key used in the above examples):

| Key in the Object   | FontAwesome Icon                    |
| :------------------ | :---------------------------------- |
| `phone`             | [`fa-phone-alt`][icon-1]            |
| `mobile`            | [`fa-mobile`][icon-2]               |
| `email`             | [`fa-paper-plane`][icon-3]          |
| `github`            | [`fa-github`][icon-4]               |
| `twitter`           | [`fa-twitter`][icon-5]              |
| `linkedin`          | [`fa-linkedin`][icon-6]             |
| `stackoverflow`     | [`fa-stack-overflow`][icon-7]       |
| all others          | [`fa-external-link-square`][icon-8] |

However, if you don't like these, you can specify `icon` and pass in a valid
FontAwesome icon name (including the `fa-` prefix), and you'll get that icon
instead. By default, `fas` (solid style) will be used. If you'd prefer another
style, like `fal` (light style), you can specify and `iconStyle` in the object.
For example:

```javascript
export const contact = {
  website: {
    url: "https://my.website.io",
    display: "My Personal Site",
    icon: "fa-magic",
    iconStyle: "far"
  }
}
```

Finally, if you'd prefer to not have any grid of contact information, you can
simply set `contact` as a whole to `false`:

```javascript
export const contact = false;
```


### Cover Letter

When I write my cover letters, I like for them to have the same header/theme as
my resume. So, in case you're the same way, I've included a second view in this
project which will allow you to do just that. This view is not rendered in
production, meaning that even if you have something written, it won't show up
when you build it or deploy it to GitHub Pages.

To create a cover letter, simply create a `src/cover-letter.md` file, and start
writing in it. The contents of this file will automatically appear as body-text
in the `/cover-letter` route. **If I were you, I would create this file
regardless of whether you're going to write a cover letter**. That is, unless
you don't mind Webpack constantly giving you a warning in your `npm run serve`
console.


#### Custom Syntax &mdash; Non-indented paragraphs

In the cover letter, if you start a paragraph with `//!`, that paragraph will
have no text-indent. This is useful for omitting the indent after a `ul` or
`ol`, or, more likely, at the bottom and top for greetings and signoffs.

```markdown
//! Dear Company President:

I think I'm a great fit for this position. Here's why...

//! &mdash;  <!-- Linebreak by ending with double-spaces enabled -->
Matt
```

Markdown didn't really have anything that would let me do this without
complicating the structure of the DOM or something, so I just ran it through a
simple regular expression.


[issue]: https://bugs.chromium.org/p/chromium/issues/detail?id=1059578
[fa-docs]: https://fontawesome.com/how-to-use/on-the-web/setup/using-package-managers#installing-pro
[icon-1]: https://fontawesome.com/icons/phone-alt?style=solid
[icon-2]: https://fontawesome.com/icons/mobile?style=solid
[icon-3]: https://fontawesome.com/icons/paper-plane?style=solid
[icon-4]: https://fontawesome.com/icons/github?style=brands
[icon-5]: https://fontawesome.com/icons/twitter?style=brands
[icon-6]: https://fontawesome.com/icons/linkedin-in?style=brands
[icon-7]: https://fontawesome.com/icons/stack-overflow?style=brands
[icon-8]: https://fontawesome.com/icons/external-link-square-alt?style=solid
