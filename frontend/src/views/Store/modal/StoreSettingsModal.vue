<template>
  <v-dialog
    :key="storeSettingVisible"
    v-model="storeSettingVisible"
    width="700"
    @click:outside="cancelStoreSetting()"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        :disabled="buttonDisabled"
        @click="showStoreSettingData()"
        text
        v-bind="attrs"
        v-on="on"
        ><img src="@/assets/img/ico-setting.png" alt=""
      /></v-btn>
    </template>
    <v-card class="popup">
      <h3 class="page-title-bar">
        <i class="ico ico-store"></i>{{ $t('Store Setting') }}
      </h3>
      <div class="custom-scrollBox">
        <v-row v-for="(inputs, idx) in storeInputs" :key="idx">
          <v-col
            v-for="(input, colIdx) in inputs"
            v-show="isRemoved(input.name)"
            :key="input.key"
            class="pt-2 pb-2"
            :cols="getCols(idx)"
          >
            <v-select
              v-if="input.selectable"
              v-model="input.value"
              :ref="input.key"
              :disabled="input.disabled"
              @change="setSelectableAreaNames(idx)"
              :items="input.options"
              :class="getStoreInputSelectClass(input.name)"
              :label="`${$t(input.label)}*`"
              :placeholder="getPlaceholder(input)"
              outlined
              dense
              hide-details
              clearable
              attach
            >
            </v-select>
            <v-text-field
              v-model="input.value"
              :disabled="input.disabled || areaAddDisabled"
              :class="getStoreInputTextClass(input.key, idx)"
              :label="`${$t(input.label)}*`"
              :placeholder="getPlaceholder(input)"
              v-else
              outlined
              dense
              hide-details
              clearable
            >
              <template v-if="isAreaInput(input.key)" v-slot:append>
                <v-btn
                  :disabled="areaAddDisabled"
                  @click="addAreaValue(input.value, idx, colIdx - 1)"
                  text
                >
                  <img src="@/assets/img/btn-save.jpg" alt="" />
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
        <v-expansion-panels
          flat
          accordion
          class="advancedSetting"
          v-model="advancedSettingVisible"
        >
          <v-expansion-panel>
            <v-expansion-panel-header class="pl-0 pr-0"
              ><i class="throwline"></i
              >{{ $t('Show Advanced Setting') }}</v-expansion-panel-header
            >
            <v-expansion-panel-content>
              <v-row v-for="(advInputs, idx) in advStoreInputs" :key="idx">
                <v-col
                  v-for="advInput in advInputs"
                  :key="advInput.name"
                  class="pt-1 pb-1"
                  cols="4"
                >
                  <v-select
                    v-if="advInput.selectable"
                    :label="$t(advInput.label)"
                    :placeholder="getPlaceholder(advInput)"
                    :items="advInput.options"
                    v-model="advInput.value"
                    :class="getStoreInputSelectClass(advInput.name)"
                    outlined
                    dense
                    hide-details
                    clearable
                  ></v-select>
                  <v-text-field
                    v-else
                    v-model="advInput.value"
                    @keyup.prevent="handleKeyUp"
                    :min="advInput.min ? advInput.min : -100000"
                    :max="advInput.max ? advInput.max : 100000"
                    class="form-input"
                    :disabled="advInput.disabled"
                    :label="$t(advInput.label)"
                    :placeholder="getPlaceholder(advInput)"
                    outlined
                    dense
                    hide-details
                    type="number"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
      <v-card-actions class="d-flex justify-center">
        <v-btn text icon @click="handleSaveBtnClick" class="btn">{{
          $t('Save')
        }}</v-btn>
        <v-btn text icon @click="cancelStoreSetting()" class="btn">{{
          $t('Cancel')
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
// 이 소스에 대한 설명은 StorePopupAddSummary의 <script> 태그를 참고.
import EventBus from '@/plugins/eventBus'
import commons from '@/plugins/commons'
import codes from '@/plugins/codes'

import StorePopup from '@/mixins/StorePopup'

export default {
  mixins: [StorePopup],
  props: {
    user: {
      type: Object
    },
    store: {
      type: Object
    },
    buttonDisabled: {
      type: Boolean
    },
    areaAddDisabled: {
      type: Boolean
    }
  },
  data () {
    return {
      productionType: process.env.VUE_APP_PRODUCTION_TYPE,
      countries: {},
      storeSettingVisible: false,
      advancedSettingVisible: 1,
      storeInputs: [
        [
          // 0
          {
            name: 'Company',
            key: 'company',
            label: 'Company',
            value: null,
            options: [],
            selectable: true,
            placeholderType: 'input',
            disabled: true
          }
        ],
        [
          // 1
          {
            name: 'Country',
            key: 'country',
            label: 'Country',
            value: null,
            options: [],
            selectable: true,
            placeholderType: 'select',
            disabled: this.user.serverType === 'SINGLE'
          },
          {
            name: 'Country',
            key: 'countryInput',
            label: 'Country',
            value: null,
            selectable: false,
            placeholderType: 'input'
          }
        ],
        [
          // 2
          {
            name: 'Region',
            key: 'region',
            label: 'Region',
            value: null,
            options: [],
            selectable: true,
            placeholderType: 'select',
            disabled: this.user.serverType === 'SINGLE'
          },
          {
            name: 'Region',
            key: 'regionInput',
            label: 'Region',
            value: '',
            selectable: false,
            placeholderType: 'input'
          }
        ],
        [
          // 3
          {
            name: 'City',
            key: 'city',
            label: 'City',
            value: null,
            options: [],
            selectable: true,
            placeholderType: 'select',
            disabled: this.user.serverType === 'SINGLE'
          },
          {
            name: 'City',
            key: 'cityInput',
            label: 'City',
            value: '',
            selectable: false,
            placeholderType: 'input'
          }
        ],
        [
          // 4
          {
            name: 'Store Name',
            key: 'storeName',
            label: 'Store Name',
            value: '',
            selectable: false,
            placeholderType: 'input'
          },
          {
            name: 'Store Code',
            key: 'store',
            label: 'Store Code',
            value: '',
            selectable: false,
            placeholderType: 'input',
            disabled: true
          }
        ],
        [
          // 5
          {
            name: 'Time zone',
            key: 'zoneId',
            label: 'Time zone',
            value: '',
            options: [],
            selectable: true,
            placeholderType: 'select',
            disabled: true
          },
          {
            name: 'Time Server',
            key: 'ipNtpServer',
            label: 'Time Server',
            value: '',
            selectable: false,
            placeholderType: 'input'
          }
        ],
        [
          // 6
          {
            name: 'Whitelist',
            key: 'whiteListEnable',
            label: 'Whitelist',
            value: false,
            options: ['Enabled', 'Disabled'],
            selectable: true,
            placeholderType: 'toggle'
          },
          {
            name: 'LBS',
            key: 'lbsEnabled',
            label: 'LBS',
            value: false,
            options: ['Enabled', 'Disabled'],
            selectable: true,
            placeholderType: 'toggle'
          }
        ]
      ],
      advStoreInputs: [
        [
          {
            name: 'Lost Time',
            key: 'lostTime',
            label: 'Lost Time',
            value: '0',
            defaultValue: '0',
            creteria: 'Hour',
            selectable: false,
            placeholderType: 'range'
          },
          {
            name: 'Logo Display Time',
            key: 'logoDisplayTime',
            label: 'Logo Display Time',
            value: '0',
            defaultValue: '0',
            creteria: 'Hour',
            selectable: false,
            placeholderType: 'range'
          },
          {
            name: 'Beacon Loss Limit',
            key: 'beaconLossLimit',
            label: 'Beacon Loss Limit',
            value: '10',
            creteria: 'Count',
            defaultValue: '10',
            selectable: false,
            placeholderType: 'range'
          }
        ],
        [
          {
            name: 'Alive Check Interval',
            key: 'aliveInterval',
            label: 'Alive Check Interval',
            value: '24',
            creteria: 'Hour',
            defaultValue: '24',
            selectable: false,
            placeholderType: 'range'
          },
          {
            name: 'Reactivation Retry Limit',
            key: 'reactivationRetryLimit',
            label: 'Reactivation Retry Limit',
            value: '2',
            creteria: 'Count',
            defaultValue: '2',
            selectable: false,
            placeholderType: 'range'
          },
          {
            name: 'Scan Period Set',
            key: 'scanPeriodSet',
            label: 'Scan Period Set',
            value: '0',
            creteria: 'Count',
            defaultValue: '0',
            selectable: false,
            placeholderType: 'range'
          }
        ],
        [
          {
            name: 'Icon Display Mode',
            key: 'batteryMode',
            label: 'Icon Display Mode',
            value: '0',
            defaultValue: 0,
            options: [0, 1, 2, 3, 4, 5, 6],
            selectable: true,
            placeholderType: 'select'
          },
          {
            name: 'Icon Display Position',
            key: 'location',
            label: 'Icon Display Position',
            value: 'Right-Bottom',
            defaultValue: '',
            options: ['Right-Bottom', 'Right-Top', 'Left-Top', 'Left-Bottom'],
            selectable: true,
            placeholderType: 'select'
          },
          {
            name: 'Update Page Unlock',
            key: 'updatePageUnlock',
            label: 'Update Page Unlock',
            value: 'Disabled',
            defaultValue: 'Disabled',
            options: ['Enabled', 'Disabled'],
            selectable: true,
            placeholderType: 'toggle'
          }
        ],
        [
          // 3. ※ Hidden inputs ※
          {
            name: 'AES',
            key: 'aesEnable',
            label: 'AES',
            value: 'Disabled',
            defaultValue: '',
            options: ['Enabled', 'Disabled'],
            selectable: true,
            placeholderType: 'toggle'
          },
          {
            name: 'ACS',
            key: 'acsEnable',
            label: 'ACS',
            value: 'Disabled',
            defaultValue: '',
            options: ['Enabled', 'Disabled'],
            selectable: true,
            placeholderType: 'toggle'
          }
        ],
        [
          {
            name: 'Tap&Go Start Time',
            key: 'tapGoStartTime',
            label: 'Tap&Go Start Time',
            value: '0',
            defaultValue: '',
            selectable: false,
            placeholderType: 'own',
            placeholder: 'Range: 0 ~ 25',
            min: 0,
            max: 25,
            disabled: this.getTapAndGoDisabled()
          },
          {
            name: 'Tap&Go End Time',
            key: 'tapGoEndTime',
            label: 'Tap&Go End Time',
            value: '1',
            defaultValue: '',
            selectable: false,
            placeholderType: 'own',
            placeholder: 'Range: 0 ~ 25',
            min: 0,
            max: 25,
            disabled: this.getTapAndGoDisabled()
          },
          {
            name: 'Flexible Default',
            key: 'flexibleDefault',
            label: 'Flexible Default',
            value: '0',
            defaultValue: '0~23',
            selectable: false,
            placeholderType: 'input'
          }
        ]
      ],
      prevLbsEnable: false
    }
  },
  methods: {
    cancelStoreSetting () {
      this.toggleEditStore()
      this.$emit('fireGetStores')
      if (this.advancedSettingVisible === 0) {
        this.toggleAdvSetting()
      }
    },
    toggleEditStore () {
      this.storeSettingVisible = !this.storeSettingVisible
    },
    toggleAdvSetting () {
      this.advancedSettingVisible = this.advancedSettingVisible === 0 ? 1 : 0
    },
    getPlaceholder (input) {
      let placeholder = ''
      switch (input.placeholderType) {
        case 'select':
          placeholder = this.$t(`Select the ${input.name.toLowerCase()}`)
          break
        case 'toggle':
          placeholder = this.$t('Enable/Disable')
          break
        case 'input':
          placeholder = this.$t(`Input the ${input.name.toLowerCase()}`)
          break
        case 'own':
          placeholder = this.$t(input.placeholder)
          break
        case 'range':
          placeholder = `${this.$t('Criteria')}:${input.creteria}, ${this.$t(
            'Default Value'
          )}:${input.defaultValue}`
          break
        default:
          placeholder = this.$t(`Input the ${input.name}`)
          break
      }
      return placeholder
    },
    buildEditStoreReqBody (storeInputs, advStoreInputs) {
      const reqBody = {}
      const storeConfig = {}
      storeInputs = storeInputs.flat()
      advStoreInputs = advStoreInputs.flat()
      storeInputs = storeInputs.map(input => {
        if (input.placeholderType === 'toggle') {
          if (!commons.isValidStr(input.value)) return input
          input.value = this.enableToTrue(input.value)
        }
        if (this.isArea(input.key) && this.isAddArea(input.value)) {
          // 입력정보가 지역정보(Country, Region, City)이고, 값이 default 값인 경우.
          input.value = null
        }
        return input
      })
      advStoreInputs = advStoreInputs.map(input => {
        if (input.placeholderType === 'toggle') {
          input.value = this.enableToTrue(input.value)
        }
        return input
      })
      // area 정보 제외 http 요청 body에 담음
      for (const input of storeInputs) {
        if (this.isAreaInput(input.key)) continue
        reqBody[input.key] = { value: input.value, name: input.name }
      }
      for (const input of advStoreInputs) {
        storeConfig[input.key] = { value: input.value, name: input.name }
      }
      storeConfig.location.value = this.getLocationCode(
        storeConfig.location.value
      )
      reqBody.storeConfig = storeConfig
      return reqBody
    },

    async handleSaveBtnClick () {
      let lbsConfigured = true
      if (this.user.lbsEnable === 'true') {
        // 접속한 유저가 lbs 사용가능한 유저일때만 lbs settings도 추가한다.
        const lbsEnabled =
          this.enableToTrue(this.storeInputs[6][1].value) || false

        if (this.prevLbsEnable !== lbsEnabled) lbsConfigured = await this.setLbsConfiguration(lbsEnabled)
      }
      if (lbsConfigured === true) {
        // LBS 설정 성공하거나 User가 LBS설정 불가능한 경우.
        this.editStore()
        this.$store.dispatch(
          'dataStore/UPDATE_SELECTED_STORE',
          this.$store.getters['dataStore/GET_SELECTED_STORE']
        )
      }
    },
    async editStore () {
      let reqBody = await this.buildEditStoreReqBody(
        commons.copy(this.storeInputs),
        commons.copy(this.advStoreInputs)
      )
      const isStoreConfigValid = await this.isStoreConfigValid(
        commons.copy(reqBody.storeConfig)
      )
      const storeConfig = this.mapToValues(reqBody.storeConfig)
      delete reqBody.storeConfig
      const isBodyValid = await this.isObjValid(reqBody)
      if (!isBodyValid || !isStoreConfigValid) return
      reqBody = this.mapToValues(reqBody)
      reqBody.storeConfig = storeConfig
      const config = { params: { store: this.storeInputs[4][1].value } }

      if (this.cloudMode) {
        config.params.company = this.storeInputs[0][0].value
      }
      this.$utils
        .callAxiosWithBody(
          codes.requests.editStore.method,
          codes.requests.editStore.url,
          reqBody,
          config
        )
        .then(res => {
          // Refresh ManagedStores
          EventBus.$emit('setManagedStores')
          EventBus.$emit('messageAlert', this.$t(res.data.responseMessage))
          this.showStoreSettingData()
          this.cancelStoreSetting()
          const selectedStore = this.$store.state.dataStore.selectedStore
          if (reqBody.storeName === selectedStore.name) {
            selectedStore.country = reqBody.country
            selectedStore.region = reqBody.region
            selectedStore.city = reqBody.city
            this.$store.dispatch('dataStore/UPDATE_SELECTED_STORE', selectedStore)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    getStoreInfo (storeCode) {
      const params = { store: storeCode }
      const config = { params }
      // cloud 용 임시
      if (this.cloudMode) {
        // params.company = this.$store.state.auth.user.company
        params.company = this.store.company
      }
      return this.$utils
        .callAxios(
          codes.requests.getStoreInfo.method,
          codes.requests.getStoreInfo.url,
          config
        )
        .then(res => {
          return res.data
        })
    },
    isAddBtn (val, idx) {
      if (Object.values(codes.msg.areaSelection)[idx] === val) return true
      return false
    },
    getStoreInputTextClass (inputKey, idx) {
      let cls = 'form-input'
      if (this.isAreaInput(inputKey)) {
        cls = 'form-input in-btn'
        if (!this.isAddBtn(this.storeInputs[idx][0].value, idx - 1)) {
          // select 값이 있으면 hidden
          cls = 'form-input in-btn hidden'
        }
      }
      return cls
    },
    getSwitchInputValue (storeInfoVal, storeInput) {
      return storeInfoVal ? storeInput.options[0] : storeInput.options[1]
    },
    toInputValue (storeInfoVal, storeInput) {
      let inputValue = null
      switch (storeInput.key) {
        case codes.configKeys.whiteListEnable:
          inputValue = this.getSwitchInputValue(storeInfoVal, storeInput)
          break
        case codes.configKeys.lbsEnabled:
          inputValue = this.getSwitchInputValue(storeInfoVal, storeInput)
          break
        case codes.configKeys.updatePageUnlock:
          inputValue = this.getSwitchInputValue(storeInfoVal, storeInput)
          break
        case codes.configKeys.location:
          inputValue = storeInput.options[storeInfoVal]
          break
      }
      return inputValue
    },
    setStoreInputs (store) {
      // this.store -> userInfo에서 불러온 store 정보
      // store -> store/detail 요청으로 불러온 store 정보
      // this.store는 areaGroupManagememt에서 수정한 지역정보가 반영된다.
      this.prevLbsEnable = store.lbsEnabled

      this.storeInputs[0][0].options.push(this.store.company)
      this.storeInputs[0][0].value = this.store.company
      this.storeInputs[1][0].value = this.store.country
      this.storeInputs[2][0].value = this.store.region
      this.storeInputs[3][0].value = this.store.city
      this.storeInputs[4][0].value = this.store.storeName
      this.storeInputs[4][1].value = this.store.store
      this.storeInputs[5][0].value = store.zoneId
      this.storeInputs[5][1].value = store.ipNtpServer
      this.storeInputs[6][0].value = this.toInputValue(
        store.whiteListEnable,
        this.storeInputs[6][0]
      )
      this.storeInputs[6][1].value = this.toInputValue(
        store.lbsEnabled,
        this.storeInputs[6][1]
      )
      this.advStoreInputs[0][0].value = store.storeConfig.lostTime
      this.advStoreInputs[0][1].value = store.storeConfig.logoDisplayTime
      this.advStoreInputs[0][2].value = store.storeConfig.beaconLossLimit
      this.advStoreInputs[1][0].value = store.storeConfig.aliveInterval
      this.advStoreInputs[1][1].value = store.storeConfig.reactivationRetryLimit
      this.advStoreInputs[1][2].value = store.storeConfig.scanPeriodSet
      this.advStoreInputs[2][0].value = store.storeConfig.batteryMode
      this.advStoreInputs[2][1].value = this.toInputValue(
        store.storeConfig.location,
        this.advStoreInputs[2][1]
      )
      this.advStoreInputs[2][2].value = this.toInputValue(
        store.storeConfig.updatePageUnlock,
        this.advStoreInputs[2][2]
      )
      this.advStoreInputs[3][0].value = store.storeConfig.aesEnable
      this.advStoreInputs[3][1].value = store.storeConfig.acsEnable
      this.advStoreInputs[4][0].value = store.storeConfig.tapGoStartTime
      this.advStoreInputs[4][1].value = store.storeConfig.tapGoEndTime
      this.advStoreInputs[4][2].value = store.storeConfig.flexibleDefault

      this.storeInputs[2][0].options = this.getAreaNames(
        this.countries[this.store.country],
        1
      )
      this.storeInputs[3][0].options = this.getAreaNames(
        this.countries[this.store.country][this.store.region],
        2
      )
    },
    showStoreSettingData () {
      this.initiateStorePopup()

      this.getStoreInfo(this.store.store).then(data => {
        this.setStoreInputs(data)
      })
    },
    async initiateStorePopup () {
      await this.refreshAreas(this.store.company)
      if (this.productionType === codes.productionTypes.CLOUD) {
        const company = this.$store.getters['dataStore/GET_SELECTED_STORE']
          .company
        if (company) {
          this.storeInputs[0][0].options.push(company)
          this.storeInputs[0][0].value = company
        } else {
          this.storeInputs[0][0].options.push(
            this.$store.getters['auth/GET_USER'].company
          )
          this.storeInputs[0][0].value = this.$store.getters[
            'auth/GET_USER'
          ].company
        }
      } else {
        this.storeInputs[0][0].options.push(this.store.company)
        this.storeInputs[0][0].value = this.store.company
      }
      // this.storeInputs[3][0].options = this.timezones
      this.$forceUpdate()
    }
  },
  mounted () {
    // SingleUser SINGLE 이면 area 정보 disabled
    this.initiateStorePopup()
  }
}
</script>

<style scoped>
.SingleUser {
  display: none;
}
.hidden {
  display: none;
}
</style>
