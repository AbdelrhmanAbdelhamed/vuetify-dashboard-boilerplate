---
to: src/components/<%= h.changeCase.pascal(h.inflection.pluralize(name)) %>/<%= h.changeCase.pascal(h.inflection.singularize(name)) %>List/<%= h.changeCase.pascal(h.inflection.singularize(name)) %>List.vue
eof_last: false
---
<%
 name = h.changeCase.camel(h.inflection.singularize(name))
 name_ = h.changeCase.snake(h.inflection.singularize(name))
 names = h.changeCase.camel(h.inflection.pluralize(name))
 Name = h.changeCase.pascal(h.inflection.singularize(name))
 NameTitle = h.changeCase.title(h.inflection.singularize(name))
%>
<script>
import filterable from '@mixins/filterable/filterable'

import DataList from '@components/Common/DataList/DataList.vue'
import <%= Name %>InputForm from '../<%= Name %>InputForm/<%= Name %>InputForm.vue'

import { <%= Name %>Model } from '@models'

export const defaultCardAttrs = { hideHeading: false, icon: '', flat: false }

export default {
  components: { DataList },
  mixins: [filterable],
  inheritAttrs: false,
  props: {
    cardAttrs: {
      type: Object,
      required: false,
      default: () => defaultCardAttrs,
    },
  },
  data() {
    return {
      loading: false,
      headers: [],
      actions: [],
      draggable: <%= draggable %>
    }
  },
  computed: {
    computedCardAttrs() {
      return { ...defaultCardAttrs, ...this.cardAttrs }
    },
    attrs() {
      return {
        module: '<%= names %>',
        model: '<%= Name %>',
        ...this.$attrs,
      }
    },
  },
  methods: {
    async handleCreateAction({ createItem, fetchList, goToPage }) {
      await this.$dialog.showAndWait(<%= Name %>InputForm, {
        title: 'Add New <%= NameTitle %>',
        width: '600px',
        persistent: true,
        props: {
          item: new <%= Name %>Model(),
          createOrUpdateAction: (item, config = {}) =>
            createItem({
              item,
              config: {
                successMessage: this.$t('item_created_success', {
                  item: this.$tc('<%= name %>', 1),
                }),
                ...config
              },
            }),
          fetchList,
          goToPage,
        },
        listeners: {},
      })
    },
    async handleUpdateAction({ item, updateItem, fetchList, goToPage }) {
      await this.$dialog.showAndWait(<%= Name %>InputForm, {
        title: 'Edit <%= NameTitle %>',
        width: '600px',
        persistent: true,
        props: {
          item,
          createOrUpdateAction: (item, config = {}) =>
            updateItem({
              item,
              config: {
                successMessage: this.$t('item_updated_success', {
                  item: this.$tc('<%= name %>', 1),
                }),
                ...config
              },
            }),
          fetchList,
          goToPage,
        },
        listeners: {},
      })
    },
    async handleDeleteAction({ item, deleteItem, fetchList, goToPage }) {
      if (typeof deleteItem !== 'function')
        return Promise.reject(new Error('Please provide a deleteItem action/function'))

      const deleteConfirm = await this.$dialog.confirm({
        text: this.$t('delete_confirmation_text'),
        title: this.$t('delete_item', { item: '' }),
      })
      if (deleteConfirm) {
        return await deleteItem({
          config: {
            successMessage: this.$t('item_deleted_success', {
              item: this.$tc('<%= name %>', 1),
            }),
          },
        })
      }
    },
  },
}
</script>

<template>
  <base-material-card v-bind="computedCardAttrs" class="px-5 py-3">
  <% if (includeBaseSearch) { %>
    <v-card-title>
      <BaseSearch
        name="<%= name %>Search"
        :label="
          $t('item_search', {
            item: $tc('<%= name_ %>', 2),
          })
        "
        :hint="
          $t('item_search_hint', {
            item: $tc('<%= name_ %>', 1),
          })
        "
        :loading="loading"
        :value="filters.query"
        @change="filters.query = $event"
      />
    </v-card-title>
<% } %>
    <v-card-text>
      <DataList
        :headers="headers"
        :actions="actions"
        :filters="filters"
        :draggable="draggable"
        v-bind="attrs"
        @loading-change="loading = $event"
        @clear-filters="handleClearFilters"
        @create="handleCreateAction"
        @update="handleUpdateAction"
        @delete="handleDeleteAction"
      >
        <template v-for="(_, slotName) of $scopedSlots" v-slot:[slotName]="scope">
          <slot :name="slotName" v-bind="scope" />
        </template>
      </DataList>
    </v-card-text>
  </base-material-card>
</template>
