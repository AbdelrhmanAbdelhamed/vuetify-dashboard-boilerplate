<script>
import { invokeOrReturn } from '@utils'

export default {
  name: 'BaseTileList',
  components: {},
  props: {
    tiles: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    showableTiles() {
      return this.tiles.filter((tile) => !invokeOrReturn(tile.hide)) || []
    },
  },
}
</script>

<template>
  <v-row justify="center" align="center">
    <v-col
      v-for="(tile, index) in showableTiles"
      :key="index"
      xl="3"
      lg="3"
      md="3"
      sm="12"
      cols="12"
      class="text-center"
    >
      <BaseTile :tile="tile" />
    </v-col>
  </v-row>
</template>
