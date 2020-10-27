<script>
export default {
  name: 'BaseTile',
  components: {},
  props: {
    tile: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    clickable() {
      return this.tile.clickable ?? true
    },
    attrs() {
      return {
        height: this.tile.height ?? '200',
        flat: this.tile.flat ?? false,
      }
    },
    listeners() {
      return this.tile.listeners || {}
    },
  },
}
</script>

<template>
  <v-hover v-slot="{ hover }">
    <v-card
      :v-ripple="clickable"
      tile
      flat
      class="text-center"
      :class="{ 'on-hover': hover, clickable: clickable, ...(tile.class || {}) }"
      v-bind="attrs"
      v-on="listeners"
    >
      <v-card-text>
        <v-icon v-if="tile.icon" size="100" :color="hover && clickable ? 'primary' : ''">{{
          tile.icon
        }}</v-icon>
        <div
          v-if="tile.title"
          class="text-h2 font-weight-light text-capitalize"
          :class="{ 'primary--text': hover && clickable }"
          >{{ tile.title }}</div
        >
      </v-card-text>
    </v-card>
  </v-hover>
</template>

<style lang="scss" scoped>
// stylelint-disable selector-class-pattern
.v-card.clickable {
  cursor: pointer;
  transition: opacity 0.4s ease-in-out;
}
.v-card.clickable:not(.on-hover) {
  opacity: 0.6;
}
</style>
