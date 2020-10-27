<script>
import Themeable from 'vuetify/lib/mixins/themeable'

export default {
  name: 'TheNavbarItem',
  mixins: [Themeable],
  props: {
    item: {
      type: Object,
      default: () => ({
        href: undefined,
        icon: undefined,
        subtitle: undefined,
        title: undefined,
        to: undefined,
      }),
    },
    text: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    computedText() {
      if (!this.item || !this.item.title) return ''

      let text = ''

      this.item.title.split(' ').forEach((val) => {
        text += val.substring(0, 1)
      })

      return text
    },
    href() {
      return this.item.href || (!this.item.to ? '#' : undefined)
    },
  },
}
</script>

<template>
  <v-list-item
    :href="href"
    :rel="href && href !== '#' ? 'noopener' : undefined"
    :target="href && href !== '#' ? '_blank' : undefined"
    :to="{
      name: item.to,
      params: { language: $store.state.locales.currentLocale },
    }"
    :replace="Boolean(item.replace)"
    exact
    :active-class="`primary ${!isDark ? 'black' : 'white'}--text`"
    class="justify-start"
  >
    <v-list-item-icon v-if="text" class="v-list-item__icon--text" v-text="computedText" />

    <v-list-item-icon v-else-if="item.icon">
      <v-icon v-text="item.icon" />
    </v-list-item-icon>

    <v-list-item-avatar v-else-if="item.avatar" class="align-self-center" color="white" contain>
      <v-img :src="item.avatar" />
    </v-list-item-avatar>

    <v-list-item-content v-if="item.title || item.subtitle">
      <v-list-item-title v-text="item.title" />

      <v-list-item-subtitle v-text="item.subtitle" />
    </v-list-item-content>
  </v-list-item>
</template>
