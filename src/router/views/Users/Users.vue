<script>
import appConfig from '@/app.config'

import UserList from '@components/Users/UserList/UserList.vue'

export default {
  name: 'Users',
  page: {
    title: ({ i18n, store }) => {
      return i18n.t('users')
    },
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { UserList },
  data() {
    return {}
  },
}
</script>

<template>
  <UserList />
</template>
