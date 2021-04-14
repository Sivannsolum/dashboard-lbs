<template>
  <div>
    <h2 class="page-title-bar"><i class="ico ico-template"></i>{{$t('Template Mapping')}}</h2>

    <v-tabs height="45"
      v-model="selectedTaps"
      :hide-slider="true"
      active-class="selected"
      class="tab-group mt-10"
    >
      <v-tab
          v-for="(value) in tabsItem"
          :key="value"
          @click="clickTap(value)"
        >
        {{ value }} {{$t('Page')}}
        </v-tab>
      <v-btn text icon height="45" @click="addTap()"><img src="@/assets/img/ico-plus.png" alt="추가"></v-btn>

      <v-tabs-items v-model="selectedTaps">
        <v-tab-item
          :transition="false"
          :reverse-transition="false"
          v-for="(value) in tabsItem"
          :key="value"
          class="tab-cont"
        >
          <TemplateMappingTab :tapNumber="value" :buttonDisabled="buttonDisabled" @changedSave="changedSaveState"></TemplateMappingTab>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>

    <!--Confirm Dialog -->
    <v-dialog
      v-model="dialogConfirm"
      width="400">
      <v-card class="popup add_store_popup" align="center" justify="center">
        <v-row >
          <v-col>
            <span v-text="confirmMessageText"></span>
          </v-col>
        </v-row>
        <v-card-actions class="d-flex justify-center">
          <v-btn text icon @click="moveTap('Yes')" class="btn">{{$t('Yes')}}</v-btn>
          <v-btn text icon @click="moveTap('No')" class="btn">{{$t('No')}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--Apply Dialog -->
    <v-dialog
      v-model="dialogApply"
      width="400"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn text :disabled="buttonDisabled" v-bind="attrs" v-on="on" class="btn bg mt-5">{{$t('Apply')}}</v-btn>
      </template>

      <v-card class="popup add_store_popup">
        <h3 class="page-title-bar"><i class="ico ico-template"></i>{{$t('Apply')}}</h3>

        <v-row>
          <v-col class="pt-0">
            <v-menu
              v-model="menu1"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field outlined dense hide-details readonly
                  :label="$t('Date')"
                  v-model="selectedDate"
                  v-bind="attrs"
                  v-on="on"
                  class="form-input"
                  clearable
                >
                  <template v-slot:append>
                    <img width="16" height="16" src="@/assets/img/ico-calendar.png" >
                  </template>
                </v-text-field>
              </template>
              <v-date-picker
                v-model="selectedDate"
                @input="menu1 = false"
                :min="minDate()"
                no-title
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select
              ref="selectedTime"
              v-model="selectedTime"
              :label="$t('Time')"
              :placeholder="`${$t('Choose the Time')}`"
              :items="timeItems"
              class="form-select"
              clearable
              outlined dense hide-details
            ></v-select>
          </v-col>
        </v-row>

        <v-card-actions class="d-flex justify-center">
          <v-btn @click="ApplySave()" text icon class="btn" >{{ $t('Save') }}</v-btn>
          <v-btn text icon @click="dialogApply = false" class="btn">{{ $t('Cancel') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import EventBus from '@/plugins/eventBus.js'
import TemplateMappingTab from './modal/TemplateMappingTab.vue'

export default {
  name: 'TemplateMapping',
  components: {
    TemplateMappingTab
  },
  data () {
    return {
      // cloud 용 임시
      productionType: process.env.VUE_APP_PRODUCTION_TYPE,
      buttonDisabled: false,
      date: new Date().toISOString().substr(0, 10),
      selectedTaps: null,
      currentTab: null,
      nextTab: null,
      selectedDate: '',
      selectedTime: [],
      selected: [],
      tabsItem: [], //  { id: '1' }
      tabsItemCopy: [], //  { id: '1' }
      timeItems: [],
      menu1: false,
      changedSave: false,
      dialogApply: false,
      dialogConfirm: false,
      confirmMessageText: this.$t('There is the changed mapping information. Do you want to continue without saving?'),
      page: 1,
      pageCount: 0,
      requests: {
        getSettingTemplatePage: {
          method: 'get',
          url: '/api/common/templates/mapping/condition/count'
        },
        applyTemplate: {
          method: 'put',
          url: '/api/common/templates/mapping/condition/apply'
        }
      }
    }
  },
  watch: {
    dialogApply (value) {
      if (value) { // opening
        this.selectedDate = this.getFormatDate(new Date())
        this.selectedTime = ''
        this.getTimeItems()
      }
    }
  },
  mounted () {
    //  Template Mapping : Add/ Edit / Delete / Save / Apply
    this.$store.dispatch('auth/getDisabledBtn', '5300').then(flag => {
      this.buttonDisabled = flag
    })

    this.getSettingTemplatePage()
    // 상단 공통 팝업 & 자동완성기능 사용유무
    EventBus.$emit('enableSelectedStores', false)
  },
  computed: {
  },
  methods: {
    minDate () {
      return this.getFormatDate(new Date())
    },
    moveTap (YasNo) {
      if (YasNo === 'Yes') {
        this.selectedTaps = this.nextTab
        this.changedSave = false
      } else {
        this.selectedTaps = this.currentTab
      }
      this.dialogConfirm = false
    },
    getTimeItems () {
      const TimeArray = []
      const minuteArray = ['00', '30']
      let time = ''
      for (let i = 0; i < 24; i++) {
        if (i < 10) {
          time = '0' + i
        } else {
          time = i
        }
        for (let x = 0; x < 2; x++) {
          TimeArray.push(time + ':' + minuteArray[x])
        }
      }

      this.timeItems = TimeArray
    },
    getFormatDate (date) {
      var year = date.getFullYear()
      var month = (1 + date.getMonth())
      month = month >= 10 ? month : '0' + month
      var day = date.getDate()
      day = day >= 10 ? day : '0' + day
      return year + '-' + month + '-' + day
    },
    clickTap (value) {
      this.currentTab = this.selectedTaps
      this.nextTab = this.getIndexTaps(value)
      if (this.changedSave) { // 변경 내역이 있으면 confrim
        this.dialogConfirm = true
      }
    },
    createdTap (pageList) {
      const tabs = []
      pageList.forEach(function (value, index) {
        tabs.push(value)
      })
      this.tabsItem = tabs
      this.tabsItemCopy = tabs
    },
    addTap () {
      let autoSelectedTap = 0
      if (this.tabsItem.length > 6) {
        autoSelectedTap = this.tabsItem.length
      } else {
        for (let i = 0; i <= this.tabsItem.length; i++) {
          // 중간에 추가하는 경우
          if (this.tabsItem.indexOf(i + 1) === -1) {
            this.tabsItem.push((i + 1))
            this.tabsItemCopy = this.tabsItem.slice()
            this.tabsItem.sort()
            autoSelectedTap = i + 1
            break
          }
          // 뒤로 새로 추가 하는경우
          if ((i + 1) === this.tabsItem.length) {
            this.tabsItem.push((this.tabsItem.length + 1))
            this.tabsItemCopy = this.tabsItem.slice()
            this.tabsItem.sort()
            autoSelectedTap = this.tabsItem.length
            break
          }
        }
      }
      this.selectedTaps = this.getIndexTaps(autoSelectedTap)
    },
    // 현재 선택될 탭을 선택
    getIndexTaps (number) {
      let indexNumber = ''
      this.tabsItemCopy.filter((row, index) => {
        if (number === row) {
          indexNumber = index
        }
      })
      return indexNumber
    },
    getSettingTemplatePage () {
      const data = {}
      const params = {}
      data.company = this.$store.state.auth.user.company
      const config = {
        data: data,
        params: params
      }
      // cloud 용 임시
      if (this.productionType === 'cloud') {
        params.company = this.$store.state.auth.user.company
      }
      this.$utils
        .callAxios(
          this.requests.getSettingTemplatePage.method,
          this.requests.getSettingTemplatePage.url,
          config
        )
        .then((res) => {
          const result = res.data
          if (result.responseCode === '200') {
            this.createdTap(res.data.pageList)
          }
        })
    },
    ApplySave () {
      if (this.selectedTime === '') {
        this.$refs.selectedTime.focus()
        EventBus.$emit('messageAlert', this.$t('Input the data'))
        return
      }
      const data = {}
      const params = { }
      params.company = this.$store.state.auth.user.company
      // cloud 용 임시
      if (this.productionType === 'cloud') {
        params.company = this.$store.state.auth.user.company
      }
      data.targetPage = -1
      data.scheduleInfo = this.selectedDate + ' ' + this.selectedTime
      const config = {
        params: params
      }
      this.$utils
        .callAxiosWithBody(
          this.requests.applyTemplate.method,
          this.requests.applyTemplate.url,
          data,
          config
        )
        .then((res) => {
          if (res.data.responseCode === '200') {
            EventBus.$emit('messageAlert', this.$t('Applied successfully'))
            this.dialogApply = false
          } else {
            EventBus.$emit('messageAlert', this.$t(res.data.responseMessage))
          }
        })
    },
    changedSaveState (flag) {
      this.changedSave = flag
    }
  }

}
</script>
