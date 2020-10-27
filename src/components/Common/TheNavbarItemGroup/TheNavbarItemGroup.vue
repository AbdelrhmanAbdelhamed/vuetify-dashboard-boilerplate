<script>
// Utilities
import { toKebabCase } from '@utils/stringUtils'

export default {
  name: 'TheNavbarItemGroup',
  components: {
    TheNavbarItem: () => import('../TheNavbarItem/TheNavbarItem.vue'),
    TheNavbarItemSubGroup: () => import('../TheNavbarItemSubGroup/TheNavbarItemSubGroup.vue'),
  },
  inheritAttrs: false,
  props: {
    barColor: {
      type: String,
      required: false,
      default: '#4CAF50',
    },
    item: {
      type: Object,
      default: () => ({
        avatar: undefined,
        group: undefined,
        title: undefined,
        children: [],
      }),
    },
    subGroup: {
      type: Boolean,
      default: false,
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
    group() {
      return this.genGroup({ parent: this.item, children: this.item.children })
    },
  },
  methods: {
    genGroup({ parent, children }) {
      return children
        .filter((item) => item.to)
        .map((item) => {
          let group = `${toKebabCase(parent.to)}/${toKebabCase(item.to)}`

          if (item.children) {
            group = `${group}|${this.genGroup({ parent: item, children: item.children })}`
          }

          return group
        })
        .join('|')
    },
  },
}
</script>

<template>
  <v-list-group
    :group="group"
    :prepend-icon="item.icon"
    :sub-group="subGroup"
    append-icon="mdi-menu-down"
    :color="
      barColor !== 'rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.7)' ? 'white' : 'grey darken-1'
    "
  >
    <template v-slot:activator>
      <v-list-item-icon v-if="text" class="v-list-item__icon--text" v-text="computedText" />

      <v-list-item-avatar v-else-if="item.avatar" class="align-self-center" color="white" contain>
        <v-img :src="item.avatar" />
      </v-list-item-avatar>

      <v-list-item-content v-if="item.title || item.subtitle">
        <v-list-item-title v-text="item.title" />

        <v-list-item-subtitle v-text="item.subtitle" />
      </v-list-item-content>
    </template>

    <template v-for="(child, index) in item.children">
      <TheNavbarItemSubGroup v-if="child.children" :key="`sub-group-${index}`" :item="child" />

      <TheNavbarItem v-else :key="`item-${index}`" :item="child" />
    </template>
  </v-list-group>
</template>

<style lang="scss">
// stylelint-disable selector-class-pattern

.v-list-group__activator p {
  margin-bottom: 0;
}
</style>
