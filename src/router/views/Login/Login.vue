<script>
import { authComputed, authMethods } from '@state/helpers'

import appConfig from '@/app.config'

import { requireRule, emailRule } from '@validations'

export default {
  page: {
    title: ({ i18n, store }) => {
      return i18n.t('login')
    },
    meta: [{ name: 'description', content: `Login to ${appConfig.title}` }],
  },
  components: {},
  data() {
    return {
      isUserValid: false,
      email: '',
      password: '',
      loginLoading: false,
      emailRules: [
        (v) => requireRule(v, this.$t('item_required_message', { item: this.$t('email') })),
        (v) => emailRule(v, this.$t('item_valid_message', { item: this.$t('email') })),
      ],
      passwordRules: [
        (v) => requireRule(v, this.$t('item_required_message', { item: this.$t('password') })),
      ],
    }
  },
  computed: {
    ...authComputed,
    disableSubmit() {
      return !this.isUserValid
    },
  },
  methods: {
    ...authMethods,
    onEmailChange(value) {
      this.email = value
    },
    onPasswordChange(value) {
      this.password = value
    },
    async handleLogin() {
      const user = await this.login({
        user: {
          email: this.email,
          password: this.password,
          type: 'employee',
        },
        config: {
          successMessage: this.$t('login_successful'),
          onStart: () => (this.loginLoading = true),
          onFinish: () => (this.loginLoading = false),
        },
      })

      // if user obtained Redirect to the originally requested page,
      // or to dashboard page as a fallback
      if (user) this.$router.replace({ name: this.$route.query.redirectFrom || 'dashboard' })
    },
  },
}
</script>

<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="4">
      <base-material-card class="px-5 py-3" max-width="100%" width="400">
        <template v-slot:heading>
          <div class="text-center">
            <div class="text-h3 font-weight-bold mb-2">
              {{ $t('login') }}
            </div>
            <v-avatar size="36">
              <v-img src="@assets/images/logo.png" />
            </v-avatar>
          </div>
        </template>
        <v-card-text>
          <v-form id="loginForm" v-model="isUserValid" @submit.prevent="handleLogin">
            <v-text-field
              id="email"
              outlined
              class="mt-10"
              :rules="emailRules"
              :label="$t('email')"
              name="email"
              prepend-icon="mdi-email"
              type="text"
              autocomplete="username"
              @input="onEmailChange"
            />

            <v-text-field
              id="password"
              outlined
              class="mb-8"
              :rules="passwordRules"
              :label="$t('password')"
              name="password"
              prepend-icon="mdi-lock-outline"
              type="password"
              autocomplete="current-password"
              @input="onPasswordChange"
            />

            <div class="text-center">
              <v-btn
                :disabled="disableSubmit"
                :loading="loginLoading"
                color="primary"
                type="submit"
                form="loginForm"
                text
                depressed
                rounded
                large
              >
                {{ $t('login') }}
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </base-material-card>
    </v-col>
  </v-row>
</template>
