<template>
  <div>
    <h2 class="page-title-bar"><i class="ico ico-system"></i>{{$t('Report Config')}}</h2>

    <v-row>
      <v-col>
        <h3 class="tit-group mt-10">{{$t('Report Function')}}</h3>
        <!-- data table -->
        <table class="tbl-custom-type01 max-80">
          <colgroup>
            <col style="width:25%">
            <col style="width:25%">
            <col style="width:25%">
            <col>
          </colgroup>
          <thead>
            <tr>
              <th>{{$t('Range')}}</th>
              <th>{{$t('On/Off')}}</th>
              <th>{{$t('Cycle')}}</th>
              <th>{{$t('Reported Time')}}<span>({{$t('Account Time Zone')}})</span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{range}}</td>
              <td>
                <v-switch inset hide-details solo
                  class="form-switch"
                  v-model="use"
                ></v-switch>
              </td>
              <td>
                <v-select
                  dense hide-details solo
                  v-model="cycle"
                  :items="cycleItems"
                  ref="cycle"
                  width="50"
                  class="form-select"
                  clearable
                ></v-select>
              </td>
              <td>
                <v-select
                  dense hide-details solo
                  v-model="reportedTime"
                  ref="reportedTime"
                  :items="getReportedTimeItems"
                  class="form-select"
                  clearable
                >
                </v-select>
              </td>
            </tr>
          </tbody>
        </table>

        <v-btn :disabled="buttonDisabled" text class="btn-s mt-5" @click="setReport()">{{$t('Save')}}</v-btn>
      </v-col>
    </v-row>
    <v-row class="mt-15">
      <v-col class="pb-0">
        <h3 class="tit-group">{{$t('Mail Setting')}}</h3>
        <div class="halpBox settingBox">
          <v-row>
            <v-col>
              <p class="tit-group"><strong>{{$t('Email Host')}}</strong></p>
              <v-text-field outlined dense hide-details solo
                v-model="host"
                ref="host"
                :placeholder="$t('Mail Server Host Address')"
                class="form-input"
                clearable
              ></v-text-field>
            </v-col>
            <v-col>
              <p class="tit-group"><strong>{{$t('Email Port')}}</strong></p>
              <v-text-field outlined dense hide-details solo
                v-model="port"
                ref="port"
                type="number"
                @keyup.prevent="handleKeyUp"
                :placeholder="$t('Mail Server Port Number')"
                class="form-input"
                clearable
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <p class="tit-group"><strong>{{$t('Email Address')}}</strong></p>
              <v-text-field
                v-model="userName"
                ref="userName"
                :rules="[rules.email]"
                :placeholder="$t('Mail Address')"
                class="form-input"
                clearable
                outlined dense hide-details solo
              ></v-text-field>
            </v-col>
            <v-col>
              <p class="tit-group"><strong>{{$t('Email Password')}}</strong></p>
              <v-text-field outlined dense hide-details solo
                v-model="password"
                ref="password"
                :placeholder="$t('Mail Password')"
                type="password"
                class="form-input"
                clearable
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <p class="tit-group"><strong>{{$t('Email Encoding')}}</strong></p>
              <v-text-field outlined dense hide-details solo
                v-model="encoding"
                ref="encoding"
                :placeholder="$t('UTF-8')"
                class="form-input"
                clearable
              ></v-text-field>
            </v-col>
            <v-col>
              <p class="tit-group"><strong>{{$t('Email Auth')}}</strong></p>
              <v-select
                outlined dense hide-details solo
                v-model="auth"
                ref="auth"
                :placeholder="$t('Email Auth')"
                :items="['SSL', 'TLS']"
                class="form-select"
              ></v-select>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
    <v-btn  :disabled="serverDisabled" text class="btn t-bottom" @click="setServer()">{{$t('Save')}}</v-btn>
  </div>
</template>

<script>
import EventBus from '@/plugins/eventBus.js'

export default {
  name: 'ReportConfig',
  data () {
    return {
      productionType: process.env.VUE_APP_PRODUCTION_TYPE,
      dialog: false,
      buttonDisabled: false,
      serverDisabled: false,
      reportName: '',
      range: '',
      use: false,
      cycle: '',
      cycleItems: ['Daily'], // ['Monthly', 'Weekly', 'Daily']
      reportedTime: '',
      host: '',
      port: '',
      auth: '',
      userName: '',
      password: '',
      encoding: '',
      requests: {
        getReport: {
          method: 'get',
          url: '/api/common/config/report'
        },
        setReport: {
          method: 'post',
          url: '/api/common/config/report'
        },
        getServer: {
          method: 'get',
          url: '/api/common/config/emailsetting'
        },
        setServer: {
          method: 'put',
          url: '/api/common/config/emailsetting'
        }
      },
      rules: {
        email: value => {
          if (value === undefined) value = ''
          const pattern = /^$|^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
          return (
            pattern.test(value) || 'Not a valid Email'
          )
        }
      }
    }
  },
  computed: {
    getReportedTimeItems () {
      const items = []
      for (let i = 0; i < 24; i++) {
        items.push(i)
      }
      return items
    }
  },
  methods: {
    handleKeyUp (e) {
      // const notEngExp = /[^A-Za-z]/g
      const koreanExp = /[ㄱ-ㅎㅏ-ㅣ가-힣]/g
      // if (notEngExp.test(e.key)) { e.target.value = e.target.value.replace(koreanExp, '') }
      e.target.value = e.target.value.replace(koreanExp, '')
    },
    getReport () {
      const data = {}
      const params = {}
      // params.company = this.$store.state.auth.user.company
      if (this.productionType === 'cloud') {
        params.company = this.$store.state.auth.user.company
      }

      const config = {
        data: data,
        params: params
      }
      this.$utils
        .callAxios(
          this.requests.getReport.method,
          this.requests.getReport.url,
          config
        )
        .then((res) => {
          const result = res.data

          if (result.responseCode === '200') {
            this.reportName = result.reportList[0].reportName
            this.range = result.reportList[0].range
            this.cycle = result.reportList[0].cycle
            this.reportedTime = result.reportList[0].reportedTime
            this.use = result.reportList[0].use === 'ON'
          }
        })
    },
    setReport () {
      if (this.cycle === '') {
        this.$refs.cycle.focus()
        EventBus.$emit('messageAlert', this.$t('Input the data'))
        return
      }
      if (this.reportedTime === '') {
        this.$refs.reportedTime.focus()
        EventBus.$emit('messageAlert', this.$t('Input the data'))
        return
      }

      const data = {}
      const params = {}
      params.company = this.$store.state.auth.user.company
      data.reportList = [{
        range: this.range,
        use: this.use ? 'ON' : 'OFF',
        cycle: this.cycle,
        reportedTime: this.reportedTime
      }]

      const config = {
        params: params
      }
      this.$utils
        .callAxiosWithBody(
          this.requests.setReport.method,
          this.requests.setReport.url,
          data,
          config
        )
        .then((res) => {
          const result = res.data
          if (result.responseCode === '200') {
            EventBus.$emit('messageAlert', this.$t('Saved successfully'))
            //   this.initServer() // 초기화 안하도록 요청됨
          } else {
            EventBus.$emit('messageAlert', this.$t(result.responseMessage))
          }
        })
    },
    getServer () {
      const data = {}
      const params = {}
      params.company = this.$store.state.auth.user.company
      const config = {
        data: data,
        params: params
      }
      this.$utils
        .callAxios(
          this.requests.getServer.method,
          this.requests.getServer.url,
          config
        )
        .then((res) => {
          const result = res.data

          if (result.responseCode === '200') {
            this.host = result.host
            this.port = result.port
            this.auth = result.auth
            this.userName = result.userName
            this.password = result.password
            this.encoding = result.encoding
          }
        })
    },
    setServer () {
      if (this.host === '') {
        this.$refs.host.focus()
        EventBus.$emit('messageAlert', this.$t('Input the data'))
        return
      }
      if (this.port === '') {
        this.$refs.port.focus()
        EventBus.$emit('messageAlert', this.$t('Input the data'))
        return
      }
      if (this.userName === '') {
        this.$refs.userName.focus()
        EventBus.$emit('messageAlert', this.$t('Input the data'))
        return
      }
      if (this.password === '') {
        this.$refs.password.focus()
        EventBus.$emit('messageAlert', this.$t('Input the data'))
      }
      if (this.encoding === '') {
        this.$refs.encoding.focus()
        EventBus.$emit('messageAlert', this.$t('Input the data'))
      }
      if (this.auth === '') {
        this.$refs.auth.focus()
        EventBus.$emit('messageAlert', this.$t('Input the data'))
      }
      const data = {}
      const params = {}
      params.company = this.$store.state.auth.user.company
      data.host = this.host
      data.port = this.port
      data.userName = this.userName
      data.password = this.password
      data.encoding = this.encoding
      data.auth = this.auth
      const config = {
        params: params
      }
      this.$utils
        .callAxiosWithBody(
          this.requests.setServer.method,
          this.requests.setServer.url,
          data,
          config
        )
        .then((res) => {
          const result = res.data
          if (result.responseCode === '200') {
            EventBus.$emit('messageAlert', this.$t('Saved successfully'))
            // this.initServer()
          } else {
            EventBus.$emit('messageAlert', this.$t(result.responseMessage))
          }
        })
    },
    initServer () {
      this.host = ''
      this.port = ''
      this.userName = ''
      this.password = ''
      this.encoding = ''
      this.auth = ''
    }
  },
  mounted () {
    // 상단 공통 팝업 & 자동완성기능 사용유무
    EventBus.$emit('enableSelectedStores', false)

    //  Report Setting : Save
    this.$store.dispatch('auth/getDisabledBtn', '9200').then(flag => {
      this.buttonDisabled = flag
    })

    // //  Mail Setting : Save
    this.$store.dispatch('auth/getDisabledBtn', '9201').then(flag => {
      this.serverDisabled = flag
    })

    this.getReport()

    this.getServer()
  }
}
</script>

<style scoped>
  .settingBox{padding:50px; border:1px solid #b8b8b8;}
</style>
