<script>
import { generateAttrs, invokeOrReturn } from '@utils'

export default {
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Function],
      required: true,
    },
    iconName: {
      type: [String, Function],
      required: false,
      default: null,
    },
    label: {
      type: [String, Function],
      required: false,
      default: null,
    },
    tooltipActivatorClass: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    btnAttrs: {
      type: Object,
      required: false,
      default: () => ({
        color: 'primary',
        class: 'white--text',
      }),
    },
    item: {
      type: Object,
      required: false,
      default: null,
    },
  },
  computed: {
    hasIcon() {
      return !!this.iconName
    },
    generatedBtnAttrs() {
      return generateAttrs(this.btnAttrs, this.item)
    },
    computedLabelOrName() {
      return invokeOrReturn(this.label, this.item) || invokeOrReturn(this.name, this.item)
    },
    computedIconName() {
      return invokeOrReturn(this.iconName, this.item)
    },
  },
}
</script>

<template>
  <v-tooltip v-if="item" bottom>
    <template v-slot:activator="{ on }">
      <span
        id="item-getter"
        :class="tooltipActivatorClass"
        :data-id="item.id"
        :data-name="item.name"
        :data-title="item.title"
        :data-index="item.index"
      >
        <v-btn
          class="ma-2"
          :icon="hasIcon"
          v-bind="generatedBtnAttrs"
          v-on="hasIcon ? { ...on, ...$listeners } : $listeners"
        >
          <v-icon v-if="hasIcon">
            {{ computedIconName }}
          </v-icon>

          <span v-else>
            {{ computedLabelOrName }}
          </span>
        </v-btn>
      </span>
    </template>

    <span> {{ computedLabelOrName }} </span>
  </v-tooltip>
</template>
