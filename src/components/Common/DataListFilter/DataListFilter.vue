<script>
import { cloneDeep, debounce, isNil, isEqual } from 'lodash'
import { valuesToObject, invokeOrReturn } from '@utils'

const FETCH_LIST_DEBOUNCE_WAIT_TIME = 300

const parseEquality = (filter) => {
  const itemFilterKey = filter.itemFilterKey ?? filter.attrs['item-value']

  const parseItem = (item) => {
    if (isNil(item)) return item
    return item[itemFilterKey] ?? item
  }

  const filterInput = Array.isArray(filter.input)
    ? filter.input.map(parseItem)
    : parseItem(filter.input)

  return {
    [filter.value]: typeof filterInput === 'string' ? filterInput.trim() : filterInput,
  }
}

const defaultFilterOptions = {
  text: [{ text: 'Equal', value: 'equal', parseFilter: parseEquality }],
  lookup: [{ text: 'Is', value: 'is', parseFilter: parseEquality }],
}

const defaultfilterComponents = {
  text: {
    component: () => import('vuetify/lib/components/VTextField'),
  },
  lookup: {
    component: () => import('vuetify/lib/components/VAutocomplete'),
  },
}

export default {
  name: 'DataListFilter',
  inheritAttrs: false,
  props: {
    title: {
      type: String,
      required: false,
      default: function() {
        return this.$t('filters')
      },
    },
    filters: {
      type: Array,
      required: true,
      validator: (value) => value.length > 0,
    },
    filterOptions: {
      type: Object,
      required: false,
      default: () => ({
        ...defaultFilterOptions,
      }),
    },
    filterComponents: {
      type: Object,
      required: false,
      default: () => ({
        ...defaultfilterComponents,
      }),
    },
  },
  data() {
    return {
      selectedFilters: [],
      normalizedFilters: [],
      filtersLoadingStateMap: {},
    }
  },
  computed: {
    canRenderResetFiltersButton() {
      return this.selectedFilters.some((selectedFilter) => {
        return !!selectedFilter.input
      })
    },
    canRenderAddFiltersButton() {
      return this.selectedFilters.length < this.normalizedFilters.length
    },
  },
  async created() {
    this.normalizedFilters = this.normalizeFilters(this.filters)
  },
  methods: {
    canRenderSelectedFilterOptions(selectedFilter) {
      return selectedFilter.type && this.getFilterOptions(selectedFilter).length > 1
    },
    async assignFilterInputItems(selectedFilter, responsibleFilter) {
      const targetFilterData = this.filters.find((filter) => selectedFilter.value === filter.value)

      const selectedFiltersMap = valuesToObject({ values: this.selectedFilters, key: 'value' })

      for (const attrKey in targetFilterData.attrs) {
        if (
          typeof targetFilterData.attrs[attrKey] === 'function' &&
          (!responsibleFilter ||
            (responsibleFilter && targetFilterData.dependsOn?.includes(responsibleFilter.value)))
        ) {
          const normalizedFilter = this.normalizedFilters.find(
            (normalizedFilter) => normalizedFilter.value === targetFilterData.value
          )

          this.$set(this.filtersLoadingStateMap, selectedFilter.value, true)
          const updatedAttr = await targetFilterData.attrs[attrKey](selectedFiltersMap)
          this.$set(this.filtersLoadingStateMap, selectedFilter.value, false)

          if (normalizedFilter && !isEqual(normalizedFilter.attrs[attrKey], updatedAttr)) {
            normalizedFilter.attrs[attrKey] = updatedAttr
            normalizedFilter.input = null
          }

          if (selectedFilter && !isEqual(selectedFilter.attrs[attrKey], updatedAttr)) {
            selectedFilter.attrs[attrKey] = updatedAttr
            selectedFilter.input = null
          }

          await this.assignSelectedFilterListAttrs(selectedFilter)
        }
      }
    },
    async assignSelectedFilterItemAttrs(filter, responsibleFilter) {
      await this.assignFilterInputItems(filter, responsibleFilter)
    },
    async assignSelectedFilterListAttrs(responsibleFilter) {
      await Promise.all(
        this.selectedFilters.map((selectedFilter) =>
          this.assignSelectedFilterItemAttrs(selectedFilter, responsibleFilter)
        )
      )
    },

    normalizeFilters(filters = []) {
      const defaultAttrs = {
        label: this.$t('value'),
      }
      const normalizedFilters = []

      filters.forEach(async (filter) => {
        if (!invokeOrReturn(filter.hide)) {
          const normalizedFilter = {
            ...cloneDeep(filter),
            disabled: false,
          }
          const attrs = normalizedFilter.attrs || this.getFilterComponent(normalizedFilter).attrs

          normalizedFilter.attrs = { ...defaultAttrs, ...attrs }
          normalizedFilters.push(normalizedFilter)
        }
      })
      return normalizedFilters
    },
    getItems(filter) {
      return Array.isArray(filter.attrs.items) ? filter.attrs.items : []
    },
    getFilterOptions(filter) {
      const targetFilterOptions = this.filterOptions[filter?.type]

      if (!targetFilterOptions)
        return Promise.reject(new Error('Invalid Filter, cannot obtain filter options'))

      return targetFilterOptions
    },
    getFilterComponent(filter) {
      const targetFilterComponent = this.filterComponents[filter?.type]

      if (!targetFilterComponent)
        return Promise.reject(new Error('Invalid Filter, cannot obtain filter component'))

      return targetFilterComponent
    },
    assignDisabledFilters() {
      this.normalizedFilters.forEach((normalizedFilter) => {
        normalizedFilter.disabled = false
        this.selectedFilters.forEach((selectedFilter) => {
          selectedFilter.disabled = false
          if (normalizedFilter.value === selectedFilter.value)
            normalizedFilter.disabled = selectedFilter.disabled = true
        })
      })
    },
    async handleFilterChange(filterData, index) {
      const clonedFilterData = cloneDeep(filterData)

      this.$set(this.selectedFilters, index, {
        ...clonedFilterData,
        filterOption: this.getFilterOptions(filterData)[0], // Auto select and use first option
      })

      this.addMissingDependsOnFilters(clonedFilterData)

      await this.assignSelectedFilterItemAttrs(clonedFilterData)

      this.assignDisabledFilters()
    },
    addMissingDependsOnFilters(dependerFilter) {
      if (dependerFilter.dependsOn?.length > 0) {
        dependerFilter.dependsOn.forEach((dependeeFilterValue) => {
          const dependeeFilterMissing = !this.selectedFilters.find(
            (selectedFilter) => selectedFilter.value === dependeeFilterValue
          )

          if (dependeeFilterMissing) {
            const dependeeFilter = this.normalizedFilters.find(
              (normalizedFilter) => normalizedFilter.value === dependeeFilterValue
            )
            if (dependeeFilter) {
              this.addFilter()
              this.handleFilterChange(dependeeFilter, this.selectedFilters.length - 1)
            }
          }
        })
      }
    },
    async handleSelectedFilterInput(selectedFilterInput, selectedFilter) {
      selectedFilter.input = selectedFilterInput

      await this.assignSelectedFilterListAttrs(selectedFilter)

      this.emitSelectedFilters()
    },
    handleSelectedFilterOptionChange(selectedFilterOption, selectedFilter) {
      selectedFilter.filterOption = selectedFilterOption

      const canEmitSelectedFilters =
        (Array.isArray(selectedFilter.input) && selectedFilter.input.length > 0) ||
        (!Array.isArray(selectedFilter.input) &&
          !isNil(selectedFilter.input) &&
          selectedFilter.input !== '')

      if (canEmitSelectedFilters) {
        this.emitSelectedFilters()
      }
    },
    addFilter(props = {}) {
      this.selectedFilters.push({
        text: null,
        value: null,
        type: null,
        filterOption: null,
        input: '',
        dependsOn: [],
        searchFilterKey: null,
        attrs: {},
        listeners: {},
        disabled: false,
        ...props,
      })
    },
    removeFilter(selectedFilter, index) {
      const canRemoveFilter =
        this.selectedFilters.length > 0 && index >= 0 && index < this.selectedFilters.length

      if (canRemoveFilter) {
        this.selectedFilters.splice(index, 1)
        this.assignDisabledFilters()

        if (selectedFilter.input) {
          this.emitSelectedFilters()
        }
      }
    },
    resetSelectedFilters() {
      this.selectedFilters = []
      this.assignDisabledFilters()
      this.emitSelectedFilters()
    },
    validateFilters() {
      return (
        !this.$refs.filterRefs || !this.$refs.filterRefs.some((filterRef) => !filterRef.validate())
      )
    },
    emitSelectedFilters: debounce(function() {
      if (!this.validateFilters()) return

      const parsedSelectedFilters = Object.assign(
        {},
        ...this.selectedFilters.map((selectedFilter) => {
          return selectedFilter.filterOption.parseFilter(selectedFilter)
        })
      )
      this.$emit('selected-filters-change', parsedSelectedFilters)
    }, FETCH_LIST_DEBOUNCE_WAIT_TIME),
  },
}
</script>

<template>
  <div>
    <span>
      <span class="mx-1 text-h4">
        {{ title }}
      </span>
      <v-btn
        v-if="canRenderAddFiltersButton"
        color="primary"
        fab
        x-small
        elevation="0"
        @click="addFilter"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn
        v-if="canRenderResetFiltersButton"
        class="mx-1"
        color="error"
        text
        small
        elevation="0"
        @click="resetSelectedFilters"
      >
        {{ $t('reset_item', { item: $t('filters') }) }}
      </v-btn>
    </span>

    <v-row v-for="(selectedFilter, index) in selectedFilters" :key="index">
      <v-col v-if="selectedFilters.length > 0" lg="1" cols="12" class="mt-lg-4 ml-lg-4">
        <v-btn color="error" fab x-small elevation="0" @click="removeFilter(selectedFilter, index)">
          <v-icon>mdi-minus</v-icon>
        </v-btn>
      </v-col>

      <v-col lg="3" cols="12">
        <v-autocomplete
          outlined
          :label="$t('filter_by')"
          :placeholder="$t('select_filter')"
          :items="normalizedFilters"
          item-text="text"
          item-value="value"
          return-object
          :value="selectedFilter"
          @change="handleFilterChange($event, index)"
        ></v-autocomplete>
      </v-col>
      <v-col v-if="canRenderSelectedFilterOptions(selectedFilter)" lg="3" cols="12">
        <v-autocomplete
          outlined
          :value="selectedFilter.filterOption"
          label="Using"
          :items="getFilterOptions(selectedFilter)"
          item-text="text"
          item-value="value"
          return-object
          @change="handleSelectedFilterOptionChange($event, selectedFilter)"
        ></v-autocomplete>
      </v-col>
      <v-col v-if="selectedFilter.type" lg="3" cols="12">
        <slot
          :name="selectedFilter.value"
          :filter="selectedFilter"
          :listeners="{ input: emitSelectedFilters }"
          :component="getFilterComponent(selectedFilter).component"
        >
          <div>
            <keep-alive>
              <component
                :is="selectedFilter.component || getFilterComponent(selectedFilter).component"
                ref="filterRefs"
                v-bind="{
                  outlined: true,
                  ...selectedFilter.attrs,
                  items: getItems(selectedFilter),
                }"
                :value="selectedFilter.input"
                :loading="filtersLoadingStateMap[selectedFilter.value]"
                v-on="{
                  input: ($event) => handleSelectedFilterInput($event, selectedFilter),
                  ...selectedFilter.listeners,
                }"
              >
              </component>
            </keep-alive>
          </div>
        </slot>
      </v-col>
    </v-row>
  </div>
</template>
