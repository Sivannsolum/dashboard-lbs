<template>
  <div>
    <h2 class="page-title-bar"><i class="ico ico-system"></i>{{$t('System License')}}</h2>

    <h3 class="tit-group mt-10">{{$t('License Information')}}</h3>
    <v-row>
      <v-col>
        <v-text-field outlined dense hide-details
          :label="Lavel_Active"
          v-model="active"
          :readonly="true"
          class="form-input"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field outlined dense hide-details
          :label="Label_NumberOfStore"
          v-model="numberOfStore"
          :readonly="true"
          class="form-input"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field outlined dense hide-details
          :label="Label_ServerType"
          v-model="serverType"
          :readonly="true"
          class="form-input"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field outlined dense hide-details
          :label="Label_ActiveLayoutDesigner"
          v-model="activeLayoutDesigner"
          :readonly="true"
          class="form-input"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field outlined dense hide-details
          :label="Label_LicenseId"
          v-model="licenseId"
          :readonly="true"
          class="form-input"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field outlined dense hide-details
          :label="Label_ExpiryDate"
          v-model="expiryDate"
          :readonly="true"
          class="form-input"
        ></v-text-field>
      </v-col>
    </v-row>

    <h3 class="tit-group mt-10">{{$t('License Activate')}}</h3>
    <div class="licenseBox">
      <v-textarea outlined dense hide-details solo
        :placeholder="$t('Please enter the encoded license')"
        ref="encodedLicense"
        v-model="encodedLicense"
        height="200"
        class="form-input"
        clearable
      ></v-textarea>
      <v-btn :disabled="buttonDisabled" text class="btn ml-5" @click="setLicense()" height="200">{{$t('Activation')}}</v-btn>
    </div>
  </div>
</template>

<script>
import EventBus from '@/plugins/eventBus.js'
import commons from '@/plugins/commons'
export default {
  name: 'SystemLicense',
  data () {
    return {
      productionType: process.env.VUE_APP_PRODUCTION_TYPE,
      dialog: false,
      buttonDisabled: false,
      active: '',
      activeLayoutDesigner: '',
      numberOfStore: '',
      expiryDate: '',
      licenseId: '',
      serverType: '',
      paymentLicenseType: '',
      encodedLicense: '',
      requests: {
        getLicense: {
          method: 'get',
          url: '/api/common/license'
        },
        setlicense: {
          method: 'put',
          url: '/api/common/license'
        }
      }
    }
  },
  computed: {
    Lavel_Active () {
      return this.$t('Activate')
    },
    Label_NumberOfStore () {
      return this.$t('Number Of Store')
    },
    Label_ServerType () {
      return this.$t('Service Type')
    },
    Label_ActiveLayoutDesigner () {
      return this.$t('Active Layout Designer')
    },
    Label_LicenseId () {
      return this.$t('License ID')
    },
    Label_ExpiryDate () {
      return this.$t('Expire Date')
    }
  },
  methods: {
    getLicense () {
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
          this.requests.getLicense.method,
          this.requests.getLicense.url,
          config
        )
        .then((res) => {
          const result = res.data

          if (result.responseCode === '200') {
            this.active = result.active
            this.activeLayoutDesigner = result.activeLayoutDesigner
            this.numberOfStore = result.numberOfStore
            this.expiryDate = result.expiryDate
            this.licenseId = result.licenseId
            this.serverType = result.serverType
            this.paymentLicenseType = result.paymentLicenseType
          }
        })
    },
    setLicense () {
      if (!commons.isValidStr(this.encodedLicense)) {
        this.$refs.encodedLicense.focus()
        EventBus.$emit('messageAlert', this.$t('Please enter License Activate'))
        return
      }
      const data = {}
      const params = {}
      // params.company = this.$store.state.auth.user.company
      params.licenseId = this.licenseId
      params.encodedLicense = this.encodedLicense
      if (this.productionType === 'cloud') {
        params.company = this.$store.state.auth.user.company
      }
      const config = {
        params: params
      }
      this.$utils
        .callAxiosWithBody(
          this.requests.setlicense.method,
          this.requests.setlicense.url,
          data,
          config
        )
        .then((res) => {
          const result = res.data

          if (result.responseCode === '200') {
            EventBus.$emit('messageAlert', this.$t('Activated Successfully'))
            // License 성공 후 클리어
            this.encodedLicense = ''
            this.getLicense()
          } else {
            EventBus.$emit('messageAlert', this.$t(result.responseMessage))
          }
        })
    }
  },
  mounted () {
    //  Activation
    this.$store.dispatch('auth/getDisabledBtn', '9400').then(flag => {
      this.buttonDisabled = flag
    })

    // 상단 공통 팝업 & 자동완성기능 사용유무
    EventBus.$emit('enableSelectedStores', false)

    this.getLicense()
  }
}
</script>
