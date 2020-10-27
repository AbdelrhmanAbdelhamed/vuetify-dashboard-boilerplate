<script>
import LoadingView from '@views/_Loading/_Loading.vue'
import httpClient from '@clients/http'

export default {
  page: {
    title: 'Page timeout',
    meta: [{ name: 'description', content: 'The page timed out while loading.' }],
  },
  components: { LoadingView },
  data() {
    return {
      offlineConfirmed: false,
    }
  },
  async beforeCreate() {
    try {
      await httpClient.head('live', { onError: false })
      location.reload()
    } catch {
      this.offlineConfirmed = true
    }
  },
}
</script>

<template>
  <div v-if="offlineConfirmed">
    <h1 class="text-center">
      The page timed out while loading. Are you sure you're still connected to the Internet?
    </h1>
  </div>
  <LoadingView v-else />
</template>
