<template>
  <main>
    <ResumeSection
      v-for="({ header, subsections }, i) in sections"
      :title="header"
      :key="i"
    >
      <ResumeSubsection
        v-for="({ header: subheader, entries }, j) in subsections"
        :header="subheader"
        :content="entries"
        :key="j"
      />
    </ResumeSection>
  </main>
</template>

<script>
import { sections } from '@/resume';
import ResumeSection from '@/components/ResumeSection';
import ResumeSubsection from '@/components/ResumeSubsection';

export default {
  name: 'Resume',
  components: { ResumeSection, ResumeSubsection },
  data: function() {
    return { sections }
  }
}
</script>
