<script>
import Loading from 'vue-loading-overlay'

export default {
  name: 'VDialogOverlay',
  components: { Loading },
  props: {
    zIndex: {
      type: Number,
      default: () => 1250,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<template>
  <Loading
    loader="dots"
    :active.sync="visible"
    :can-cancel="false"
    color="var(--v-primary-base)"
    :height="128"
    :width="128"
  ></Loading>
</template>
