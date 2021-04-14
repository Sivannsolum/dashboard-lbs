<template>
  <v-dialog
    v-model="dialog"
    width="900"
    @click:outside="cancelAnchorSetting"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn @click="getLbsConfiguration" :disabled="settingBtnDisabled" text v-bind="attrs" v-on="on" class="btn ml-2">{{$t('Setting')}}</v-btn>
    </template>
    <v-card class="popup">
      <h3 class="page-title-bar">
        <i class="ico ico-multi"></i>{{$t('Anchor Setting')}}
      </h3>

      <v-row>
        <v-col>
          <v-select
            v-model="setting.startTime.hours"
            outlined
            dense
            hide-details
            :label="Label_Hours"
            :placeholder="$t('Select the hour')"
            :items="settingOptions.startTime.hours"
            class="form-select"
          ></v-select>
        </v-col>
        <v-col>
          <v-select
            v-model="setting.startTime.minutes"
            outlined
            dense
            hide-details
            :placeholder="$t('Select the minute')"
            :items="settingOptions.startTime.minutes"
            class="form-select"
          ></v-select>
        </v-col>
      </v-row>

      <v-expansion-panels
        v-model="advancedSettingVisible"
        flat accordion
        class="advancedSetting">
        <v-expansion-panel>
          <v-expansion-panel-header class="pl-0 pr-0"
            ><i class="throwline"></i>{{$t('Show Advanced Setting')}}</v-expansion-panel-header
          >
          <v-expansion-panel-content>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="setting.endTime"
                  type="number"
                  :min="anchorSettingRange.endTime.min"
                  :max="anchorSettingRange.endTime.max"
                  :label="Label_EndTime"
                  :placeholder="placeholders.endTime"
                  class="form-input"
                  clearable
                  outlined
                  dense
                  hide-details
                >
                </v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="setting.gatheringEndTime"
                  type="number"
                  :min="anchorSettingRange.gatheringEndTime.min"
                  :max="anchorSettingRange.gatheringEndTime.max"
                  :label="Label_GatheringEndTime"
                  :placeholder="placeholders.gatheringEndTime"
                  class="form-input"
                  clearable
                  outlined
                  dense
                  hide-details
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="setting.txPower"
                  type="number"
                  :min="anchorSettingRange.txPower.min"
                  :max="anchorSettingRange.txPower.max"
                  :label="Label_TxPower"
                  :placeholder="placeholders.txPower"
                  class="form-input"
                  clearable
                  outlined
                  dense
                  hide-details
                >
                </v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="setting.txInterval"
                  type="number"
                  :min="anchorSettingRange.txInterval.min"
                  :max="anchorSettingRange.txInterval.max"
                  :label="Label_TxInterval"
                  :placeholder="placeholders.txInterval"
                  class="form-input"
                  clearable
                  outlined
                  dense
                  hide-details
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="setting.threshold"
                  type="number"
                  :min="anchorSettingRange.threshold.min"
                  :max="anchorSettingRange.threshold.max"
                  :label="Label_Threshold"
                  :placeholder="placeholders.threshold"
                  class="form-input"
                  clearable
                  outlined
                  dense
                  hide-details
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

      <v-card-actions class="d-flex justify-center">
        <v-btn text icon @click="handleClickSave" class="btn">{{$t('Save')}}</v-btn>
        <v-btn text icon @click="cancelAnchorSetting" class="btn">{{$t('Cancel')}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import EventBus from '@/plugins/eventBus.js'
import commons from '@/plugins/commons'
import codes from '@/plugins/codes'

const requests = {
  getLbsConfiguration: {
    method: 'get',
    url: '/api/common/lbs/config'
  },
  setLbsConfiguration: {
    method: 'post',
    url: '/api/common/lbs/config'
  }
}

export default {
  props: ['user', 'store', 'settingBtnDisabled'],
  data () {
    return {
      dialog: false,
      advancedSettingVisible: 1,
      setting: { startTime: { hours: null, minutes: null } },
      settingOptions: {
        startTime: {
          hours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
          minutes: [0, 10, 20, 30, 40, 50]
        }
      },
      anchorSettingRange: {
        endTime: {
          min: 7,
          max: 36
        },
        gatheringEndTime: {
          min: 60,
          max: 7200
        },
        txPower: {
          min: 0,
          max: 9
        },
        txInterval: {
          min: 10,
          max: 255
        },
        threshold: {
          min: 0,
          max: 100
        }
      }
    }
  },
  methods: {
    toggleAdvSetting () {
      this.advancedSettingVisible = this.advancedSettingVisible === 0 ? 1 : 0
    },
    cancelAnchorSetting () {
      this.setting = { startTime: { hours: null, minutes: null } }
      this.dialog = false
      if (this.advancedSettingVisible === 0) {
        this.toggleAdvSetting()
      }
    },
    toValidTime (time) {
      if (time === undefined || time === null) time = '00'
      if (String(time).length < 2) time = `0${time}`
      return time
    },
    getDefaultLbsSetting (key) {
      return codes.lbsSetting.LBS_ENABLED_DEFAULT_SETTING[key]
    },
    convertSettingInput (settingInput) {
      const hours = this.toValidTime(settingInput.startTime.hours)
      const minutes = this.toValidTime(settingInput.startTime.minutes)
      settingInput.startTime = `${hours}${minutes}`
      for (const key of Object.keys(settingInput)) {
        if (!commons.isValidStr(settingInput[key])) settingInput[key] = this.getDefaultLbsSetting(key)
      }
      return settingInput
    },
    convertSetting (setting) {
      delete setting.storeCode
      delete setting.requestDate
      let startTime = String(setting.startTime).split('')
      if (!commons.isValidStr(startTime)) startTime = [0, 0, 0, 0]
      setting.startTime = {}
      setting.startTime.minutes = Number(startTime.splice(startTime.length - 2, 2).join('')) // last two chars, such as '00'
      setting.startTime.hours = Number(startTime.join('')) // first two chars.
      return setting
    },
    setLbsConfiguration () {
      const setting = this.convertSettingInput(this.setting)
      const params = { company: this.user.company, store: this.store.code }
      const config = { params: params }
      return this.$utils
        .callAxiosWithBody(
          requests.setLbsConfiguration.method,
          `${requests.setLbsConfiguration.url}/${this.store.code}`,
          setting,
          config
        )
        .then(res => {
          const result = res.data
          EventBus.$emit('messageAlert', this.$t(result.responseMessage))
          this.$emit('fireResetAnchors')
          this.cancelAnchorSetting()
        })
        .catch(error => {
          EventBus.$emit('messageAlert', this.$t('Failed to save LBS configuration.'))
          console.debug(`Failed to save LBS configuration. Error: ${error}`)
          this.cancelAnchorSetting()
        })
    },
    isValidStartTime (hours, minutes) {
      const thirtyMinLater = new Date()
      thirtyMinLater.setMinutes(thirtyMinLater.getMinutes() + 30)
      const start = new Date()
      start.setHours(hours)
      start.setMinutes(minutes)
      return (start > thirtyMinLater)
    },
    async handleClickSave () {
      const tempSettingToCheck = Object.assign({}, this.setting)
      tempSettingToCheck.startTimeHours = tempSettingToCheck.startTime.hours
      tempSettingToCheck.startTimeMinutes = tempSettingToCheck.startTime.minutes
      const isValidData = await commons.isValidData({ startTimeHours: tempSettingToCheck.startTimeHours, startTimeMinutes: tempSettingToCheck.startTimeMinutes })
      if (!isValidData.result) {
        EventBus.$emit('messageAlert', this.$t(isValidData.msg))
        return
      }
      const isValidStartTime = this.isValidStartTime(tempSettingToCheck.startTime.hours, tempSettingToCheck.startTime.minutes)
      if (isValidStartTime) {
        this.setLbsConfiguration()
      } else {
        // Ask if the user wanna continue
        this.$emit('fireConfirm', this.msg.confirm.startTime, this.setLbsConfiguration)
      }
    },
    getLbsConfiguration () {
      const params = { company: this.user.company, store: this.store.code }
      const config = { params: params }
      this.$utils
        .callAxios(
          requests.getLbsConfiguration.method,
          `${requests.getLbsConfiguration.url}/${this.store.code}`,
          config
        )
        .then(res => {
          console.log(res)
          this.setting = this.convertSetting(this.cloudMode ? res.data.lbsConfigResponse[0] : res.data)
        })
        .catch(error => console.log(error))
    }
  },
  computed: {
    cloudMode () {
      return (process.env.VUE_APP_PRODUCTION_TYPE === codes.productionTypes.CLOUD)
    },
    placeholders () {
      return {
        endTime: this.$t('Input End Time Value(7~36, default: 16)'),
        gatheringEndTime: this.$t('Input Gathering End Time Value (60~7200, default: 1800)'),
        txPower: this.$t('Input Tx-Power Value(0~9, default:2)'),
        txInterval: this.$t('Input Tx-Interval Value(10~255, default:30)'),
        threshold: this.$t('Input CCA Threshold Value(0~100, default: 75)')
      }
    },
    msg () {
      return {
        confirm: {
          startTime: this.$t('Selected start time is less than current time +30 mins, so it will take effect from tomorrow. Do you want to continue?')
        }
      }
    },
    Label_Hours () { return this.$t('Start Time') + ' *' },
    Label_EndTime () { return this.$t('End Time(duration)') },
    Label_GatheringEndTime () { return this.$t('Gathering End Time(duration)') },
    Label_TxPower () { return this.$t('Tx-Power') },
    Label_TxInterval () { return this.$t('Tx-Interval') },
    Label_Threshold () { return this.$t('CCA Threshold') }
  }
}
</script>

<style>
</style>
