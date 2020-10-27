<script>
import { requireRule, betweenLengthRule } from '@validations'

export default {
  name: 'PasswordField',
  inheritAttrs: false,
  props: {
    hideGenerateButton: {
      type: Boolean,
      required: false,
      default: false,
    },
    generateButtonText: {
      type: String,
      required: false,
      default: function() {
        return this.$t('generate')
      },
    },
    generateButtonAttrs: {
      type: Object,
      required: false,
      default: () => ({
        depressed: true,
        small: true,
        color: 'primary',
      }),
    },
    rules: {
      type: Array,
      required: false,
      default: function() {
        return [
          (v) => requireRule(v, this.$t('item_required_message', { item: this.$t('password') })),
          (v) =>
            betweenLengthRule(
              v,
              6,
              128,
              this.$t('item_between_length_message', {
                item: this.$t('password'),
                min: 6,
                max: 128,
              })
            ),
        ]
      },
    },
  },
  data() {
    return {
      password: '',
      revealPassword: false,
      passwordLength: 16,
    }
  },
  computed: {
    attrs() {
      return {
        name: 'password',
        outlined: true,
        label: this.$t('password'),
        min: '6',
        autocomplete: 'new-password',
        'append-icon': this.revealPassword ? 'mdi-eye' : 'mdi-eye-off',
        type: this.revealPassword ? 'text' : 'password',
        counter: true,
        disabled: false,
        'hide-details': 'auto',
        ...this.$attrs,
      }
    },
    listeners() {
      return {
        ...this.$listeners,
        input: (value) => {
          this.password = value
          this.$emit('input', this.password)
        },
      }
    },
  },
  watch: {
    rules: {
      handler(newVal, oldVal) {
        this.$refs.passwordField.validate()
      },
    },
  },
  methods: {
    generateRandomPassword(length, isAmbiguousCharacters = true) {
      const chars = isAmbiguousCharacters
        ? 'abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
        : 'abcdefghijklmnopqrstuvwxyz1234567890'
      let password = ''
      for (let x = 0; x < length; x++) {
        const i = Math.floor(Math.random() * chars.length)
        password += chars.charAt(i)
      }
      return password
    },
    async handleGenerate() {
      const generatedPassword = this.generateRandomPassword(this.passwordLength)

      if (generatedPassword) {
        const confirm = await this.$dialog.confirm({
          title: this.$t('confirm_generated_password'),
          text: `${generatedPassword}`,
        })

        if (confirm) {
          this.password = generatedPassword
          this.$emit('input', this.password)
        }
      }
    },
  },
}
</script>

<template>
  <v-row>
    <v-col cols="9">
      <v-text-field
        ref="passwordField"
        :value="password"
        :rules="rules"
        v-bind="attrs"
        v-on="listeners"
        @click:append="revealPassword = !revealPassword"
      ></v-text-field>
    </v-col>
    <v-col v-if="!hideGenerateButton" class="mt-5" cols="3">
      <v-btn v-bind="generateButtonAttrs" @click="handleGenerate">
        {{ generateButtonText }}
      </v-btn>
    </v-col>
  </v-row>
</template>
