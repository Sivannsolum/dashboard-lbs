import EventBus from '@/plugins/eventBus'
import codes from '@/plugins/codes'
import utils from '@/plugins/utils'
import commons from '@/plugins/commons'

const StorePopup = {
  $utils: utils,
  computed: {
    cloudMode () {
      return (process.env.VUE_APP_PRODUCTION_TYPE === codes.productionTypes.CLOUD)
    },
    hiddenInputs () {
      const hiddenInputs = this.advStoreInputs[3].map((input) => input.name)
      if (this.user.lbsEnable === 'false') hiddenInputs.push(this.storeInputs[6][1].name)
      return hiddenInputs
    },
    removedInputs () {
      // 2021-02-09 Cloud일 경우 Time Server도 숨김처리
      const removedInputs = [this.storeInputs[6][0].name, this.storeInputs[5][1].name]
      return removedInputs
    }
  },
  mounted () {
    EventBus.$on('initiateStorePopup', () => {
      this.initiateStorePopup()
    })
  },
  methods: {
    isRemoved (inputName) {
      if (!this.cloudMode) return false
      return !(this.removedInputs.includes(inputName))
    },
    handleKeyUp (e) {
      const regex = /[ㄱ-ㅎㅏ-ㅣ가-힣|A-Za-z|.+_-]/g
      e.target.value = e.target.value.replace(regex, '')
    },
    handleAdvInputKeyup (e) {
      const regex = /[ㄱ-ㅎㅏ-ㅣ가-힣|A-Za-z|.+_-]/g
      e.target.value = e.target.value.replace(regex, '')
    },
    getArea (areas, areaName) {
      if (areas[areaName] !== undefined) return areas[areaName]
      areas[areaName] = {}
      return areas[areaName]
    },
    // countris tree를 만든다.
    loadStoreLocations (stores) {
      if (!commons.isAllValid(stores)) return []
      const countries = {}
      for (const store of stores) {
        const country = this.getArea(countries, store.country)
        const region = this.getArea(country, store.region)
        this.getArea(region, store.city)
      }
      return countries
    },
    getAreas (company) {
      if (!company) company = this.user.company
      const config = { params: { company: company } }
      return this.$utils
        .callAxios(
          codes.requests.getAreas.method,
          codes.requests.getAreas.url,
          config
        )
        .then(res => {
          return res.data.areaParamList
        })
    },
    getTimezones () {
      const config = { params: {} }
      return this.$utils
        .callAxios(
          codes.requests.getTimezones.method,
          codes.requests.getTimezones.url,
          config
        )
        .then(res => {
          return res.data.timezoneList
        })
    },
    removeInvalidValues (areas) {
      return areas.filter(area => commons.isValidStr(area))
    },
    async refreshAreas () {
      const storeCompany = this.cloudMode ? this.storeInputs[0][0].value : this.$store.state.auth.user.company
      let areas = await this.getAreas(storeCompany)
      areas = this.loadStoreLocations(areas)
      const timezones = await this.getTimezones()
        .then(timezones => {
          return timezones.map(timezone => timezone.name)
        })
      this.showAddStoreData(areas, timezones)
    },
    showAddStoreData (countries, timezones) {
      this.countries = countries
      this.storeInputs[1][0].options = this.removeInvalidValues(this.getAreaNames(countries, 0))
      this.storeInputs[5][0].options = timezones
    },
    cancelAddStore () {
      this.toggleAddStore()
      this.$emit('fireGetStores')
      this.resetAddStoreInputs()
      this.refreshAreas()
      if (this.advancedSettingVisible === 0) {
        this.toggleAdvSetting()
      }
    },
    getLocationCode (location) {
      let locationCode = 0
      switch (location) {
        case 'Right-Bottom': locationCode = 0
          break
        case 'Right-Top': locationCode = 1
          break
        case 'Left-Top': locationCode = 2
          break
        case 'Left-Bottom': locationCode = 3
          break
        default: locationCode = 0
          break
      }
      return locationCode
    },
    buildAreaInformation (areaInputs) {
      const reqBody = {
        company: this.storeInputs[0][0].value,
        // Prevent user from selecting a default message as a value.
        country: areaInputs[0] !== codes.msg.areaSelection.addCountry ? areaInputs[0] : this.storeInputs[1][0].value,
        region: areaInputs[1] !== codes.msg.areaSelection.addRegion ? areaInputs[1] : this.storeInputs[2][0].value,
        city: areaInputs[2] !== codes.msg.areaSelection.addCity ? areaInputs[2] : this.storeInputs[3][0].value
      }
      return reqBody
    },
    addAreaInformation (areaInputs) {
      const reqBody = this.buildAreaInformation(areaInputs)
      const config = { params: { } }
      return this.$utils
        .callAxiosWithBody(
          codes.requests.addAreaInformation.method,
          codes.requests.addAreaInformation.url,
          reqBody,
          config
        )
        .then(res => {
          if (res.data.responseCode * 1 < 300) return true
          return false
        })
        .catch(error => {
          if (error.response.data.responseCode === '402') {
            EventBus.$emit('messageAlert', this.$t(error.response.data.responseMessage))
          }
          return false
        })
    },
    isAddArea (value) {
      return (Object.values(codes.msg.areaSelection).filter(addArea => addArea === value).length > 0)
    },
    isArea (key) {
      let result = false
      switch (key) {
        case 'country': result = true
          break
        case 'region': result = true
          break
        case 'city': result = true
          break
        default: break
      }
      return result
    },
    isAreaInput (key) {
      let result = false
      switch (key) {
        case 'countryInput': result = true
          break
        case 'regionInput': result = true
          break
        case 'cityInput': result = true
          break
        default: break
      }
      return result
    },
    enableToTrue (val) {
      return (val === 'Enabled')
    },
    async focusInvalidInput (inputKey) {
      this.$nextTick(() => {
        this.$refs[inputKey][0].focus()
      })
    },
    isObjValid (obj) {
      for (const key of Object.keys(obj)) {
        if (obj[key].value === null || obj[key].value === undefined || (obj[key].value instanceof String && obj[key].value.length < 1)) {
          // 2021-02-09 숨김항목은 벨리데이션 체크를 하지않음.(cloud)
          if (this.cloudMode && this.removedInputs.includes(obj[key].name)) {
            return true
          }
          this.focusInvalidInput(key)
          setTimeout(() => {
            EventBus.$emit('messageAlert', this.$t(`The ${obj[key].name} is invalid.`))
          }, 500)
          return false
        }
      }
      return true
    },
    checkTapGoTime (t) { return (t > -1 && t < 26) },
    isStoreConfigValid (storeConfig) {
      if (!this.isObjValid(storeConfig)) return false
      // Check Tap&Go Start time and end time.
      const tapGoStartTime = Number(
        storeConfig[this.advStoreInputs[4][0].key].value
      )
      const tapGoEndTime = Number(
        storeConfig[this.advStoreInputs[4][1].key].value
      )
      if (tapGoEndTime <= tapGoStartTime) {
        setTimeout(() => {
          EventBus.$emit(
            'messageAlert',
            this.$t(
              `${this.advStoreInputs[4][1].name} is less than ${this.advStoreInputs[4][0].name}.`
            )
          )
        }, 500)
        return false
      }
      if (
        !this.checkTapGoTime(tapGoStartTime) ||
        !this.checkTapGoTime(tapGoEndTime)
      ) {
        setTimeout(() => {
          EventBus.$emit(
            'messageAlert',
            this.$t('Tap&Go time is out of valid value range. Range: 0~25')
          )
        }, 500)
        return false
      }
      return true
    },
    mapToValues (obj) {
      for (const key of Object.keys(obj)) {
        obj[key] = obj[key].value
      }
      return obj
    },
    setLbsConfiguration (lbsEnabled) {
      let setting = codes.lbsSetting.LBS_DISABLED_DEFAULT_SETTING
      if (lbsEnabled) setting = codes.lbsSetting.LBS_ENABLED_DEFAULT_SETTING
      const storeCode = this.storeInputs[4][1].value
      const params = { company: this.user.company, store: storeCode }
      const config = { params: params }
      return this.$utils
        .callAxiosWithBody(
          codes.requests.setLbsConfiguration.method,
          `${codes.requests.setLbsConfiguration.url}/${storeCode}`,
          setting,
          config
        )
        .then(res => {
          if (res.data) return true
          return false
        })
        .catch(error => {
          console.debug(`an error occured while setting LBS configuration: ${error}`)
          return false
        })
    },
    getAreaNames (area, idx) {
      let areas = [this.getAreaMsg(idx)]
      if (area !== null && area !== undefined) areas = [...areas, ...Object.keys(area)]
      return areas
    },
    getAreaMsg (idx) {
      return Object.values(codes.msg.areaSelection)[idx]
    },
    getSelectableAreaNames (areaNames = [], inputs, areas, idx, length) {
      if (idx === length - 1) return areaNames
      // Find selected value's children.
      if (areas === undefined) {
        for (let i = idx + 1; i < length; i++) { areaNames.push([this.getAreaMsg(i)]) }
        return areaNames
      } else {
        areaNames[idx] = this.getAreaNames(areas[inputs[idx].value], idx + 1)
      }
      return this.getSelectableAreaNames(areaNames, inputs, areas[inputs[idx].value], ++idx, length)
    },
    setSelectableAreaNames (inputIdx) {
      if (inputIdx === 0) {
        console.log('setSelectableAreaNames :', inputIdx, this.storeInputs[0][0], this.storeInputs[0][0].value)
        this.reloadStore()
        //  this.storeInputs[0].value
        return
      }
      console.log('setSelectableAreaNames[2] :', inputIdx, this.storeInputs[0])
      if (inputIdx < 0 || inputIdx > 4) return
      let storeInputs = this.storeInputs.map(input => {
        return input[0]
      })
      storeInputs = storeInputs.slice(1, 4)
      let areaNames = this.getSelectableAreaNames([], storeInputs, this.countries, 0, storeInputs.length)
      areaNames = areaNames.map(areas => {
        return this.removeInvalidValues(areas)
      })
      for (let idx = 0; idx < areaNames.length; idx++) {
        // Show processed data.
        this.storeInputs[idx + 2][0].options = areaNames[idx]
      }
      for (let i = inputIdx + 1; i < storeInputs.length + 1; i++) {
        // Empty every child node's value.
        this.storeInputs[i][0].value = null
      }
    },
    getCols (idx) {
      let cols = 0
      switch (idx) {
        case 0: cols = 6
          break
        default: cols = 6
          break
      }
      return cols
    },
    getTapAndGoDisabled () {
      return (this.user.tapAndGoEnable === 'false')
    },
    isHiddenInput (inputKey) {
      if (this.hiddenInputs.includes(inputKey)) return true
      return false
    },
    getStoreInputSelectClass (inputKey) {
      let cls = 'form-select form-input'
      if (this.isHiddenInput(inputKey)) {
        cls = 'form-select in-btn hidden'
      }
      return cls
    },
    getAdvStoreInputTextClass (inputKey) {
      return this.getStoreInputSelectClass(inputKey)
    },
    async addAreaValue (value, idx) {
      const areaInputs = []
      for (let i = 1; i < 4; i++) {
        if (this.isAddBtn(this.storeInputs[i][0].value, i - 1)) {
          // Coutry, Region, City 등 지역 추가버튼의 값인 경우
          areaInputs.push('')
          continue
        }
        // 지역 값인 경우는 값을 저장
        areaInputs.push(this.storeInputs[i][0].value)
      }
      areaInputs[idx - 1] = value // 현재 Store 지역정보에 추가하려는 지역값을 삽입.
      const areaSaved = await this.addAreaInformation(areaInputs)
      await this.refreshAreas()
      if (areaSaved) {
        EventBus.$emit('messageAlert', this.$t('A new area information is successfully saved.'))
        this.storeInputs[idx][0].value = value
        this.setSelectableAreaNames(idx)
        const selectedStore = this.$store.state.dataStore.selectedStore
        let target = null
        switch (target) {
          case 1 : target = 'country'
            break
          case 2 : target = 'region'
            break
          case 3 : target = 'city'
            break
        }
        selectedStore[target] = value
        this.$store.dispatch('dataStore/UPDATE_SELECTED_STORE', selectedStore)
      }
      this.storeInputs[idx][1].value = '' // 지역값 Input box 초기화
    }
  }
}

export default StorePopup
