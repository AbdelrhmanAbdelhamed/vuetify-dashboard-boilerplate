<script>
import filterable from '@mixins/filterable/filterable'

import DataList from '@components/Common/DataList/DataList.vue'
import UserInputForm from '../UserInputForm/UserInputForm.vue'

import ResetPassword from '@components/Common/ResetPassword/ResetPassword.vue'

import { UserModel } from '@models'

export default {
  components: { DataList, ResetPassword },
  mixins: [filterable],
  inheritAttrs: false,
  data() {
    return {
      loading: false,
      headers: [
        { text: 'Avatar', value: 'avatar', sortable: false },
        { text: 'Full Name', value: 'fullName', sortable: false },
        { text: 'Email', value: 'email' },
      ],
      actions: [
        {
          name: 'reset-password',
          label: this.$t('reset_item', { item: this.$t('password') }),
          hide: (item) => !this.$can('update', item),
        },
      ],
    }
  },
  computed: {
    attrs() {
      return {
        module: 'users',
        model: 'User',
        ...this.$attrs,
      }
    },
  },
  methods: {
    async handleCreateAction({ createItem, fetchList, goToPage }) {
      await this.$dialog.showAndWait(UserInputForm, {
        title: this.$t('add_new_item', { item: this.$tc('user', 1) }),
        width: '1050px',
        persistent: true,
        props: {
          item: new UserModel(),
          createOrUpdateAction: (item, config = {}) =>
            createItem({
              item,
              config: {
                successMessage: this.$t('item_created_success', {
                  item: this.$tc('user', 1),
                }),
                ...config,
              },
            }),
          fetchList,
          goToPage,
        },
      })
    },
    async handleUpdateAction({ item, updateItem, fetchList, goToPage }) {
      await this.$dialog.showAndWait(UserInputForm, {
        title: this.$t('edit_item', { item: this.$tc('user', 1) }),
        width: '1050px',
        persistent: true,
        props: {
          item,
          createOrUpdateAction: (item, config = {}) =>
            updateItem({
              item,
              config: {
                successMessage: this.$t('item_updated_success', {
                  item: this.$tc('user', 1),
                }),
                ...config,
              },
            }),
          fetchList,
          goToPage,
        },
      })
    },
    async handleDeleteAction({ item, deleteItem, fetchList, goToPage }) {
      if (typeof deleteItem !== 'function')
        return Promise.reject(new Error('Please provide a deleteItem action/function'))

      const deleteConfirm = await this.$dialog.confirm({
        text: `${this.$t('delete_confirmation_text')} ${item.fullName}?`,
        title: this.$t('delete_item', { item: `${item.fullName}` }),
      })
      if (deleteConfirm) {
        return await deleteItem({
          config: {
            successMessage: this.$t('item_deleted_success', {
              item: this.$tc('user', 1),
            }),
          },
        })
      }
    },
  },
}
</script>

<template>
  <base-material-card icon="mdi-account-multiple" class="px-5 py-3">
    <v-card-title>
      <BaseSearch
        name="userSearch"
        :label="
          $t('item_search', {
            item: this.$tc('user', 2),
          })
        "
        :hint="
          $t('item_search_hint', {
            item: $tc('user', 1),
          })
        "
        :loading="loading"
        :value="filters.query"
        @change="filters.query = $event"
      />
    </v-card-title>
    <v-card-text>
      <DataList
        :headers="headers"
        :filters="filters"
        :actions="actions"
        v-bind="attrs"
        @loading-change="loading = $event"
        @clear-filters="handleClearFilters"
        @create="handleCreateAction"
        @update="handleUpdateAction"
        @delete="handleDeleteAction"
      >
        <template v-slot:item.avatar="{ value }">
          <v-avatar>
            <img :src="value" alt="avatar" />
          </v-avatar>
        </template>

        <template v-slot:action.reset-password="{ item }">
          <ResetPassword :disabled="loading" :user-data="{ email: item.email, type: 'user' }" />
        </template>

        <template v-for="(_, slotName) of $scopedSlots" v-slot:[slotName]="scope">
          <slot :name="slotName" v-bind="scope" />
        </template>
      </DataList>
    </v-card-text>
  </base-material-card>
</template>
