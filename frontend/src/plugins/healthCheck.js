// A module checks if the API is available.
'use strict'

import utils from '@/plugins/utils'
import codes from '@/plugins/codes'
import commons from '@/plugins/commons'

const intervals = {
  keepUserSignedInInterval: null
}
// loads interval from the file 'env.{VUE_APP_PRODUCTION_TYPE}'.
const interval = process.env.HEALTH_CHECK_INTERVAL || 10000
const prodType = process.env.VUE_APP_PRODUCTION_TYPE

// Keep the user signed in.
const isUndefined = (obj, name) => {
  if (obj === undefined) {
    console.debug(`healthCheck: Failed to get ${name}. ${name} is undefined.`)
    return true
  }
  return false
}

const callApi = async () => {
  const configs = await import('@/plugins/configs')
  const newConfigs = await configs.default.appliedConfig
  const config = { params: {} }
  const vuex = JSON.parse(localStorage.getItem('vuex'))
  if (prodType === codes.productionTypes.CLOUD) { config.params.company = vuex.auth.user.company }

  return utils.callAxios(
    codes.requests.getAreas.method,
    codes.requests.getAreas.url.replace('/api', newConfigs.ApiUrl),
    config
  )
}

const getInterval = name => {
  if (isUndefined(intervals[name], 'interval')) return null
  return intervals[name]
}

const keepUserSignedIn = () => {
  if (
    intervals.keepUserSignedInInterval !== null &&
    intervals.keepUserSignedInInterval !== undefined
  ) { return }
  intervals.keepUserSignedInInterval = setInterval(() => {
    callApi()
      .then(res => {
        console.debug('keep calling API to keep the user signed in...')
      })
      .catch(error => {
        console.debug(`Failed to connect with API. ${error}`)
      })
  }, interval)
}
const clearIntervals = () => {
  if (commons.isNull(intervals) || intervals.length < 1) return
  for (const interval in intervals) {
    clearInterval(intervals[interval])
  }
}

// Check a API session.
const getSessionValidation = (error) => {
  // 권한이 없는 메뉴에 접근한 경우를 점검: session은 연결되어있다는 뜻
  if (error.response &&
    error.response.status === 423 &&
    error.response.data.startsWith('You have no permission.')
  ) {
    return true
  }
  // 세션이 없는 경우를 점검
  if (
    (error.response && error.response.status === 423) ||
    error.message === 'Network Error'
  ) {
    return false
  } else {
    return true
  }
}

const getCloudSessionValidation = error => {
  if (error.response === undefined || error.response.status === 401) {
    return false
  } else {
    return true
  }
}

const checkApiSession = async () => {
  return callApi()
    .then(res => {
      return true
    })
    .catch(error => {
      if (process.env.VUE_APP_PRODUCTION_TYPE === codes.productionTypes.CLOUD) {
        // Cloud 인경우 401 점검
        return getCloudSessionValidation(error)
      } else {
        // Cloud 이외의 환경인 경우 423, response 점검
        return getSessionValidation(error)
      }
    })
}

export {
  checkApiSession,
  getInterval,
  keepUserSignedIn,
  clearIntervals,
  getCloudSessionValidation,
  getSessionValidation
}
