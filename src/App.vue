<script>
import { mapState } from 'vuex'

import { toPascalCase } from '@utils/stringUtils'

import appConfig from '@/app.config'

export default {
  name: 'App',
  page: {
    // All subcomponent titles will be injected into this template.
    titleTemplate(title) {
      title = typeof title === 'function' ? title({ i18n: this.$i18n, store: this.$store }) : title
      return title ? `${title} | ${this.$t(appConfig.title)}` : this.$t(appConfig.title)
    },
  },
  components: {},
  computed: {
    ...mapState('locales', ['currentLocale']),
    LayoutComponent() {
      return this.$route.meta?.layout || require('@layouts/Main/Main.vue').default
    },
    fullPath() {
      return this.$route.fullPath
    },
  },
  watch: {
    currentLocale() {
      this.$router.push({ params: { language: this.currentLocale } })
    },
  },
  created() {
    this.$store.dispatch('locales/setCurrentLocale', this.$store.state.locales.currentLocale)

    this.unsubscribeAction = this.$store.subscribeAction({
      after: async (action, state) => {
        switch (action.type) {
          case 'auth/login':
            this.onAuthLogin(action, state)
            break
          case 'auth/logout':
            this.onAuthLogout(action, state)
            break
        }
      },
    })
  },
  beforeDestroy() {
    this.unsubscribeAction()
  },
  methods: {
    onAuthLogin() {
      if (this.$store.getters['auth/loggedIn']) {
      }
    },
    onAuthLogout({ payload } = {}) {
      const modulesToReset = ['abilities']

      modulesToReset.forEach((module) =>
        this.$store.dispatch(`${module}/reset${toPascalCase(module)}`)
      )
    },
  },
}
</script>

<template>
  <div id="app">
    <component :is="LayoutComponent" :key="LayoutComponent.name || LayoutComponent.__file">
      <!--
      Even when routes use the same component, treat them
      as distinct and create the component again.
      -->
      <v-fade-transition mode="out-in">
        <RouterView :key="fullPath" />
      </v-fade-transition>
    </component>
  </div>
</template>

<!-- This should generally be the only global CSS in the app. -->
<style lang="scss">
// stylelint-disable selector-max-type, selector-class-pattern
// Allow element/type selectors, because this is global CSS.

// Style loading bar between pages.
// https://github.com/rstacruz/nprogress
@import '~nprogress/nprogress.css';

// hide scroll bar
html {
  overflow-y: auto !important;
}

// ===
// Vendor
// ===

#nprogress .bar {
  background: var(--v-secondary-base);
}
</style>
