---
to: src/router/views/<%= h.changeCase.pascal(h.inflection.pluralize(name)) %>/<%= h.changeCase.pascal(h.inflection.pluralize(name)) %>.vue
eof_last: false
---
<%
 names_ = h.changeCase.snake(h.inflection.pluralize(name))
 Name = h.changeCase.pascal(h.inflection.singularize(name))
 Names = h.changeCase.pascal(h.inflection.pluralize(name))
%>
<script>
import appConfig from '@/app.config'

import <%= Name %>List from '@components/<%= Names %>/<%= Name %>List/<%= Name %>List.vue'

export default {
  name: '<%= Names %>',
  page: {
    title: ({ i18n, store }) => {
      return i18n.t('<%= names_ %>')
    },
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { <%= Name %>List },
  data() {
    return {}
  },
}
</script>

<template>
  <<%= Name %>List />
</template>
