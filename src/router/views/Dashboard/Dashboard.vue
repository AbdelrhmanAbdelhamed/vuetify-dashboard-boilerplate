<script>
import appConfig from '@/app.config'

export default {
  name: 'Dashboard',
  page: {
    title: ({ i18n, store }) => {
      return i18n.t('dashboard')
    },
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {},
  data() {
    return {}
  },
}
</script>

<template>
  <v-container></v-container>
</template>
