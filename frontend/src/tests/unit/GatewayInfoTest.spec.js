// ### GatewayInfo Component 테스트 코드 ###
// npm t로 테스트 실행
// [Vuetify] Multiple instances of Vue detected 에러가 발생할것이지만
// Vuetify의 문제로 테스트에는 문제없음, 관련 자료는 아래 이슈 참고
// https://github.com/vuetifyjs/vuetify/issues/4964
import { shallowMount, createLocalVue, mount } from '@vue/test-utils'

import Vuex from 'vuex'
import rootStore from '../../store/index'
import auth from '../../store/index'

import VueRouter from 'vue-router'
import router from '../../router/index'
import Vuetify from 'vuetify';

import GatewayInfo from '../../views/Gateway/GatewayInfo'

import utils from '@/plugins/utils.js'

// Dummy data for tests
const company = 'AA'
const storeCode = 'Store1'
const networkStatusColor = new Map([
  ['CONNECTED', 'bg-stable'],
  ['NOT_READY', 'bg-caution'],
  ['DISCONNECTED', 'bg-danger']
])

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)
localVue.use(Vuetify);

describe('Gateway Info test', () => {
  let propsData
  let actions
  let getters
  let state
  let store
  let wrapper

  beforeEach(() => {
    propsData = {}
    state = {
      auth: {
        user: {}
      }
    }
    actions = {
      'auth/getDisabledBtn': jest.fn(() => {
        return new Promise((resolve)=> {
          resolve(true)
        })
      }),
      'dataStore/IS_SELECTED_STORE': jest.fn(() => {
        return true
      })
    }
    store = new Vuex.Store({
      actions,
      state,
      getters
    })
    wrapper = shallowMount(GatewayInfo, {
      propsData,
      data: function () {
        return {
          store: {
            code: false
          }
        }
      },
      methods: {
        $t(val) {
          return val
        },
        buildGetGatewaysParams: jest.fn(() => {
          let params = { 
            store: storeCode,
            company: company,
          }
          return params
        })
      },
      store, 
      localVue,
      router
    })
    wrapper.vm.$utils = utils
  })

  test('Get network status class test', () => {
    for (const key of networkStatusColor.keys()) {
      expect(wrapper.vm.networkStatusStyle(key)).toBe(networkStatusColor.get(key))
    }
  })

  afterEach(() => {
    wrapper.destroy()
  })
})
