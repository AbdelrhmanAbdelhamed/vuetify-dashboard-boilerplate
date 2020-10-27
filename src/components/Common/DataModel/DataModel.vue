<script>
import { invokeOrReturn, isValidObjectId } from '@utils'

import crudable from '@mixins/crudable/crudable'

export default {
  mixins: [crudable],
  props: {
    item: {
      type: [Object, String],
      required: false,
      default: null,
    },
  },
  data() {
    return {
      storedItem: null,
    }
  },
  watch: {
    item: {
      handler: async function(newVal, oldVal) {
        this.storedItem = isValidObjectId(newVal) ? await this.fetchItem({ id: newVal }) : newVal
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    async fetchItem({ id, extraPayload, resourcesHierarchy, config = {} } = {}) {
      this.loading = true
      this.$emit('loading-change', this.loading)

      const item = await this.$store.dispatch(this.fetchItemActionName, {
        id,
        extraPayload,
        resourcesHierarchy,
        config: this.mergeConfig(config, {
          onStart: false,
          onSuccess: false,
          onError: (error, errorMessage) => {
            const message = invokeOrReturn(config?.errorMessage, error) || error.message
            this.$dialog.notify.error(message)

            this.loading = false
            this.$emit('loading-change', this.loading)
          },
        }),
      })

      this.loading = false
      this.$emit('loading-change', this.loading)

      return item
    },
    updateItem({ item, extraPayload, resourcesHierarchy, config = {} } = {}) {
      return this.$store.dispatch(this.updateActionName, {
        item,
        extraPayload,
        resourcesHierarchy,
        config: this.mergeConfig(config, {
          onSuccess: (response) => {
            if (!config?.hideSuccessMessage) {
              const message =
                invokeOrReturn(config?.successMessage, response) ||
                response.message ||
                this.$t('updated_success')

              this.$dialog.notify.success(message)
            }

            this.$emit('updated', response)
          },
        }),
      })
    },
    deleteItem({ extraPayload, resourcesHierarchy, config = {} } = {}) {
      this.$store.dispatch(this.deleteActionName, {
        id: this.storedItem.id,
        extraPayload,
        resourcesHierarchy,
        config: this.mergeConfig(config, {
          onSuccess: (response) => {
            if (!config?.hideSuccessMessage) {
              const message =
                invokeOrReturn(config?.successMessage, response) ||
                response.message ||
                this.$t('deleted_success')

              this.$dialog.notify.success(message)
            }

            this.$emit('deleted', response)
          },
        }),
      })
    },
    deactivateItem({ extraPayload, resourcesHierarchy, config = {} } = {}) {
      this.$store.dispatch(this.deactivateActionName, {
        id: this.storedItem.id,
        extraPayload,
        resourcesHierarchy,
        config: this.mergeConfig(config, {
          onSuccess: (response) => {
            if (!config?.hideSuccessMessage) {
              const message =
                invokeOrReturn(config?.successMessage, response) ||
                response.message ||
                this.$t('deactivated_success')

              this.$dialog.notify.success(message)
            }

            this.$emit('deactivated', response)
          },
        }),
      })
    },
  },
}
</script>

<template>
  <span>
    <slot
      :fetchItem="fetchItem"
      :updateItem="updateItem"
      :deleteItem="deleteItem"
      :deactivateItem="deactivateItem"
      :item="storedItem"
      :module="module"
      :model="model"
    >
    </slot>
  </span>
</template>
