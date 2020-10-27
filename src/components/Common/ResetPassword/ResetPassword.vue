<script>
import { authService } from '@services'

export default {
  name: 'ResetPassword',
  inheritAttrs: false,
  props: {
    userData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    attrs() {
      return {
        'x-small': true,
        color: 'secondary',
        ...this.$attrs,
      }
    },
    listeners() {
      return {
        ...this.$listeners,
      }
    },
  },
  methods: {
    async handleResetPassword() {
      const confirm = await this.$dialog.confirm({
        title: this.$t('confirm_reset_password_title'),
        text: `${this.$t('confirm_reset_password_text')} ${this.userData.email ||
          this.userData.mobile}`,
      })
      if (confirm) await authService.resetPassword({ user: this.userData })
    },
  },
}
</script>

<template>
  <v-btn v-bind="attrs" v-on="listeners" @click="handleResetPassword">{{
    $t('reset_item', { item: $t('password') })
  }}</v-btn>
</template>
