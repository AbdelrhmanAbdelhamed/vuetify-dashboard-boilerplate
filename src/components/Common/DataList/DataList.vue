<script>
import { debounce, pick, isEqual } from 'lodash'
import { invokeOrReturn, isEmpty, removeEmptyAttrs } from '@utils'

import crudable from '@mixins/crudable/crudable'

import DataListTableView from '../DataListTableView/DataListTableView.vue'

const FETCH_LIST_DEBOUNCE_WAIT_TIME = 300

const DEFAULT_LIST_OPTIONS = {
  page: 1,
  itemsPerPage: 10,
  sortBy: ['createdAt'],
  sortDesc: [true],
  groupBy: [],
  groupDesc: [],
  multiSort: false,
  mustSort: false,
}

export default {
  components: { DataListTableView },
  mixins: [crudable],
  inheritAttrs: false,
  props: {
    headers: {
      type: Array,
      required: false,
      default: null,
    },
    filters: {
      type: Object,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      listOptions: { ...DEFAULT_LIST_OPTIONS },
    }
  },
  computed: {
    items() {
      return this.state[this.module]
    },
    canRenderDefaultView() {
      return !!this.headers
    },
    pages() {
      return this.state.pages
    },
    page() {
      return this.state.page
    },
    total() {
      return this.state.total
    },
    normalizeListOptions() {
      const listOptionsWithEmptyAttrsRemoved = removeEmptyAttrs({
        ...DEFAULT_LIST_OPTIONS,
        ...this.attrs.options,
      })
      return pick(listOptionsWithEmptyAttrsRemoved, ['page', 'sortBy', 'sortDesc', 'itemsPerPage'])
    },
    attrs: {
      get: function() {
        return {
          ...this.$attrs,
          options: this.$attrs.options
            ? { ...this.$attrs.options }
            : { ...this.listOptions, ...this.$attrs.listOptions },
        }
      },
      set: function(newValue) {
        if (!isEqual(this.attrs.options, newValue.options)) {
          this.listOptions = { ...this.listOptions, ...newValue.options }
        }
        this.$attrs = newValue
      },
    },
  },
  watch: {
    filters: {
      handler: function(newVal, oldVal) {
        this.goToPage(1)
      },
      deep: true,
    },
    items: {
      handler: function(newVal, oldVal) {
        this.$emit('items', newVal)
      },
    },
    resourcesHierarchy: {
      handler: function(newVal, oldVal) {
        if (!isEmpty(newVal)) {
          this.fetchList({ resourcesHierarchy: { ...newVal } })
        }
      },
      deep: true,
    },
  },
  created() {
    this.fetchList()
  },
  methods: {
    createItem({ item, extraPayload, resourcesHierarchy, config = {} } = {}) {
      return this.$store.dispatch(this.createActionName, {
        item,
        extraPayload,
        resourcesHierarchy,
        config: this.mergeConfig(config, {
          onSuccess: (response) => {
            if (!config?.hideSuccessMessage) {
              const message =
                invokeOrReturn(config?.successMessage, response) ||
                response.message ||
                this.$t('created_success')

              this.$dialog.notify.success(message)
            }

            // If there was an active search query while adding the new item
            !isEmpty(this.filters)
              ? // Inform the search component to clear the filters field(s)
                // and the filters field(s) watcher will refetch the data accordingly
                this.$emit('clear-filters')
              : // Otherwise Go to The page where the new item exist
                this.goToPage(1)

            this.$emit('created', response)
          },
        }),
      })
    },
    fetchList: debounce(async function({ extraPayload, resourcesHierarchy, config = {} } = {}) {
      this.loading = true
      await this.$store.dispatch(this.fetchListActionName, {
        extraPayload,
        resourcesHierarchy: resourcesHierarchy || this.resourcesHierarchy,
        config: this.mergeConfig(config, {
          params: this.normalizeListOptions,
          filters: this.filters,
          onStart: false,
          onSuccess: false,
          onError: (error, errorMessage) => {
            const message = invokeOrReturn(config?.errorMessage, error) || error.message
            this.$dialog.notify.error(message)
            this.loading = false
          },
        }),
      })
      this.loading = false
    }, FETCH_LIST_DEBOUNCE_WAIT_TIME),
    // Will fire whenever listOptions change
    // Whether explicitly through code
    // or implicitly by the datatable itself
    handleListOptionsUpdate(listOptions) {
      this.listOptions = listOptions
      this.attrs.options = { ...this.attrs.options, ...this.listOptions }

      this.fetchList()
    },
    goToPage(page) {
      if (!page) return Promise.reject(new Error('goToPage: Invalid page number'))
      // Force Re-fetch the current page
      // if initial page is null
      // or current page is same as page
      if (this.listOptions.page == null || this.listOptions.page === page) {
        this.fetchList()
      }
      // otherwise it will be handled
      // by listOptions update handler
      this.listOptions.page = page
    },
  },
}
</script>

<template>
  <div>
    <slot
      :module="module"
      :model="model"
      :fetchList="fetchList"
      :createItem="createItem"
      :goToPage="goToPage"
      :items="items"
      :pages="pages"
      :total="total"
      :force-loading="forceLoading"
      :loading="loading"
      :headers="headers"
    >
      <DataListTableView
        v-if="canRenderDefaultView"
        ref="dataListTableView"
        :module="module"
        :model="model"
        :fetch-list="fetchList"
        :create-item="createItem"
        :go-to-page="goToPage"
        :items="items"
        :pages="pages"
        :total="total"
        :force-loading="forceLoading"
        :loading="loading"
        :headers="headers"
        v-bind="attrs"
        @update:options="handleListOptionsUpdate"
        v-on="$listeners"
      >
        <template v-for="(_, slotName) of $scopedSlots" v-slot:[slotName]="scope">
          <slot :name="slotName" v-bind="{ ...scope, fetchList, createItem, goToPage }" />
        </template>
      </DataListTableView>
    </slot>
  </div>
</template>
