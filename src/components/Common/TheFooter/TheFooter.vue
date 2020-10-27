<script>
import { version } from '~/package.json'

export default {
  name: 'TheFooter',
  data() {
    return {
      environmentColors: {
        development: 'light-green',
        staging: 'light-blue',
        production: 'red darken-1',
      },
    }
  },
  computed: {
    currentYear() {
      return new Date().getFullYear()
    },
    dashboardVersion() {
      const buildNumber = process.env.VUE_APP_BUILD_NUMBER
      return `v${version}.${buildNumber}`
    },
    environment() {
      return {
        name: process.env.VUE_APP_MODE,
        color: this.environmentColors[process.env.VUE_APP_MODE],
      }
    },
    shouldShowEnvironmentChip() {
      return this.environment.name !== 'production'
    },
  },
}
</script>

<template>
  <v-footer id="dashboard-core-footer">
    <v-container>
      <v-row align="center" justify="end" no-gutters>
        <v-col cols="6" class="text-body-1 font-weight-light text-center">
          &copy; Copyright {{ currentYear }}
        </v-col>
        <v-col cols="6" class="text-body-1 font-weight-light text-center">
          <v-chip
            v-if="shouldShowEnvironmentChip"
            :color="environment.color"
            class="ma-1"
            text-color="white"
            label
          >
            <v-icon color="white" small left>mdi-server</v-icon>
            <span class="text-uppercase">{{ environment.name }}</span>
          </v-chip>
          <v-chip color="primary" text-color="white" label>
            <v-icon color="white" small left>mdi-label</v-icon> {{ dashboardVersion }}.beta
          </v-chip>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<style lang="sass">
// stylelint-disable selector-id-pattern

#dashboard-core-footer
    font-size: .825rem
    font-weight: 500
    text-decoration: none
    text-transform: uppercase
</style>
