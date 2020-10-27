<script>
export default {
  inheritAttrs: false,
  props: {
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    hideCreate: {
      type: Boolean,
      required: false,
      default: false,
    },
    hideRefresh: {
      type: Boolean,
      required: false,
      default: false,
    },
    disableCreate: {
      type: Boolean,
      required: false,
      default: false,
    },
    disableRefresh: {
      type: Boolean,
      required: false,
      default: false,
    },
    createBtnAttrs: {
      type: Object,
      required: false,
      default: () => ({
        depressed: true,
        color: 'primary',
      }),
    },
    refreshBtnAttrs: {
      type: Object,
      required: false,
      default: () => ({
        depressed: true,
        color: 'secondary',
      }),
    },
  },
  computed: {
    attrs() {
      return {
        flat: true,
        ...this.$attrs,
      }
    },
    shouldRender() {
      return !this.hideCreate || !this.hideRefresh
    },
  },
}
</script>

<template>
  <div>
    <v-toolbar v-if="shouldRender" v-bind="attrs" color="transparent">
      <v-spacer />
      <v-btn
        v-if="!hideCreate"
        v-bind="createBtnAttrs"
        :disabled="loading || disableCreate"
        class="ma-1 white--text"
        elevation="1"
        @click="$emit('create', { name: 'create', item: {} })"
      >
        {{ createBtnAttrs.label || $t('add_new') }}
        <v-icon class="ma-1 white--text">{{ createBtnAttrs.iconName || 'mdi-plus' }}</v-icon>
      </v-btn>

      <v-btn
        v-if="!hideRefresh"
        v-bind="refreshBtnAttrs"
        :disabled="loading || disableRefresh"
        class="ma-1 white--text"
        elevation="1"
        @click="$emit('refresh')"
      >
        {{ refreshBtnAttrs.label || $t('refresh') }}
        <v-icon class="ma-1 white--text">{{ refreshBtnAttrs.iconName || 'mdi-refresh' }}</v-icon>
      </v-btn>

      <template v-for="(_, slotName) of $scopedSlots" v-slot:[slotName]="scope">
        <slot :name="slotName" v-bind="scope" />
      </template>
    </v-toolbar>
  </div>
</template>
