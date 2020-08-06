<template>
  <div id="contact">
    <div class="contact-entry" v-for="entry in contactData" :key="entry.key">
      <i class="fa-fw" :class="entry.icon"></i>
      <a v-if="entry.url" :href="entry.url">{{ entry.display }}</a>
      <span v-else>{{ entry.display }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactGrid',
  props: {
    contact: { required: true, type: Object }
  },
  computed: {
    contactData: function() {
      // Run through contact prop to add icons for everything
      return Object.entries(this.contact).map(([socialType, social], i) => {
        // Return with given icon if possible
        if (social.icon) return { ...social, icon: [ social.iconStyle || 'fas', social.icon ], key: i };

        // Decide which icon to use if not given
        let icon;
        switch (socialType) {
          case 'phone': icon = [ 'fas', 'fa-phone-alt' ]; break;
          case 'email': icon = [ 'fas', 'fa-paper-plane' ]; break;
          case 'mobile': icon = [ 'fas', 'fa-mobile' ]; break;
          case 'github': icon = [ 'fab', 'fa-github' ]; break;
          case 'twitter': icon = [ 'fab', 'fa-twitter' ]; break;
          case 'linkedin': icon = [ 'fab', 'fa-linkedin' ]; break;
          case 'stackoverflow': icon = [ 'fab', 'fa-stack-overflow' ]; break;
          default: icon = [ 'fas', 'fa-external-link-square' ]; break;
        }

        if (typeof social === 'string') social = { 'display': social, key: i, icon };
        else social = { ...social, key: i, icon };

        return social;
      })
    }
  }
}
</script>

<style scoped>
#contact {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 0 0.35em;
  justify-content: space-around;
  padding: 0 1em;
}

.contact-entry {
  display: grid;
  grid-template-columns: 1.5em auto;
  grid-template-rows: 1fr;
  grid-gap: 0 0.25em;
  align-items: center;
}

.contact-entry svg {
  font-size: 1.25em;
}

.contact-entry a, .contact-entry span {
  justify-self: left;
  padding: 0.15em 0 0.15em 0.5em;
  margin-right: 0.8em;
  border-left: 0.075rem solid rgb(18, 13, 13);
  white-space: nowrap;
  text-overflow: clip;
}
</style>