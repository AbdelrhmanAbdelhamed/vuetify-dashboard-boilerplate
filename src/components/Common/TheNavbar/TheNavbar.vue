<script>
export default {
  name: 'TheNavbar',
  components: {
    TheNavbarItem: () => import('../TheNavbarItem/TheNavbarItem.vue'),
    TheNavbarItemGroup: () => import('../TheNavbarItemGroup/TheNavbarItemGroup.vue'),
  },
  inheritAttrs: false,
  props: {
    value: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      barImage: 'https://demos.creative-tim.com/material-dashboard/assets/img/sidebar-3.jpg',
      barColor: 'rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)',
      items: [
        {
          title: 'dashboard',
          icon: 'mdi-view-dashboard',
          hide: false,
        },
        {
          title: 'users',
          icon: 'mdi-account-multiple',
          hide: !this.$can('read', 'User'),
        },
      ],
    }
  },
  computed: {
    navBarRight() {
      return this.$vuetify.rtl
    },
    computedItems() {
      return this.items.filter((item) => !item.hide).map(this.mapItem)
    },
    profile() {
      return {
        image: this.$store.state.auth.currentUser.image,
        title: this.$store.state.auth.currentUser.firstName,
      }
    },
    attrs() {
      return {
        width: '260',
        'mobile-breakpoint': '960',
        'expand-on-hover': false,
        'mini-variant': false,
        'mini-variant-width': '80',
        ...this.$attrs,
      }
    },
    listeners() {
      return {
        ...this.$listeners,
        input: (value) => {
          this.$emit('input', value)
        },
      }
    },
  },
  methods: {
    mapItem(item) {
      return {
        ...item,
        children: item.children
          ? item.children.filter((item) => !item.hide).map(this.mapItem)
          : undefined,
        title: this.$t(item.title),
        to: item.to ?? item.title,
      }
    },
  },
}
</script>

<template>
  <div>
    <v-navigation-drawer
      id="core-navigation-drawer"
      :value="value"
      app
      :dark="barColor !== 'rgba(228, 226, 226, 1), rgba(255, 255, 255, 0.7)'"
      :right="navBarRight"
      :src="barImage"
      v-bind="attrs"
      v-on="listeners"
    >
      <template v-slot:img="props">
        <v-img :gradient="`to bottom, ${barColor}`" v-bind="props" />
      </template>

      <v-list two-line>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <div class="text-uppercase font-weight-regular text-h3">
                <span>
                  <v-avatar size="44">
                    <v-img src="@assets/images/logo.png" />
                  </v-avatar>
                </span>
                <span>
                  {{ $t('dashboard') }}
                </span>
              </div>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider class="mb-1" />

      <v-list expand nav>
        <v-list-item class="justify-start">
          <v-list-item-avatar class="align-self-center" contain>
            <v-img v-if="profile.image" :src="profile.image" alt="Employee Image" />
            <v-icon v-else color="primary" x-large>
              mdi-account-circle
            </v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="text-h4" v-text="profile.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider class="mb-2" />

      <v-list expand nav>
        <template v-for="(item, index) in computedItems">
          <TheNavbarItemGroup
            v-if="item.children && item.children.length > 0"
            :key="`group-${index}`"
            :item="item"
          />
          <TheNavbarItem v-else-if="!item.children" :key="`item-${index}`" :item="item" />
        </template>
      </v-list>

      <template v-slot:append>
        <TheNavbarItem
          :item="
            mapItem({
              title: 'logout',
              replace: true,
              icon: 'mdi-logout',
              hide: false,
            })
          "
        />
      </template>
    </v-navigation-drawer>
  </div>
</template>

<style lang="sass">
// stylelint-disable selector-id-pattern, selector-class-pattern

#core-navigation-drawer
  .v-list-group__header.v-list-item--active::before
    opacity: .24

  .v-list-item
    &__icon--text,
    &__icon:first-child
      justify-content: center
      width: 20px
      text-align: center



  .v-list--dense
    .v-list-item
      &__icon--text,
      &__icon:first-child
        margin-top: 10px

  .v-list-group--sub-group


    .v-list-group__header


      .v-list-item__icon--text
        order: 0
        margin-top: 19px

      .v-list-group__header__prepend-icon
        order: 2
</style>
