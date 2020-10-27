<script>
export default {
  name: 'TheNavbarItemSubGroup',
  components: {
    TheNavbarItemGroup: () => import('../TheNavbarItemGroup/TheNavbarItemGroup.vue'),
  },
  props: {
    item: {
      type: Object,
      default: () => ({
        title: undefined,
        icon: undefined,
        hide: false,
        children: [],
      }),
    },
  },
}
</script>

<template>
  <TheNavbarItemGroup :item="item" sub-group />
</template>
