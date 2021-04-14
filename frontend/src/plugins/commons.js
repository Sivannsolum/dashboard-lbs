// 공통으로 자주 사용하는 기능(null check, 객체 조작, 문자열 조작 등)을 제공하는 모듈.
'use strict'
import main from '@/main'

const commons = {
  // 깊은 복사를 수행한다. prototype properties도 복사된다.
  copy (obj) {
    if (this.isNull(obj)) {
      throw new TypeError(
        `The element you are trying to copy is invalid. element: ${obj}`
      )
    }
    if (typeof obj === 'string') return obj.repeat(1)
    if (typeof obj === 'number' || typeof obj === 'boolean') return obj
    const copiedObj = Array.isArray(obj) ? [] : {}
    for (const key in obj) {
      const val = obj[key]
      copiedObj[key] =
        typeof val === 'object' && val !== null ? this.copy(val) : val
    }
    return copiedObj
  },
  has (arr, el) {
    return arr.indexOf(el) !== -1
  },
  isUpperCase (text) {
    if (typeof text !== 'string') return false
    return text === text.toUpperCase()
  },
  isNull (val) {
    return (
      val === undefined || val === null || val === 'undefined' || val === false
    )
  },
  isAllValid (arr) {
    if (!Array.isArray(arr)) return false
    for (const el of arr) {
      if (this.isNull(el)) return false
    }
    return true
  },
  isAllInvalid (arr) {
    if (!Array.isArray(arr)) return true
    for (const el of arr) {
      if (this.isNull(el)) return true
    }
    return false
  },
  isValue (value) {
    if (value === null || value === undefined || value === 'undefined') {
      value = ''
    }
    return value
  },
  notEmpty (someObject) {
    let rtn = false
    if (someObject === null || someObject === undefined || someObject === '') {
      rtn = false
    } else {
      rtn = Object.keys(someObject).length > 0
    }
    return rtn
  },
  converMsg (msg, type) {
    switch (type) {
      case this.msgType.InvalidAnchorData:
        if (msg.includes('Location Id')) {
          msg = msg.replace('Location Id.', 'Location ID')
        } else {
          msg = msg.replace('Label Id', 'label ID')
        }
        break
      default:
    }
    return msg
  },
  isValidData (obj) {
    if (this.isNull(obj)) return { result: false, msg: '' }
    for (const key of Object.keys(obj)) {
      if (obj[key] === null || obj[key] === '' || obj[key] === undefined) {
        return {
          result: false,
          msg: `Please enter the${this.camelToPascal(key)}.`
        }
      }
    }
    return { result: true, msg: '' }
  },
  isValidStr (val) {
    return val !== undefined && val !== null && val.length > 0
  },
  peekFirst (arr) {
    const peeked = arr.shift()
    arr.unshift(peeked)
    if (this.isNull(peeked)) { console.debug('Could not peek any element from an array!') }
    return peeked
  },
  camelToPascal (text) {
    if (!this.isValidStr(text)) return ''
    const textArr = text.split('')
    textArr[0] = textArr[0].toUpperCase()
    for (const idx in textArr) {
      if (this.isUpperCase(textArr[idx])) {
        textArr[idx] = ` ${textArr[idx]}`
      }
    }
    return textArr.join('')
  },
  isSorting (sortBy, sortDesc) {
    if (!this.isAllValid([sortBy, sortDesc])) return false
    return sortBy.length === 1 && sortDesc.length === 1
  },
  getPageInfoText (headers) {
    if (
      this.isNull(headers) ||
      headers['x-totalelements'] === 0 ||
      headers['x-totalelements'] === undefined
    ) {
      return '0 to 0, 0 in total'
    }
    return `${headers['x-number'] * 1 * headers['x-size'] + 1} 
    to ${headers['x-number'] * 1 * headers['x-size'] +
      headers['x-total-count'] * 1},
     ${headers['x-totalelements'] * 1} in total`
  },
  insertIndex (list, headers) {
    if (list[0].storeId) {
      console.log(headers)
    }
    if (!commons.isValidStr(list)) return []
    let idx = Number(headers['x-number'] * headers['x-size']) + 1
    if (list.length < 2) idx = 1
    list = list.map(el => {
      el.no = idx
      idx++
      return el
    })
    return list
  },
  remove (arr, el) {
    if (arr.includes(el)) arr.splice(arr.indexOf(el), 1)
  },
  add (arr, el) {
    if (!arr.includes(el)) arr.push(el)
  },
  convertDate (date) {
    if (commons.isNull(date)) return '-'
    date = new Date(date)

    // utc time -> local time
    var offset = date.getTimezoneOffset() / 60
    var hours = date.getHours()

    date.setHours(hours - offset)

    const utcDate = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds()
    }
    for (const key of Object.keys(utcDate)) {
      if (utcDate[key] < 10) utcDate[key] = `0${utcDate[key]}`
    }
    return `${utcDate.year}-${utcDate.month}-${utcDate.day} ${utcDate.hours}:${utcDate.minutes}:${utcDate.seconds}`
  },
  convertArrDate (arr, dateKey) {
    arr = arr.map(el => {
      el[dateKey] = this.convertDate(el[dateKey])
      return el
    })
    return arr
  },
  convertNoLocalDate (date) {
    if (commons.isNull(date)) return '-'
    date = new Date(date)

    const utcDate = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds()
    }
    for (const key of Object.keys(utcDate)) {
      if (utcDate[key] < 10) utcDate[key] = `0${utcDate[key]}`
    }
    return `${utcDate.year}-${utcDate.month}-${utcDate.day} ${utcDate.hours}:${utcDate.minutes}:${utcDate.seconds}`
  },
  convertNoLocalArrDate (arr, dateKey) {
    arr = arr.map(el => {
      el[dateKey] = this.convertNoLocalDate(el[dateKey])
      return el
    })
    return arr
  },
  matchErrorType (err, type) {
    const { code, status, msg } = type
    if (
      (err.response.data.responseCode === code || code === null) &&
      (err.response.status === status || status === null) &&
      (err.response.data.responseMessage.includes(msg) || msg === null)
    ) {
      return true
    } else {
      return false
    }
  },
  toDashLessMacAddr (mac) {
    if (!commons.isValidStr(mac)) return
    const macAddress = mac.replaceAll('-', '')
    return `${macAddress.substring(0, 6)}FFFE${macAddress.substring(6, 13)}`
  },
  makeDesc (storeInfo) {
    let desc = [
      storeInfo.company,
      storeInfo.country,
      storeInfo.region,
      storeInfo.city,
      storeInfo.storeName
    ]
    desc = desc.filter(d => d !== undefined && d !== null)
    desc = desc.join('>')
    if (storeInfo.store !== null && storeInfo.store !== undefined) { desc += `(${storeInfo.store})` }
    return desc
  },
  buildStore (storeInfo) {
    const store = {
      code: storeInfo.store,
      name: storeInfo.storeName,
      company: storeInfo.company,
      country: storeInfo.country,
      region: storeInfo.region,
      city: storeInfo.city,
      description: this.makeDesc(storeInfo)
    }
    return store
  },
  async clearVuex () {
    await main.$store.dispatch('auth/logout')
    main.$store.dispatch('dataStore/CLEAN')
  },
  getBase64 (file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        let result = reader.result
        if (result.startsWith('data:')) {
          const base64Idx = 'base64,'
          const strToRemove = result.substring(
            0,
            result.indexOf(base64Idx, 0) + base64Idx.length
          )
          result = result.substring(strToRemove.length, result.length)
        }
        resolve(result)
      }
      reader.onerror = error => reject(error)
    })
  }
}

export default commons
