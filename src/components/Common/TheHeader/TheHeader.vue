<script>
import { authComputed } from '@state/helpers'

import LocaleSelect from '../LocaleSelect/LocaleSelect.vue'

export default {
  name: 'TheHeader',
  components: { LocaleSelect },
  props: {
    navBarMiniVariant: {
      type: Boolean,
      default: false,
    },
    drawer: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentRoute: {
        name: null,
      },
    }
  },
  computed: {
    ...authComputed,
    initialRoute() {
      return { ...this.$route, name: this.$t(this.$route.name) }
    },
  },
  watch: {
    $route(to, from) {
      // set the new route only if changed and it's not being ignored
      if (to !== from) {
        const ignoredRoutes = ['logout']
        this.currentRoute = !ignoredRoutes.includes(to.name)
          ? { ...to, name: this.$t(to.name) }
          : this.currentRoute
      }
    },
  },
}
</script>

<template>
  <v-app-bar absolute app color="transparent" flat height="75">
    <v-btn class="mr-3" elevation="1" fab small @click="$emit('click:menu')">
      <v-icon v-if="drawer && navBarMiniVariant">
        mdi-view-quilt
      </v-icon>

      <v-icon v-else>
        mdi-dots-vertical
      </v-icon>
    </v-btn>

    <v-toolbar-title
      class="hidden-sm-and-down font-weight-light"
      :class="{ 'mx-2': $vuetify.rtl }"
      v-text="currentRoute.name || initialRoute.name"
    />

    <v-spacer />

    <LocaleSelect />

    <v-btn icon large @click="$vuetify.theme.dark = !$vuetify.theme.dark">
      <v-icon> {{ $vuetify.theme.dark ? 'mdi-weather-night' : 'mdi-weather-sunny' }}</v-icon>
    </v-btn>
  </v-app-bar>
</template>
