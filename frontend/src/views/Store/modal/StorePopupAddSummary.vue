<template>
  <v-dialog
    v-model="showAddStoreModal"
    :key="showAddStoreModal"
    @click:outside="cancelAddStore"
    persistent
    :retain-focus="false"
    width="850"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        v-on="on"
        :class="{ hidden: SingleUser }"
        :disabled="buttonDisabled"
        text
        class="btn"
        >{{ $t("Add") }}</v-btn
      >
    </template>
    <v-card class="popup">
      <h3 class="page-title-bar">
        <i class="ico ico-store"></i>{{ $t("Add Store") }}
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
              :ref="input.key"
              @change="setSelectableAreaNames(idx)"
              :items="input.options"
              :class="getStoreInputSelectClass(input.name)"
              class="form-select"
              :label="`${$t(input.label)}*`"
              :placeholder="getPlaceholder(input)"
              outlined
              dense
              hide-details
              v-model="input.value"
              clearable
              attach
            >
            </v-select>
            <v-text-field
              v-else
              outlined
              dense
              hide-details
              :ref="input.key"
              v-model="input.value"
              :disabled="idx === 0"
              :class="getStoreInputTextClass(input.key, idx)"
              :label="`${$t(input.label)}*`"
              :placeholder="getPlaceholder(input)"
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
              >{{ $t("Show Advanced Setting") }}</v-expansion-panel-header
            >
            <v-expansion-panel-content>
              <v-row v-for="(advInputs, idx) in advStoreInputs" :key="idx">
                <v-col
                  v-for="advInput in advInputs"
                  :key="advInput.name"
                  class="pt-2 pb-2"
                  cols="4"
                >
                  <v-select
                    v-if="advInput.selectable"
                    :label="$t(advInput.label)"
                    :placeholder="getPlaceholder(advInput)"
                    :items="advInput.options"
                    v-model="advInput.value"
                    :ref="advInput.key"
                    :class="getStoreInputSelectClass(advInput.name)"
                    outlined
                    dense
                    hide-details
                    clearable
                  ></v-select>
                  <v-text-field
                    v-else
                    v-model="advInput.value"
                    :ref="advInput.key"
                    @keyup.prevent="handleAdvInputKeyup"
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
        <v-btn text icon @click="handleStoreAddBtnClick()" class="btn">{{
          $t("Save")
        }}</v-btn>
        <v-btn text icon @click="cancelAddStore()" class="btn">{{
          $t("Cancel")
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
// StorePopupAddSummary와 StoreSettingsModal은 같은 부분이 많아 mixin(storePopup.js)를 사용한다.
// 추후 리팩토링시 v-for 반복문 부분을 삭제하고, 그로인해 길어지는 코드는 component화 해야한다.

import EventBus from '@/plugins/eventBus.js'
import commons from '@/plugins/commons'
import codes from '@/plugins/codes'

import StorePopup from '@/mixins/StorePopup'

export default {
  mixins: [StorePopup],
  props: {
    user: Object,
    buttonDisabled: Boolean,
    areaAddDisabled: {
      type: Boolean
    }
  },
  data () {
    return {
      productionType: process.env.VUE_APP_PRODUCTION_TYPE,
      showAddStoreModal: false,
      advancedSettingVisible: 1,
      countries: {},
      newAreas: [[], [], []],
      SingleUser: true,
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
            placeholderType: 'select',
            clearable: false
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
            clearable: true
          },
          {
            name: 'Country',
            key: 'countryInput',
            label: 'Country',
            value: null,
            selectable: false,
            placeholderType: 'input',
            clearable: true
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
            clearable: true
          },
          {
            name: 'Region',
            key: 'regionInput',
            label: 'Region',
            value: '',
            selectable: false,
            placeholderType: 'input',
            clearable: true
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
            clearable: true
          },
          {
            name: 'City',
            key: 'cityInput',
            label: 'City',
            value: '',
            selectable: false,
            placeholderType: 'input',
            clearable: true
          }
        ],
        [
          // 4
          {
            name: 'Store Name',
            key: 'storeName',
            label: 'Store Name',
            value: null,
            selectable: false,
            placeholderType: 'input'
          },
          {
            name: 'Store Code',
            key: 'store',
            label: 'Store Code',
            value: null,
            selectable: false,
            placeholderType: 'input'
          }
        ],
        [
          // 5
          {
            name: 'Time zone',
            key: 'zoneId',
            label: 'Time zone',
            value: null,
            options: [],
            selectable: true,
            placeholderType: 'select'
          },
          {
            name: 'Time Server',
            key: 'ipNtpServer',
            label: 'Time Server',
            value: null,
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
            value: 'Disabled',
            options: ['Enabled', 'Disabled'],
            selectable: true,
            placeholderType: 'toggle'
          },
          {
            name: 'LBS',
            key: 'lbsEnabled',
            label: 'LBS',
            value: 'Disabled',
            options: ['Enabled', 'Disabled'],
            selectable: true,
            placeholderType: 'toggle'
          }
        ]
      ],
      advStoreInputs: [
        [
          // 0
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
          // 1
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
          // 2
          {
            name: 'Icon Display Mode',
            key: 'batteryMode',
            label: 'Icon Display Mode',
            value: 0,
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
          // 4
          {
            name: 'Tap&Go Start Time',
            key: 'tapGoStartTime',
            label: 'Tap&Go Start Time',
            value: '9',
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
            value: '21',
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
      initialStoreInputs: [],
      initialAdvStoreInputs: []
    }
  },
  watch: {
    showAddStoreModal (val) {
      if (val) {
        // init Popup
        this.initiateStorePopup()
      }
    }
  },
  methods: {
    resetAddStoreInputs () {
      this.storeInputs = commons.copy(this.initialStoreInputs)
      this.advStoreInputs = commons.copy(this.initialAdvStoreInputs)
    },
    toggleAddStore () {
      this.showAddStoreModal = !this.showAddStoreModal
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
    // StoreInputs, advStoreInputs 정보를 변환, API Server에 요청가능한 형식으로 변환한다.
    async buildAddStoreReqBody (storeInputs, advStoreInputs) {
      const reqBody = {}
      const storeConfig = {}
      storeInputs = storeInputs.flat()
      advStoreInputs = advStoreInputs.flat()
      storeInputs = storeInputs.map((input) => {
        if (input.placeholderType === 'toggle') {
          if (
            input.value === undefined ||
            input.value === null ||
            input.value.length < 1
          ) {
            return input
          }
          input.value = this.enableToTrue(input.value)
        }
        if (this.isArea(input.key) && this.isAddArea(input.value)) {
          // 입력정보가 지역정보(Country, Region, City)이고, 값이 default 값인 경우.
          input.value = null
        }
        return input
      })
      advStoreInputs = advStoreInputs.map((input) => {
        if (input.placeholderType === 'toggle') {
          input.value = this.enableToTrue(input.value)
        }
        return input
      })
      // area 정보 제외 http 요청 body에 담음(API 요청형식에 맞추기 위함).
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
    async addStore () {
      let reqBody = await this.buildAddStoreReqBody(
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
      const config = { params: { company: this.storeInputs[0][0].value } }
      this.$utils
        .callAxiosWithBody(
          codes.requests.addStore.method,
          codes.requests.addStore.url,
          reqBody,
          config
        )
        .then((res) => {
          EventBus.$emit('messageAlert', this.$t(res.data.responseMessage))
          // Refresh ManagedStores
          EventBus.$emit('setManagedStores')
          this.cancelAddStore()
          this.$store.dispatch('dataStore/addManagedStore', {
            company: reqBody.company,
            country: reqBody.country,
            region: reqBody.region,
            city: reqBody.city,
            code: reqBody.store,
            name: reqBody.storeName
          })
        })
        .catch((error) => {
          if (
            error.response.data.responseCode === '402' ||
            error.response.data.responseCode === '409'
          ) {
            EventBus.$emit(
              'messageAlert',
              this.$t(error.response.data.responseMessage)
            )
          } else {
            EventBus.$emit(
              'messageAlert',
              this.$t('Failed to save a new store.')
            )
          }
        })
    },
    async handleStoreAddBtnClick () {
      if (this.user.lbsEnable === 'true') {
        // 접속한 유저가 lbs 사용가능한 유저일때만 lbs settings도 추가한다.
        const lbsEnabled =
          this.enableToTrue(this.storeInputs[6][1].value) || false
        await this.setLbsConfiguration(lbsEnabled)
      }
      this.addStore()
    },
    isAddBtn (val, idx) {
      if (Object.values(codes.msg.areaSelection)[idx] === val) return true
      return false
    },
    isAesAcs (key) {
      return key === 'AES' || key === 'ACS'
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
    async reloadStore () {
      if (this.cloudMode) {
        await this.refreshAreas(this.storeInputs[0][0].value)
        this.initialStoreInputs = commons.copy(this.storeInputs)
        this.initialAdvStoreInputs = commons.copy(this.advStoreInputs)
      }
    },
    async initiateStorePopup () {
      await this.refreshAreas()
      if (this.cloudMode) {
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
        const company = await this.$utils.getCompany()
        if (!commons.isNull(company)) {
          this.storeInputs[0][0].options.push(company)
          this.storeInputs[0][0].value = company
        }
      }
      this.initialStoreInputs = commons.copy(this.storeInputs)
      this.initialAdvStoreInputs = commons.copy(this.advStoreInputs)
    }
  },
  mounted () {
    this.SingleUser = this.user.serverType === 'SINGLE' // Or CENTRAL
    this.initiateStorePopup()
  }
}
</script>

<style>
.hidden {
  display: none;
}
</style>
