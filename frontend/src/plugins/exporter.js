// Export 기능을 제공하고자 하는 컴포넌트에서 export 하고자 하는 자료를
// 불러올 때 HTTP reqeust config를 저장해놓았다가 본 모듈에 제공해서 사용한다.
'use strict'

import utils from './utils'
import commons from './commons'
import codes from './codes'
import EventBus from './eventBus'

const buildParamsTxt = (params) => {
  const copiedParams = commons.copy(params)
  copiedParams.size = codes.EXPORT_SIZE
  delete copiedParams.page
  const paramsArr = []
  const keys = Object.keys(copiedParams)
  const values = Object.values(copiedParams)
  let val
  for (const idx in keys) {
    val = commons.isValue(values[idx])
    paramsArr.push(`${keys[idx]}=${val}`)
  }
  return paramsArr.join('&')
}

const downloadData = async (url, linkRef, fileName) => {
  const dataBlob = await utils.getBlobFromUrl(url)
  const objUrl = URL.createObjectURL(dataBlob)
  linkRef.href = objUrl
  linkRef.download = fileName
  linkRef.click()
}

const exportFiles = async (requestConfig, linkRef, fileName) => {
  let paramsTxt = buildParamsTxt(requestConfig.params)
  paramsTxt += '&export=true'
  const urlToOpen = `${requestConfig.url}?${paramsTxt}`
  const msg = 'Waiting for downloading'
  EventBus.$emit('toggleLoadingModal', msg)
  await downloadData(urlToOpen, linkRef, fileName)
  EventBus.$emit('toggleLoadingModal', msg)
}

const getRequestConfig = (config) => {
  const requestConfig = {
    url: config.url,
    method: config.method,
    params: config.params
  }
  return requestConfig
}

export { buildParamsTxt, exportFiles, getRequestConfig }
