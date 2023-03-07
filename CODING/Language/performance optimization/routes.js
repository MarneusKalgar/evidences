export default [
  {
    path: '/puff-points-about',
    name: 'Puff Points',
    component: () => {
      return import(/* webpackChunkName: "PuffPointsAbout" */ '@/views/puff-points/about.vue')
    },
  },
  {
    path: 'order-help',
    name: 'Help',
    component: () =>
      import(/* webpackChunkName: "OrderHelp" */ '@/legacy-widgets/pages/page-order-help.vue'),
  },
  {
    path: 'order-status-3',
    name: 'Order Status 3',
    component: () =>
      import(
        /* webpackChunkName: "PageOrderStatus" */ '@/legacy-widgets/pages/page-order-status.vue'
      ),
  },
  {
    path: '/id-manual-entry',
    name: 'ID document',
    component: () => import(/* webpackChunkName: "IDDoc" */ '@/views/id-doc'),
  },
  {
    path: 'settings',
    name: 'Settings',
    component: () => {
      return import(/* webpackChunkName: "Settings" */ '@/legacy-widgets/pages/page-settings.vue')
    },
  },
  {
    path: 'user',
    name: 'User',
    component: () => {
      return import(/* webpackChunkName: "PageUser" */ '@/legacy-widgets/pages/page-user.vue')
    },
  },
  {
    path: 'sharing',
    name: 'Sharing',
    component: () => {
      return import(/* webpackChunkName: "Sharing" */ '@/legacy-widgets/pages/page-sharing.vue')
    },
  },
  {
    path: 'address',
    name: 'Address',
    component: () => {
      return import(/* webpackChunkName: "Address" */ '@/legacy-widgets/pages/page-address.vue')
    },
  },
  {
    path: 'activate-coupon',
    name: 'Activate Coupon',
    component: () => {
      return import(
        /* webpackChunkName: "ActivateCoupon" */ '@/legacy-widgets/pages/page-activate-coupon.vue'
      )
    },
  },
  {
    path: 'delivery-details',
    name: 'Edit Delivery Details',
    component: () => {
      return import(
        /* webpackChunkName: "EditDeliveryDetails" */ '@/legacy-widgets/pages/page-edit-delivery-details.vue'
      )
    },
  },
  {
    path: 'rewards',
    name: 'Rewards',
    component: () =>
      import(/* webpackChunkName: "Rewards" */ '@/legacy-widgets/pages/page-rewards.vue'),
  },
  {
    path: 'history',
    name: 'History',
    component: () =>
      import(/* webpackChunkName: "History" */ '@/legacy-widgets/pages/page-history.vue'),
  },
]
