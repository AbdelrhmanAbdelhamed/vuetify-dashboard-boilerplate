<script>
import editable from '@mixins/editable/editable'

import PasswordField from '@components/Common/PasswordField/PasswordField.vue'

import { requireRule, betweenLengthRule, emailRule, mobileRule } from '@validations'

export default {
  layout: 'dynamic-dialog',
  components: { PasswordField },
  mixins: [editable],
  data() {
    return {
      tab: 0,
      userFormValid: true,
      nameRules: [
        (v) => requireRule(v, this.$t('item_required_message', { item: this.$t('name') })),
        (v) =>
          betweenLengthRule(
            v,
            2,
            128,
            this.$t('item_between_length_message', { item: this.$t('name'), min: 2, max: 128 })
          ),
      ],
      emailRules: [(v) => emailRule(v, this.$t('item_valid_message', { item: this.$t('email') }))],
      mobileRules: [
        (v) => mobileRule(v, this.$t('item_valid_message', { item: this.$t('mobile') })),
      ],
      passwordRules: [
        (v) =>
          betweenLengthRule(
            v,
            6,
            128,
            this.$t('item_between_length_message', { item: this.$t('password'), min: 6, max: 128 })
          ),
      ],
    }
  },
  computed: {
    emailOrMobileRequireRule() {
      return (
        !!this.editedItem.email ||
        !!this.editedItem.mobile ||
        this.$t('email_or_mobile_are_required')
      )
    },
    requirePasswordRule() {
      return (v) =>
        requireRule(
          v,
          this.$t('item_required_message', { item: this.$t('password') }),
          !this.editedItem.isFake
        )
    },
  },
  methods: {
    async handleSave() {
      if (typeof this.createOrUpdateAction !== 'function')
        return Promise.reject(new Error('Please provide a create or update action'))

      if (!this.$refs.userForm.validate()) return

      const user = await this.createOrUpdateAction(this.editedItem)
      if (user) {
        return this.saveAndClose(user)
      }
    },
    handleCancel() {
      this.close()
    },
  },
}
</script>

<template>
  <div>
    <v-toolbar color="secondary" dark flat>
      <v-tabs v-model="tab" centered grow>
        <v-tab>{{ $t('user_information') }}</v-tab>
      </v-tabs>
    </v-toolbar>

    <v-card-text>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-form ref="userForm" v-model="userFormValid">
            <v-container>
              <v-row>
                <v-col>
                  <v-row>
                    <v-col xl="6" lg="6" md="6" sm="12" cols="12">
                      <v-text-field
                        v-model="editedItem.firstName"
                        outlined
                        :label="$t('first_name')"
                        :rules="nameRules"
                      ></v-text-field>
                    </v-col>
                    <v-col xl="6" lg="6" md="6" sm="12" cols="12">
                      <v-text-field
                        v-model="editedItem.lastName"
                        outlined
                        :label="$t('last_name')"
                        :rules="nameRules"
                      ></v-text-field>
                    </v-col>
                    <v-col xl="6" lg="6" md="6" sm="12" cols="12">
                      <v-text-field
                        v-model="editedItem.email"
                        outlined
                        :label="$t('email')"
                        type="email"
                        :rules="[emailOrMobileRequireRule, ...emailRules]"
                        :readonly="!isItemNew"
                      ></v-text-field>
                    </v-col>
                    <v-col xl="9" lg="9" md="8" sm="8" cols="9">
                      <PasswordField
                        v-if="isItemNew"
                        v-model="editedItem.password"
                        :rules="[requirePasswordRule, ...passwordRules]"
                      />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="secondary" text @click="handleCancel">{{ $t('cancel') }}</v-btn>
      <v-btn :disabled="!userFormValid" color="primary" text @click="handleSave">{{
        $t('save')
      }}</v-btn>
    </v-card-actions>
  </div>
</template>
