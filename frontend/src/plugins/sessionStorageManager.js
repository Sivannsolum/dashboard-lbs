// # Session Store Manager #
// Session storage에 객체를 저장하고 꺼내는 역할을 한다.
// 검색조건이 브라우저 Refresh 후에도 남게 해달라는 요청사항에 의해 제작했다.
// watch 메서드로 검색에 사용되는 변수를 감시해서 변수가 변할때마다 setObj로
// Session Storage에 변수를 저장하고, mounted 메서드에서 getObj로
// Session Storage에 저장한 검색기록을 가져오는 방식으로 사용한다.
// 로그아웃시에는 검색조건을 모두 삭제한다.
'use strict'

import commons from './commons'
import codes from './codes'

const setObj = (key, obj) => {
  if (commons.isNull(obj) || commons.isNull(key)) {
    console.debug('SessionStoreManager: Given key or object of the data to store into the session storeage is invalid.')
    return null
  }
  const objAsStr = JSON.stringify(obj)
  sessionStorage.setItem(key, objAsStr)
}

const getObj = (key) => {
  const objAsStr = sessionStorage.getItem(key)
  if (commons.isNull(objAsStr)) {
    console.debug('SessionStoreManager: The object you are trying to get does not exist, or invalid.')
    return null
  }
  return JSON.parse(objAsStr)
}

// Temporary objects will be deleted on user logout.
const setTempObj = (key, obj) => {
  key = `${codes.TEMP}${key}`
  setObj(key, obj)
}

const getTempObj = (key) => {
  key = `${codes.TEMP}${key}`
  return getObj(key)
}

// clear temporary objects
const clearTempObjs = () => {
  const keysToDel = []
  let itemKey
  for (let idx = 0; idx < sessionStorage.length; idx++) {
    itemKey = sessionStorage.key(idx)
    if (itemKey && itemKey.startsWith(codes.TEMP)) keysToDel.push(itemKey)
  }
  for (const keyToDel of keysToDel) {
    sessionStorage.removeItem(keyToDel)
  }
}

export { setObj, getObj, setTempObj, getTempObj, clearTempObjs }
