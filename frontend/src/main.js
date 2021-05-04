import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import store from '@/store'
import vuetify from '@/plugins/vuetify'
import VueSidebarMenu from '@/components/sidebar-menu'

import axios from 'axios'
import i18n from './i18n'
import JsonExcel from 'vue-json-excel'
import Utils from '@/plugins/utils'

/* axios 공통 헤더 설정 */
axios.defaults.headers.get['Content-Type'] = 'application/json; charset=utf-8'
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8'

require('vue-sidebar-menu/dist/vue-sidebar-menu.css')
require('@/assets/css/layout.css')
require('@mdi/font/css/materialdesignicons.css')
require('roboto-fontface/css/roboto/roboto-fontface.css')

Vue.component('downloadExcel', JsonExcel)

Vue.prototype.$axios = axios
Vue.config.productionTip = false

Vue.use(VueSidebarMenu)
Vue.use(Utils)

Vue.filter('currency', function (value) {
  if (!value) return 0
  return Number(value).toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,')
})

export default new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')
