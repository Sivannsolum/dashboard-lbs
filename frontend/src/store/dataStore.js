import commons from '@/plugins/commons'
import codes from '@/plugins/codes'
import utils from '@/plugins/utils'

const cloudMode = (process.env.VUE_APP_PRODUCTION_TYPE === codes.productionTypes.CLOUD)

const defaultState = {
  selectedStore: {},
  searchStoreItem: [],
  managedStores: [],
  currentLanguage: '',
  accessMenu: [
    { code: '1000', name: 'Overview' },
    { code: '2000', name: 'Label Info' },
    { code: '2100', name: 'Label Info' },
    { code: '2200', name: 'Fail Records' },
    { code: '2300', name: 'Label Firmware' },
    { code: '3000', name: 'Product Info' },
    { code: '3100', name: 'Product Info' },
    { code: '3200', name: 'Update Records' },
    { code: '4000', name: 'Gateway Info' },
    { code: '4100', name: 'Gateway Info' },
    { code: '4200', name: 'Gateway Firmware' },
    { code: '5000', name: 'Template Info' },
    { code: '5100', name: 'Template Info' },
    { code: '5200', name: 'Template Grouping' },
    { code: '5300', name: 'Template Mapping' },
    { code: '6000', name: 'Multifunction Info' },
    { code: '6100', name: 'LBS Info' },
    { code: '6200', name: 'LED Info' },
    { code: '6300', name: 'Button Info' },
    { code: '7000', name: 'Store Info' },
    { code: '7100', name: 'Store Info' },
    { code: '8000', name: 'User Info' },
    { code: '8100', name: 'User Info' },
    { code: '8200', name: 'User Mapping' },
    { code: '8300', name: 'User Level' },
    // { code: '8400', name: 'My Info' },
    { code: '9000', name: 'System Config' },
    { code: '9100', name: 'Dashboard Config' },
    { code: '9200', name: 'Report Config' },
    { code: '9300', name: 'App Config' },
    { code: '9400', name: 'System License' }
  ],
  accessAction: [
    { code: '2000', name: 'Label Info' },
    { code: '2100', name: 'Label Info : Label Unassign' },
    { code: '2101', name: 'Label Info : LED Blinking' },
    { code: '2102', name: 'Label Info : Export' },
    { code: '2103', name: 'Label Info  : Detail Popup' },
    { code: '2200', name: 'Fail Records : Export' },
    { code: '2300', name: 'Firmware : Firmware List' },
    { code: '2301', name: 'Firmware : Firmware Update' },
    { code: '2302', name: 'Firmware : Export' },
    { code: '3000', name: 'Product Info' },
    { code: '3100', name: 'Product Info : Detail Popup' },
    { code: '3101', name: 'Product Info : File Upload' },
    { code: '3102', name: 'Product Info : Add / Delete' },
    { code: '3103', name: 'Product Info : LED Blinking' },
    { code: '3104', name: 'Product Info : Export' },
    { code: '3200', name: 'Update Records : Export' },
    { code: '4000', name: 'Gateway Info' },
    { code: '4100', name: 'Gateway Info : Get Detailed' },
    { code: '4101', name: 'Gateway Info : Add / Delete' },
    { code: '4102', name: 'Gateway Info : Reboot' },
    { code: '4103', name: 'Gateway Info : Export' },
    { code: '4200', name: 'Gateway Firmware : Update' },
    { code: '4201', name: 'Gateway Firmware : Export' },
    { code: '5000', name: 'Template Info' },
    { code: '5100', name: 'Template Info : Add / Delete' },
    { code: '5101', name: 'Template Info : Export' },
    { code: '5200', name: 'Template Grouping : New Group / Edit / Delete' },
    {
      code: '5300',
      name: 'Template Mapping : Add/ Edit / Delete / Save / Apply'
    },
    { code: '6000', name: 'Multifunction Info' },
    { code: '6100', name: 'LBS Info : New Anchor / Delete / Setting' },
    { code: '6200', name: 'LED Info : New Pattern / Delete' },
    { code: '7000', name: 'Store Info' },
    { code: '7100', name: 'Store Info : Detail Popup' },
    { code: '7101', name: 'Store Info : Add / Delete / Setting' },
    { code: '7102', name: 'Store Info : Export' },
    { code: '7103', name: 'Country/Region/City : Add' },
    { code: '8000', name: 'User Info' },
    // { code: '8100', name: 'User Info : New / Delete' },
    { code: '8101', name: 'User Info : Detail Popup' },
    { code: '8102', name: 'User Info : Export' },
    { code: '8200', name: 'User Mapping : Add / Delete' },
    { code: '8300', name: 'User Level : Save / Reset' },
    // { code: '8400', name: 'My Info : Save' },
    // { code: '8401', name: 'Password Edit' },
    { code: '9000', name: 'System Config' },
    { code: '9100', name: 'Alert Setting' },
    { code: '9101', name: 'Country/Region/City : Get / Add / Delete' },
    { code: '9102', name: 'Alive Interval : Save' },
    { code: '9200', name: 'Report Setting : Save' },
    { code: '9201', name: 'Mail Setting : Save' },
    // { code: '9300', name: 'Assign Barcode Save' },
    { code: '9400', name: 'Activation' }
  ],
  staySignedIn: false
}

if (!cloudMode) {
  defaultState.accessMenu = [
    ...defaultState.accessMenu,
    { code: '7200', name: 'White List' }
  ]
  defaultState.accessAction = [
    ...defaultState.accessAction,
    { code: '8100', name: 'User Info : New / Delete' },
    { code: '7200', name: 'Whitelist : Save / Add / Delete' },
    { code: '7201', name: 'Whitelist : Export' }
  ]
}

const state = commons.copy(defaultState)

export const dataStore = {
  getters: {
    GET_CURRENT_LANGUAGE: state => state.currentLanguage,
    GET_SELECTED_STORE: state => state.selectedStore,
    IS_SELECTED_STORE: state => {
      return (
        state.selectedStore !== undefined ||
        state.selectedStore.name !== undefined
      )
    },
    GET_STORE_ITEMS: state => state.managedStores,
    GET_MENU: state => state.accessMenu,
    GET_ACTION: state => state.accessAction
  },
  mutations: {
    UPDATE_CURRENT_LANGUAGE: (state, code) => {
      state.currentLanguage = code
    },
    UPDATE_SELECTED_STORE: (state, store) => {
      state.selectedStore = Object.assign({}, store)
    },
    UPDATE_MANAGED_STORE: (state, data) => {
      state.managedStores = [...data.managedStores]
    },
    addManagedStore: (state, store) => {
      state.managedStores = [...state.managedStores, store]
    },
    INIT_SELECTED_STORE: (state, user) => {
      state.managedStores = user.managedStores
    },
    CLEAN: (state, payload) => {
      defaultState.currentLanguage = state.currentLanguage
      state = Object.assign(state, commons.copy(defaultState))
    },
    updateStaySignedIn: (state, staySignedIn) => {
      state.staySignedIn = staySignedIn
    }
  },
  actions: {
    UPDATE_CURRENT_LANGUAGE: ({ commit }, payload) => {
      commit('UPDATE_CURRENT_LANGUAGE', payload)
    },
    UPDATE_SELECTED_STORE: async ({ commit }, store) => {
      if (!cloudMode) store.company = await utils.getCompany()
      commit('UPDATE_SELECTED_STORE', store)
    },
    UPDATE_MANAGED_STORE: ({ commit }, payload) => {
      commit('UPDATE_MANAGED_STORE', payload)
    },
    INIT_SELECTED_STORE: ({ commit }, payload) => {
      const managedStores = payload.state.auth.user
      if (commons.isNull(managedStores)) return
      commit('INIT_SELECTED_STORE', managedStores)
      commit('UPDATE_SELECTED_STORE', {
        company: payload.state.auth.user.company,
        country: '',
        city: '',
        code: '',
        name: '',
        region: ''
      })
    },
    CLEAN: ({ commit }, payload) => {
      commit('CLEAN', payload)
    },
    updateStaySignedIn: (context, payload) => {
      context.commit('updateStaySignedIn', payload)
    },
    addManagedStore: (context, payload) => {
      context.commit('addManagedStore', payload)
    }
  },
  namespaced: true,
  state: state
}
