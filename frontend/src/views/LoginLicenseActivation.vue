<template>
    <v-dialog
        v-model="dialog_activation"
        width="600"
        @click:outside="cancelLicenseActivation"
    >
        <v-card class="popup add_store_popup">
        <h3 class="page-title-bar"><i class="ico ico-overview"></i>License Activation</h3>

        <table class="form-activation">
            <colgroup>
            <col style="width:25%">
            <col>
            </colgroup>
            <tr>
            <th>ACTIVE</th>
            <td>{{ license.active }}</td>
            </tr>
            <tr>
            <th>LICENSE ID</th>
            <td>{{ license.licenseId }}</td>
            </tr>
            <tr>
            <th>EXPIRY DATE</th>
            <td>{{ license.expiryDate }}</td>
            </tr>
            <tr>
            <th>ACTIVATE</th>
            <td>
                <textarea :value="licenseData.encodedLicense" @keyup="handleEncodedLicenseKeyup" rows="5" placeholder="Please enter the encoded license."></textarea>
            </td>
            </tr>
        </table>
        <v-card-actions class="d-flex justify-center">
            <v-btn text icon @click="handleLicenseActivateClick" class="btn">{{$t('Activation')}}</v-btn>
            <v-btn text icon @click="cancelLicenseActivation" class="btn">{{$t('Close')}}</v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import EventBus from '@/plugins/eventBus.js'
import commons from '@/plugins/commons'

const requests = {
  getLicense: {
    method: 'get',
    url: '/api/common/license'
  },
  activateLicense: {
    method: 'put',
    url: '/api/common/license'
  }
}

export default {
  props: {
    licenseExpired: {
      type: Boolean,
      required: true
    }
  },
  name: 'LoginLicenseActivation',
  data () {
    return {
      dialog_activation: false,
      license: {},
      licenseData: {
        encodedLicense: ''
      }
    }
  },
  mounted () {
    EventBus.$on('showLoginLicenseActivation', () => {
      this.dialog_activation = true
      this.getLicense()
    })
  },
  computed: {

  },
  methods: {
    removeInvalidValues (obj) {
      for (const key of Object.keys(obj)) {
        if (obj[key] === null || obj[key] === undefined) {
          obj[key] = ''
        }
      }
      return obj
    },
    getLicense () {
      this.$utils
        .callAxios(
          requests.getLicense.method,
          requests.getLicense.url,
          {}
        )
        .then(res => {
          this.license = this.removeInvalidValues(res.data)
        })
        .catch(error => console.log(`Failed to get the product's license information. Error: ${error}`))
    },
    handleLicenseActivationClick () { this.getLicense() },
    // Fires when a user hit the "Activate a license" button.
    handleLicenseActivateClick () {
      const isValidData = commons.isValidData(this.licenseData)
      if (!isValidData.result) {
        this.$emit('messageAlert', this.$t(isValidData.msg))
        return
      }
      const params = {
        encodedLicense: this.licenseData.encodedLicense,
        licenseId: 1
      }
      const config = { params }
      this.$utils
        .callAxiosWithBody(
          requests.activateLicense.method,
          requests.activateLicense.url,
          {},
          config
        )
        .then(res => {
          this.$emit('messageAlert', this.$t(res.data.responseMessage))
          // License 성공 후 클리어
          this.licenseData.encodedLicense = ''
          this.getLicense()
          this.cancelLicenseActivation()
        })
        .catch(error => {
          this.$emit('messageAlert', this.$t('Failed to activate the license.'))
          console.log(error)
        })
    },
    cancelLicenseActivation () {
      this.dialog_activation = false
      this.licenseData.encodedLicense = ''
      this.$emit('hideActivateLicenseBtn')
    },
    handleEncodedLicenseKeyup (e) {
      this.licenseData.encodedLicense = e.target.value
    }
  }
}
</script>

<style scoped>
  .btn-activation{display:block;width:150px; height:40px !important; margin:8px auto 0; background:#e27070 !important; color:#fff; border-radius:5px; font-size:var(--font16);}
  .txt-activation{margin:10px 0 20px; color:#e27070; font-size:var(--font18); text-align:center;}
  .form-activation{width:100%;}
  .form-activation th{padding:8px 0; text-align:left; font-size:var(--font18); color:#a3a6b4; vertical-align: top;}
  .form-activation td{padding:8px 0; font-size:var(--font18); color:#5a5a5a;}
  .form-activation textarea{width:100%; padding:10px; border:1px solid #001e38; border-radius:5px; font-size:var(--font18); resize:none;}
</style>
