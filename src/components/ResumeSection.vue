<template>
  <section :id="`${ID}-section`">
    <h2 :id="ID" :style="{ color }">{{ header }}</h2>
    <slot></slot>
  </section>
</template>

<script>
import { colors } from '@/resume';

export default {
  name: 'ResumeSection',
  props: {
    title: { required: true, type: String }
  },
  data: function() {
    return {
      color: colors.header,
      header: this.title,
      ID: this.title.toLowerCase().replace(/[^\w]+/g, '-').replace(/[^\w]+$/g, '')
        || `header-${this.$vnode.key + 1}`
    }
  }
}
</script>

<style scoped>
section {
  break-inside: avoid-page;
}

h2 {
  font-family: 'Catamaran', sans-serif;
  font-weight: 900;
  font-size: 1.2em;
  font-variant: small-caps;
  letter-spacing: 0.2em;
  line-height: 1.4rem;
  margin: 0.25em -0.5rem 0.25em -0.5rem;
  padding: 0 0.5rem;
  color: rgb(0, 102, 204);
  border-bottom: 0.075rem solid rgb(18, 13, 13);
  break-before: avoid-page;
  break-after: avoid-page;
}
</style>