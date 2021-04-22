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
  <div class="login-wrapper">
    <div class="login-card">
      <base-material-card class="px-5 py-3" max-width="100%">
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
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* stylelint-disable selector-class-pattern */
.login-wrapper {
  display: flex;
  flex: 1 1 auto;
  flex-wrap: wrap;
  justify-content: center !important;
  margin-right: 0;
  margin-left: 0;
}
.login-card {
  width: 400px;
  max-width: 100%;
}
@media only screen and (max-width: 600px) {
  .login-card {
    width: 90%;
  }
}
@media only screen and (max-width: 400px) {
  .login-card {
    width: 100%;
  }
}
</style>
