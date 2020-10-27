<script>
import { availableLanguages } from '@plugins/i18n'

export default {
  name: 'LocaleSelect',
  inheritAttrs: false,
  data() {
    return {
      availableLanguages,
    }
  },
  computed: {
    attrs() {
      return {
        items: this.availableLanguages,
        solo: true,
        'background-color': 'transparent',
        flat: true,
        'prepend-icon': 'mdi-translate',
        'hide-details': true,
        ...this.$attrs,
      }
    },
    listeners() {
      return {
        ...this.$listeners,
        input: (value) => {
          this.$emit('input', value)
        },
      }
    },
    currentLocale: {
      get: function() {
        return this.$store.state.locales.currentLocale
      },
      set: function(newVal) {
        this.$store.dispatch('locales/setCurrentLocale', newVal)
      },
    },
  },
}
</script>

<template>
  <v-col cols="auto">
    <v-select
      v-model="currentLocale"
      :class="$style['v-select__selection']"
      item-text="name"
      item-value="code"
      v-bind="attrs"
      v-on="listeners"
    >
    </v-select>
  </v-col>
</template>

<style lang="scss" module>
/* stylelint-disable selector-class-pattern */
.v-select__selection input {
  width: 25px;
}
</style>
