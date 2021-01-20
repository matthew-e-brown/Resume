<template>
  <div class="subsection" :class="{ 'no-header': noHeader(header) }">
    <div v-if="!noHeader(header)">
      <h3 v-html="header"></h3>
    </div>
    <div>
      <template v-for="({ header: subheader, body }, i) in content">
        <h4 v-if="!noHeader(subheader)" v-html="subheader" :key="`h4-${i}`"></h4>
        <VueMarkdown
          :key="i"
          :source="body"
          :anchorAttributes="{ target: '_blank' }"
          :linkify="false"
          :breaks="false"
          :class="{ 'no-header': noHeader(subheader) }"
          class="body-text"
        />
      </template>
    </div>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown';

export default {
  name: 'ResumeSubsection',
  components: { VueMarkdown },
  props: {
    // Not going to be an ID this time, no regex needed:
    header: { required: true, type: String },
    content: { required: true, type: Array }
  },
  methods: {
    noHeader: str => str == '__no-header__'
  }
}
</script>

<style scoped>
.subsection {
  break-inside: avoid;
  break-before: auto;
  break-after: auto;
}

.subsection:first-of-type {
  break-before: avoid-page;
}

.subsection:not(.no-header) {
  display: grid;
  grid-template-columns: 7.25rem 1fr;
}

.subsection>* {
  padding: 0.3rem;
}

.subsection>:first-child {
  padding-left: 0;
}

.subsection>:last-child {
  padding-right: 0;
}

h3 {
  font-size: 1rem;
  font-weight: 400;
  color: rgb(118, 113, 113);
}

h4 {
  margin-bottom: 0.1em;
}

.body-text {
  margin-bottom: 0.4em;
}

.body-text:last-child {
  margin-bottom: 0;
}

.no-header {
  padding-left: 0;
  padding-right: 0;
}

.subsection+.no-header {
  margin-top: 0.275em;
}

/* Styling within the VueMarkdown component */
* >>> ul {
  list-style-type: square;
  padding-inline-start: 2.4em;
}

* >>> ul ul li {
  list-style-type: none;
  position: relative;
}

* >>> ul ul li::before {
  position: absolute;
  left: -1.4em;
  top: 0.5em;
  transform: translateY(-25%);
  display: inline-block;
  font-style: normal;
  font-variant: normal;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  font-weight: 400;
  font-family: "Font Awesome 5 Pro";
  content: "\f178";
}
</style>