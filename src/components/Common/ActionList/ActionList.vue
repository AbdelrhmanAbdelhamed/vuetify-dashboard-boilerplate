<script>
import { invokeOrReturn } from '@utils'

import ActionListItem from '../ActionListItem/ActionListItem.vue'

export default {
  components: {
    ActionListItem,
  },
  props: {
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    actions: {
      type: Array,
      required: true,
    },
    item: {
      type: Object,
      required: false,
      default: null,
    },
    index: {
      type: Number,
      required: false,
      default: -1,
    },
  },
  computed: {
    showableActions() {
      const showableActions =
        this.actions?.filter((action) => !invokeOrReturn(action.hide, this.item)) || []
      this.$emit('showable-actions-count', showableActions.length)
      return showableActions
    },
  },
  methods: {
    handleActionClick({ name, action, item }) {
      this.$emit('action-clicked', { name: action.name, action, item, index: this.index })
      this.$emit(action.name, { name: action.name, action, item, index: this.index })
    },
  },
}
</script>

<template>
  <v-row>
    <v-col>
      <template v-for="action of showableActions">
        <slot :name="`action.${action.name}`" :action="action" :item="item">
          <ActionListItem
            :disabled="loading"
            :item="item"
            :name="action.name"
            :label="action.label"
            :icon-name="action.iconName"
            :btn-attrs="action.btnAttrs"
            :tooltip-activator-class="action.tooltipActivatorClass"
            @click="handleActionClick({ name: action.name, action, item })"
          />
        </slot>
      </template>

      <template v-if="!showableActions.length">
        <!-- Added empty div with the default size if the list is empty to maintain consistent space/look -->
        <div class="v-btn--icon v-size--default"></div>
      </template>
    </v-col>
  </v-row>
</template>
