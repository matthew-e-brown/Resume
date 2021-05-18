# My Resume

After too many hours of getting fed up with messing around with styles in
Microsoft Word, I realized that I would have far more control over the look of
my resume if I crafted it using CSS, which I'm much more familiar with.

This webpage is built to be my primary resume: when I need to hand it in to a
job, I will go to this page and print it. There are styles in place to shape the
margins correctly and everything. Because of this, I have intentionally left out
the responsive viewport meta-tag from the metadata of the pages, so it shows up
as intended on mobile: with the good old fashioned zoom-in-to-enlarge feel.

Originally, this resume was built using Vue, so I could have access to its
wonderful single-file-components and scoped CSS. However, that meant that my
final bundle included all of Vue's reactivity engine: something I did not need
at all for a static resume. So, I reworked it to simply use a custom compile
script and Handlebars for templating. The final resume is now a tiny minified
HTML document alongside a single CSS file.


## Usage as a Template

Using this as a template is really simple. Simply edit the
[`resume.yml`](src/data/resume.yml) file to contain your own resume and you're
all set. There is also a view for writing a cover-letter using the same name +
contact-grid header as the resume. It will compile from the
[`cover-letter.md`](src/data/cover-letter.md) file in `src/data`.

There are a few things you should know if you are going to use this as a
template, however.


### `compile.ts`

This script is barebones as hell. It doesn't host any of the files, so you'll
need to do that yourself. Personally, I open a second terminal and run a little
Bash macro inside the folder:

```bash
py-server () {
	PORT=8000
	if ! [[ -z $1 ]]; then
		PORT=$1
	fi

	python -m http.server $PORT --bind 0.0.0.0
}
```

But your mileage may vary. It also might not handle all errors, but that's okay
for me: I just need it to compile some Handlebars.

If you want to make any updates/upgrades to it, I would gladly review a PR. 😁


### FontAwesome

This resume uses FontAwesome's Kit system which is limited to work only on my
domain: it's a Pro subscription, so you can see why. To use this resume, you'll
have to get your own Kit. Head to [fontawesome.com](fontawesome.com) to do so.
You'll just want to replace the Kit URL in
[`head-metadata.hbs`](src/partials/head-metadata.hbs).

If you go with a a free kit, you'll need to change one of the icons: the icon
used for arrows in nested lists:

```scss
&::before, >svg {
  content: unicode("\f178");           // <--- Here
  font-family: 'Font Awesome 5 Pro';   // <--- Here
  font-style: normal;
  font-variant: normal;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
}
```