import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { auth } from './auth.module'
import { dataStore } from './dataStore'
import { lbs } from '@/lbs/store/index'

import commons from '@/plugins/commons'
Vue.use(Vuex)

const defaultAccessablePages = [
  '1100', // Overview
  '8400' // My Account
]
const defaultPages = [
  { code: dataStore.state.accessMenu[2].code, name: 'Label Info Cloud' },
  { code: dataStore.state.accessMenu[9].code, name: 'Gateway Info Cloud' },
  { code: dataStore.state.accessMenu[23].code, name: 'User Info Cloud' },
  { code: dataStore.state.accessMenu[24].code, name: 'User Mapping Cloud' },
  { code: dataStore.state.accessMenu[27].code, name: 'Dashboard Config Cloud' },
  { code: '8400', name: 'My Account' },
  { code: '8400', name: 'My Account Cloud' }
]

export default new Vuex.Store({
  modules: {
    auth: auth,
    dataStore: dataStore,
    lbs: lbs
  },
  plugins: [
    createPersistedState({
      paths: ['auth', 'dataStore', 'lbs']
    })
  ],
  actions: {
    isAccessablePage (context, pageNameToGo) {
      if (pageNameToGo.endsWith('Cloud')) pageNameToGo = pageNameToGo.replace(' Cloud', '')
      const accessablePages = [...context.state.auth.user.accountInfo.accessMenu, ...defaultAccessablePages]
      let allPages = commons.copy(context.state.dataStore.accessMenu.filter(el => el !== undefined && el !== null))
      allPages = allPages.map(page => {
        page.code = page.code.replace('000', '100')
        return page
      })
      allPages = [...allPages, ...defaultPages]
      const pageToGo = allPages.find(pg => pg.name === pageNameToGo)
      if (!pageToGo) return false
      return accessablePages.includes(pageToGo.code)
    }
  }
})
