<template>
  <div id="page">
    <h1 :style="{ color: titleColor }">{{ name }}</h1>
    <ContactGrid v-if="contact !== false" :contact="contact" />
    <router-view />
  </div>
</template>

<script>
import { name, contact, colors } from '@/resume';
import ContactGrid from '@/components/ContactGrid';

export default {
  name: 'Page',
  components: { ContactGrid },
  data: function() {
    return { name, contact, titleColor: colors.title }
  },
  beforeMount: () => document.documentElement.style.backgroundColor = colors.background
}
</script>

<style scoped>
h1 {
  font-family: 'Catamaran', sans-serif;
  font-weight: 900;
  font-size: 2.83em;
  color: rgb(0, 69, 134);
}
</style>

<style>
:root {
  font-family: 'Open Sans', Helvetica, sans-serif;
  font-size: 16px;
  font-weight: 400;
  color:rgb(18, 13, 13);
  background-color: rgb(156, 156, 156);
}

/* Measurements taken from the original print copy of my resume: */
/* Width: 8.5in / 1/72in per pt / 12pt per em */
/* Padding: 15mm, 22.5mm / (1/72 * 25.4mm) per pt / 12pt per em */
#page {
  box-sizing: border-box;
  width: 51rem;
  /* No reason not to be as accurate as possible, right? */
  padding: 3.54330708661417rem 5.31496062992126rem;
  background-color: white;
  margin: 0 auto;
}

@media not print {
  #page {
    box-shadow: 0.1em 0.25em 0.85em 0.12em rgba(14, 14, 14, 0.35);
    border-radius: 0.5rem;
    min-height: 66rem;
  }
}

@media only print {
  :root { font-size: 12pt; background: none !important; }
  body { margin: 0; }

  a[href^="mailto:"], a[href^="tel:"] {
    text-decoration-line: none;
  }

  /* (See below) these two need to be done with @page margins to make
   * page-breaks happen in proper places */
  #page {
    padding-top: 0;
    padding-bottom: 0;
  }

  @page {
    width: 8.5in;
    height: 11in;
    /* The margin property on #page takes care of the left-right margins, since
     * doing it that way lets me have things (like the h2 borders) jut out into
     * the margins of the actual @page */
    margin: 15mm 0;
  }
}

/* Small CSS Reset */
h1, h2, h3, h4, h5, h6,
ul, ol, p {
  margin-block-start: 0;
  margin-top: 0;
  margin-block-end: 0;
  margin-bottom: 0;
}

a {
  color: rgb(18, 13, 13);
  transition: color 125ms ease-in-out;
}

a:hover {
  color: rgb(0, 97, 209);
}

svg {
  color: rgb(66, 63, 63);
}

main {
  margin-top: 0.85rem;
}

section {
  margin: 0.85rem 0 1rem;
}

section:last-child {
  margin-bottom: 0;
}
</style>