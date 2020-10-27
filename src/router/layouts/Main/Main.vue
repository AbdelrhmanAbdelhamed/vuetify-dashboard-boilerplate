<script>
import { authComputed } from '@state/helpers'
import TheHeader from '@components/Common/TheHeader/TheHeader.vue'
import TheNavbar from '@components/Common/TheNavbar/TheNavbar.vue'
import TheFooter from '@components/Common/TheFooter/TheFooter.vue'

export default {
  name: 'Main',
  components: { TheHeader, TheNavbar, TheFooter },
  data() {
    return {
      drawer: true,
      navBarMiniVariant: false,
    }
  },
  computed: {
    ...authComputed,
    path() {
      return this.$route.path
    },
  },
  methods: {
    handleMenuClick() {
      if (!this.drawer) this.drawer = true
      else this.navBarMiniVariant = !this.navBarMiniVariant
    },
  },
}
</script>

<template>
  <v-app>
    <TheHeader
      v-if="loggedIn"
      :nav-bar-mini-variant="navBarMiniVariant"
      :drawer="drawer"
      @click:menu="handleMenuClick"
    />
    <v-main :class="{ [$style.loginBackground]: !loggedIn }">
      <v-container :class="{ 'fill-height': !loggedIn }" :fluid="loggedIn">
        <TheNavbar
          v-if="loggedIn"
          v-model="drawer"
          :mini-variant="navBarMiniVariant"
          :expand-on-hover="navBarMiniVariant"
        />
        <slot />
      </v-container>
    </v-main>
    <TheFooter />
  </v-app>
</template>

<style module>
.loginBackground {
  background-image: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url('~@/assets/images/login.d6d3bb09.jpg');
  background-position: center center;
}
</style>
