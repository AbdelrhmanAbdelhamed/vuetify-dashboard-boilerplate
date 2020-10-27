<script>
import listable from '@mixins/listable/listable'
import draggable from '@mixins/draggable/draggable'

import DataModel from '../DataModel/DataModel.vue'
import DataListTableViewTop from '../DataListTableViewTop/DataListTableViewTop.vue'
import ActionList from '../ActionList/ActionList.vue'

export default {
  components: {
    DataModel,
    DataListTableViewTop,
    ActionList,
  },
  mixins: [listable, draggable],
  inheritAttrs: false,
  props: {
    actionsHeaderAttrs: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  data() {
    return {
      showableActionsCount: null,
    }
  },
  computed: {
    attrs() {
      return {
        'footer-props': {
          showFirstLastPage: true,
          itemsPerPageOptions: [10, 25, 50, 100],
        },
        options: {
          page: 1,
          itemsPerPage: 10,
          sortBy: ['createdAt'],
          sortDesc: [true],
          groupBy: [],
          groupDesc: [],
          multiSort: false,
          mustSort: false,
          ...this.$attrs.options,
        },
        ...this.$attrs,
      }
    },
    shouldHideCreateAction() {
      return this.hideCreate ?? !this.$can('create', this.model)
    },
    shouldHideUpdateAction() {
      return this.hideUpdate ?? ((item) => !this.$can('update', item))
    },
    shouldHideDeleteAction() {
      return this.hideDelete ?? ((item) => !this.$can('delete', item))
    },
    shouldHideActionsHeader() {
      return this.hideActionsHeader ?? this.showableActionsCount === 0
    },
    normalizedHeaders() {
      const normalizedHeaders = [...this.headers]

      if (!this.shouldHideActionsHeader)
        normalizedHeaders.push({
          text: this.$t('actions'),
          value: 'actions',
          sortable: false,
          filterable: false,
          align: 'center',
          ...this.actionsHeaderAttrs,
        })

      return normalizedHeaders
    },
    normalizedActions() {
      return [
        {
          name: 'update',
          label: this.$t('edit'),
          iconName: 'mdi-pencil',
          hide: this.shouldHideUpdateAction,
          btnAttrs: this.updateBtnAttrs,
        },
        {
          name: 'delete',
          label: this.$t('delete'),
          iconName: 'mdi-delete',
          hide: this.shouldHideDeleteAction,
          btnAttrs: this.deleteBtnAttrs,
        },
        ...this.actions,
        {
          name: 'reorder',
          label: this.$t('reorder'),
          iconName: 'mdi-swap-vertical-circle',
          hide: !this.draggable,
          tooltipActivatorClass: this.draggingTooltipActivatorClass,
          btnAttrs: this.draggingBtnAttrs,
        },
      ]
    },
  },
  methods: {
    handleShowableActionsCount(showableActionsCount) {
      this.showableActionsCount = showableActionsCount
    },
    handleActionClick({ name, ...payload }) {
      this.$emit(name, payload)
    },
    handleRefreshAction(fetchList) {
      fetchList()
    },
  },
}
</script>

<template>
  <v-data-table
    ref="dataTable"
    :headers="normalizedHeaders"
    :items="items"
    :server-items-length="total"
    :loading="listLoading"
    v-bind="attrs"
    v-on="$listeners"
  >
    <template v-slot:top>
      <slot name="top.prepend"></slot>
      <slot name="top">
        <DataListTableViewTop
          :loading="listLoading"
          :hide-create="shouldHideCreateAction"
          :create-btn-attrs="createBtnAttrs"
          :hide-refresh="hideRefresh"
          :disable-create="disableCreate"
          :disable-refresh="disableRefresh"
          :refresh-btn-attrs="refreshBtnAttrs"
          @create="
            handleActionClick({
              ...$event,
              fetchList,
              goToPage,
              createItem,
            })
          "
          @refresh="handleRefreshAction(fetchList)"
        >
          <template v-for="(_, slotName) of $scopedSlots" v-slot:[slotName]="scope">
            <slot :name="slotName" v-bind="scope" />
          </template>
        </DataListTableViewTop>
      </slot>
      <slot name="top.append"></slot>
    </template>

    <template v-for="(_, slotName) of $scopedSlots" v-slot:[slotName]="scope">
      <slot :name="slotName" v-bind="scope" />
    </template>

    <template v-slot:item.actions="{ item: listItem }">
      <DataModel
        :ref="`dataModel-${listItem.id}`"
        v-slot="{ item, fetchItem, updateItem, deleteItem, deactivateItem }"
        :item="listItem"
        :module="module"
        :model="model"
        :go-to-page="goToPage"
        @updated="updatedListener"
        @deleted="deletedListener"
        @deactivated="deactivatedListener"
      >
        <ActionList
          :loading="listLoading"
          :item="item"
          :actions="normalizedActions"
          @showable-actions-count="handleShowableActionsCount"
          @action-clicked="
            handleActionClick({
              ...$event,
              item,
              fetchList,
              goToPage,
              createItem,
              fetchItem,
              updateItem,
              deleteItem,
              deactivateItem,
            })
          "
        >
          <template v-for="(_, slotName) of $scopedSlots" v-slot:[slotName]="scope">
            <slot :name="slotName" v-bind="scope" />
          </template>
        </ActionList>
      </DataModel>
    </template>
  </v-data-table>
</template>
