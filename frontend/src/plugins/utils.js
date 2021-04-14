// Axios 요청에 관련된 기능을 담은 모듈.
// import main from '@/main'
import store from '@/store'
import configs from '@/plugins/configs'
import EventBus from '@/plugins/eventBus'
import codes from '@/plugins/codes'
import {
  getCloudSessionValidation,
  getSessionValidation
} from '@/plugins/healthCheck'
import { cloudLogout } from '@/adLogin/authPopup'
import router from '../router'

const axios = require('axios')

// Interceptors
axios.interceptors.request.use(
  // 요청 인터셉터
  function (config) {
    // 요청 전에 로딩 오버레이 띄우기
    EventBus.$emit('loadingOn')
    return config
  },
  function (error) {
    // 에러 나면 로딩 끄기
    EventBus.$emit('loadingOff')
    return Promise.reject(error)
  }
)
axios.interceptors.response.use(
  // 응답 인터셉터
  function (response) {
    // 응답 받으면 로딩 끄기
    EventBus.$emit('loadingOff')
    return response
  },
  function (error) {
    // 응답 에러 시에도 로딩 끄기
    EventBus.$emit('loadingOff')
    return Promise.reject(error)
  }
)

const Utils = (() => {
  return {
    getCompanyList () {
      const config = { params: {} }
      return this.callAxios(
        codes.requests.getCompanyList.method,
        codes.requests.getCompanyList.url,
        config
      ).then(res => {
        if (res.status === 204) return null
        return res.data.companyList.map(row => {
          return row.code
        })
      })
    },
    updateSelectedStoreKey (key, value) {
      const selectedStore = store.state.dataStore.selectedStore
      selectedStore[key] = value
    },
    getCompany (company) {
      const config = { params: {} }
      if (company) config.params.company = company
      return this.callAxios(
        codes.requests.getAreas.method,
        codes.requests.getAreas.url,
        config
      ).then(res => {
        if (res.status === 204) return null
        console.log('getCompany :', res.data.areaParamList.pop().company)
        return res.data.areaParamList.pop().company
      })
    },
    getCompanies (company) {
      const config = { params: {} }
      if (company) config.params.company = company
      return this.callAxios(
        codes.requests.getAreas.method,
        codes.requests.getAreas.url,
        config
      ).then(res => {
        if (res.status === 204) return null
        console.log(
          'getCompanies :',
          res.data.areaParamList.map(area => area.company)
        )
        return res.data.areaParamList.map(area => area.company)
      })
    },
    getRealUrl (url) {
      return service.getRealUrl(url)
    },
    async callAxios (method, url, config = {}) {
      url = service.getRealUrl(url)
      store.commit('auth/refreshTime')
      config.headers = await service.getRequestHeader()
      return new Promise(function (resolve, reject) {
        if (method.toLowerCase() === 'get') {
          service
            .getWithAxios(url, config)
            .then(res => {
              if (process.env.VUE_APP_PRODUCTION_TYPE === 'cloud') {
                if (res.status === 401) {
                  const uniqueId = this.$store.state.auth.tokenAPI.uniqueId
                  this.$store.dispatch('auth/logout').then(r => {
                    this.$store.dispatch('dataStore/CLEAN')
                    cloudLogout(uniqueId)
                  })
                  const error = res.data && res.data.message
                  return reject(error)
                }
              }
              return resolve(res)
            })
            .catch(error => {
              if (!url.endsWith('common/logout')) service.checkSessionOut(error)
              reject(error)
            })
        } else if (method.toLowerCase() === 'delete') {
          service
            .deleteWithAxios(url, config)
            .then(res => {
              if (process.env.VUE_APP_PRODUCTION_TYPE === 'cloud') {
                if (res.status === 401) {
                  const uniqueId = this.$store.state.auth.tokenAPI.uniqueId
                  this.$store.dispatch('auth/logout').then(r => {
                    this.$store.dispatch('dataStore/CLEAN')
                    cloudLogout(uniqueId)
                  })
                  const error = res.data && res.data.message
                  return reject(error)
                }
              }
              return resolve(res)
            })
            .catch(error => {
              service.checkSessionOut(error)
              reject(error)
            })
        }
      })
    },
    async callAxiosWithBody (method, url, data, config = {}) {
      url = service.getRealUrl(url)
      store.commit('auth/refreshTime')
      config.headers = await service.getRequestHeader()
      return new Promise(function (resolve, reject) {
        if (method.toLowerCase() === 'post') {
          service
            .postWithAxios(url, data, config)
            .then(res => {
              if (process.env.VUE_APP_PRODUCTION_TYPE === 'cloud') {
                if (res.status === 401) {
                  const uniqueId = this.$store.state.auth.tokenAPI.uniqueId
                  this.$store.dispatch('auth/logout').then(r => {
                    this.$store.dispatch('dataStore/CLEAN')
                    cloudLogout(uniqueId)
                  })
                  const error = res.data && res.data.message
                  return reject(error)
                }
              }
              return resolve(res)
            })
            .catch(error => {
              if (!url.endsWith('common/login')) service.checkSessionOut(error)
              reject(error)
            })
        } else if (method.toLowerCase() === 'put') {
          service
            .putWithAxios(url, data, config)
            .then(res => {
              if (process.env.VUE_APP_PRODUCTION_TYPE === 'cloud') {
                if (res.status === 401) {
                  const uniqueId = this.$store.state.auth.tokenAPI.uniqueId
                  this.$store.dispatch('auth/logout').then(r => {
                    this.$store.dispatch('dataStore/CLEAN')
                    cloudLogout(uniqueId)
                  })
                  const error = res.data && res.data.message
                  return reject(error)
                }
              }
              return resolve(res)
            })
            .catch(error => {
              service.checkSessionOut(error)
              reject(error)
            })
        } else if (method.toLowerCase() === 'patch') {
          service
            .patchWithAxios(url, data, config)
            .then(res => {
              if (process.env.VUE_APP_PRODUCTION_TYPE === 'cloud') {
                if (res.status === 401) {
                  const uniqueId = this.$store.state.auth.tokenAPI.uniqueId
                  this.$store.dispatch('auth/logout').then(r => {
                    this.$store.dispatch('dataStore/CLEAN')
                    cloudLogout(uniqueId)
                  })
                  const error = res.data && res.data.message
                  return reject(error)
                }
              }
              return resolve(res)
            })
            .catch(error => {
              //  check session out
              service.checkSessionOut(error)
              reject(error)
            })
        }
      })
    },
    getBlobFromUrl (url) {
      const vuex = JSON.parse(localStorage.getItem('vuex'))
      const user = vuex.auth.user
      const headers = {
        sessionId: user.sessionId,
        'api-key': configs.ApiKey
      }
      if (process.env.VUE_APP_PRODUCTION_TYPE === 'cloud') {
        headers.Authorization = `Bearer ${vuex.auth.tokenAPI.accessToken}`
      }
      return fetch(url, { method: 'GET', headers })
        .then(response => response.blob())
        .then(blob => blob)
    }
  }
})()

const service = {
  productionType: process.env.VUE_APP_PRODUCTION_TYPE,
  getRealUrl (url) {
    if (url.startsWith('/api')) return url.replace('/api', configs.ApiUrl)
    return url
  },
  async getCallApi_Get (url, params) {
    return axios
      .get(url, { params: params }, await service.getRequestHeader())
      .then(response => {
        return Promise.resolve(response)
      })
      .catch(ex => {
        return Promise.reject(ex)
      })
  },
  getWithAxios (url, config) {
    return axios
      .get(url, config)
      .then(response => {
        return Promise.resolve(response)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  deleteWithAxios (url, config) {
    return axios
      .delete(url, config)
      .then(response => {
        return Promise.resolve(response)
      })
      .catch(ex => {
        return Promise.reject(ex)
      })
  },
  postWithAxios (url, data, config) {
    return axios
      .post(url, data, config)
      .then(response => {
        return Promise.resolve(response)
      })
      .catch(ex => {
        return Promise.reject(ex)
      })
  },
  putWithAxios (url, data, config) {
    return axios
      .put(url, data, config)
      .then(response => {
        return Promise.resolve(response)
      })
      .catch(ex => {
        return Promise.reject(ex)
      })
  },
  patchWithAxios (url, data, config) {
    return axios
      .patch(url, data, config)
      .then(response => {
        return Promise.resolve(response)
      })
      .catch(ex => {
        return Promise.reject(ex)
      })
  },
  checkSessionOut (error) {
    const sessionValidator =
      this.productionType === codes.productionTypes.CLOUD
        ? getCloudSessionValidation
        : getSessionValidation
    if (!sessionValidator(error)) {
      if (this.productionType === 'cloud') {
        if (store.state.auth.tokenAPI) {
          cloudLogout(store.state.auth.tokenAPI.uniqueId)
        }
        store.dispatch('dataStore/CLEAN')
      } else {
        store.dispatch('dataStore/CLEAN')
        router.push('/login')
      }
    }
  },
  async getRequestHeader () {
    const vuex = await JSON.parse(localStorage.getItem('vuex'))
    const user = vuex.auth.user
    const loginState = vuex.auth.loginState
    const hearder = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json;charset=UTF-8'
    }
    const url = configs.ApiUrl
    // https 요청인 경우 API key 추가.
    if (url && url.toLowerCase().includes('https://')) {
      hearder['api-key'] = configs.ApiKey
    }
    // login 상태라면 sessionId 추가.
    if (loginState === true) hearder.sessionId = user.sessionId
    // Cloud 버전이라면 Token추가.
    if (process.env.VUE_APP_PRODUCTION_TYPE === 'cloud') {
      hearder.Authorization = `Bearer ${vuex.auth.tokenAPI.accessToken}`
    }
    return hearder
  }
}

Utils.install = function (Vue) {
  Vue.prototype.$utils = Utils
}

export default Utils
