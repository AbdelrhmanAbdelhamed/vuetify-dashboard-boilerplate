<script>
export default {
  page: {
    title: ({ i18n, store }) => {
      return i18n.t('not_found')
    },
    meta: [{ name: 'description', content: `404 not found` }],
  },
  components: {},
  props: {
    language: {
      type: String,
      required: false,
      default: 'en',
    },
    resource: {
      type: String,
      required: false,
      default: '',
    },
  },
  created() {
    this.$ssrContext && this.$ssrContext.res.status(404)
  },
}
</script>

<template>
  <v-container class="text-center fill-height" style="height: calc(100vh - 119px);">
    <v-row align="center">
      <v-col>
        <h1 class="text-h3 primary--text">
          Whoops, 404
          <span v-if="resource"> {{ resource }} </span>
          not found
        </h1>

        <p>The page you were looking for does not exist</p>

        <v-btn to="/" color="primary" outlined>
          Get me out of here!
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
