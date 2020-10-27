<script>
import { formatDate, isFromSameOrBeforeTo } from '@utils/dateTimeUtils'

import i18n from '@plugins/i18n'

import themes from '@plugins/vuetify/themes'

export default {
  name: 'TimeRange',
  inheritAttrs: false,
  props: {
    range: {
      type: Array,
      required: true,
      validator(value) {
        return value.length === 2
      },
    },
    format: {
      type: String,
      required: false,
      default: 'ampm',
      validator(value) {
        return ['ampm', '24h'].includes(value)
      },
    },
    minuteInterval: {
      type: Number,
      required: false,
      default: 1,
    },
    fromTimeLabel: {
      type: String,
      required: false,
      default: () => i18n.t('from'),
    },
    fromTimeRules: {
      type: Array,
      required: false,
      default: () => [],
    },
    toTimeLabel: {
      type: String,
      required: false,
      default: () => i18n.t('to'),
    },
    toTimeRules: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      supportedFormats: { ampm: 'hh:mm A', '24h': 'HH:mm' },
      from: '',
      to: '',
      isFromSameOrBeforeToRule: (v) =>
        isFromSameOrBeforeTo(this.from, this.to, this.supportedFormats['24h']) ||
        'Start Time must be same or before End Time',
    }
  },
  computed: {
    attrs() {
      return {
        locale: this.currentLocale,
        format: this.timeFormat,
        color: themes.light.primary,
        'no-value-to-custom-elem': true,
        'minute-interval': this.minuteInterval,
        'only-time': true,
        'button-color': themes.light.success,
        'no-button': true,
        ...this.$attrs,
      }
    },
    currentLocale() {
      return this.$store.state.locales.currentLocale
    },
    timeFormat() {
      return this.supportedFormats[this.format]
    },
  },
  watch: {
    range: {
      handler() {
        if (this.range[0]) this.from = formatDate(this.range[0], this.timeFormat)
        if (this.range[1]) this.to = formatDate(this.range[1], this.timeFormat)
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    formatRangeTo24h(from, to) {
      let formatted24hFrom
      if (from) {
        formatted24hFrom = formatDate(from, this.timeFormat, this.supportedFormats['24h'])
      }

      let formatted24hTo
      if (to) {
        formatted24hTo = formatDate(to, this.timeFormat, this.supportedFormats['24h'])
      }
      return [formatted24hFrom, formatted24hTo]
    },
    handleRangeInput() {
      const formatted24hRange = this.formatRangeTo24h(this.from, this.to)
      this.$emit('update:range', formatted24hRange)
    },
  },
}
</script>

<template>
  <v-row no-gutters>
    <v-col>
      <VueCtkDateTimePicker
        id="from-input-field"
        v-model="from"
        v-bind="attrs"
        @input="handleRangeInput"
      >
        <v-text-field
          v-model="from"
          outlined
          prepend-icon="mdi-clock-outline"
          :label="fromTimeLabel"
          :rules="[...fromTimeRules]"
          readonly
        ></v-text-field>
      </VueCtkDateTimePicker>
    </v-col>
    <v-col>
      <VueCtkDateTimePicker
        id="to-input-field"
        v-model="to"
        v-bind="attrs"
        @input="handleRangeInput"
      >
        <v-text-field
          v-model="to"
          outlined
          prepend-icon="mdi-clock-outline"
          :label="toTimeLabel"
          :rules="[...toTimeRules, isFromSameOrBeforeToRule]"
          readonly
        ></v-text-field>
      </VueCtkDateTimePicker>
    </v-col>
  </v-row>
</template>
