---
to: src/components/<%= h.changeCase.pascal(h.inflection.pluralize(name)) %>/<%= h.changeCase.pascal(h.inflection.singularize(name)) %>InputForm/<%= h.changeCase.pascal(h.inflection.singularize(name)) %>InputForm.vue
eof_last: false
---
<%
 name = h.changeCase.camel(h.inflection.singularize(name))
%>
<script>
import editable from '@mixins/editable/editable'

<% if (hasTranslation) { %>import translatable from '@mixins/translatable/translatable' <% } %>

export default {
  layout: 'dynamic-dialog',
  components: {},
  mixins: [editable<% if (hasTranslation) { %>, translatable<% } %>],
  data() {
    return {
      <%= name %>FormValid: true,
    }
  },
  methods: {
    isFormValid() {
      // Handle any extra validation here
      return this.$refs.<%= name %>Form.validate()
    },
    async handleSave() {
      if (typeof this.createOrUpdateAction !== 'function')
        return Promise.reject(new Error('Please provide a create or update action'))

      if (!this.isFormValid()) return

      const <%= name %> = await this.createOrUpdateAction(this.editedItem)
      if (<%= name %>) {
        return this.saveAndClose(<%= name %>)
      }
    },
    handleCancel() {
      this.close()
    },
  },
}
</script>

<template>
  <div class="<%= name %>-input-form">
    <v-card flat>
      <v-card-text>
        <v-form ref="<%= name %>Form" v-model="<%= name %>FormValid">
          <v-container>
            <v-row> </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn color="secondary" text @click="handleCancel">{{ $t('cancel') }}</v-btn>
        <v-btn :disabled="!<%= name %>FormValid" color="primary" text @click="handleSave">{{ $t('save') }}</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
