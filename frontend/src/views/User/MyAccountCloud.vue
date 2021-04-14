<template>
  <div>
    <h2 class="page-title-bar"><i class="ico ico-user"></i>{{ $t('My Info') }}</h2>
    <div class="myInfo mt-10">
      <v-form ref="password">
        <div class="box">
          <h3 class="page-sub-title">{{$t('Info')}}</h3>
          <table class="tbl-data mt-3">
            <colgroup>
              <col style="width:110px">
              <col>
            </colgroup>
            <tr>
              <th>Email</th>
              <td>{{formData['emailAddress']}}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{{formData['firstName']}}</td>
            </tr>
          </table>
        </div>

        <div class="box">
          <h3 class="page-sub-title">{{ $t('Alarm &amp; Report' )}}</h3>
          <div class="d-flex">
            <v-switch
            v-model="formData['emailAlarm']"
            :label="Label_Alarm"
            class="form-switch"
            inset hide-details
          ></v-switch>
          <v-switch
            v-model="formData['emailReport']"
            :label="Label_Report"
            class="form-switch ml-16"
            inset hide-details
          ></v-switch>
          </div>
        </div>

        <div class="box d-flex-between">
          <div class="column">
            <h3 class="page-sub-title">{{ $t('My Store' )}}</h3>
            <div class="listBox mt-2">
              <ul :key="index" v-for="(store, index) in formData['managedStores']">
                <li v-text="`${store.name} (store code: ${store.code})` "></li>
              </ul>
            </div>
          </div>
          <div class="column">
            <h3 class="page-sub-title">{{ $t('My Level') }}</h3>
            <div class="listBox mt-2">
              <ul>
                <li v-text="`${formData['title']}(${formData['accessLevel']})`"></li>
              </ul>
            </div>
          </div>
        </div>
      </v-form>
    </div>
    <!-- Button group -->
    <div class="table-options">
      <div>
        <v-btn
          @click="updateUserInfo"
          class="btn-sm"
          text
        >{{ $t('Save') }}
        </v-btn>
        <!-- 추후 적용 패쓰워드 변경 URL 정의시 적용
        <v-btn
          @click="updateUserPasswordPopup"
          class="btn-ms ml-3"
          text
        >{{ $t('Change Password') }}
        </v-btn>
        -->
      </div>
    </div>

    <div>
      <v-dialog
        v-model="successDialog"
        width="300">
        <v-card class="popup add_store_popup">
          <v-row>
            <v-col>
              <span v-text="message"></span>
            </v-col>
          </v-row>
          <v-card-actions class="d-flex justify-center">
            <v-btn @click="successDialog = false" class="btn" text icon >OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import EventBus from '@/plugins/eventBus.js'
import commons from '@/plugins/commons'
import codes from '@/plugins/codes'

export default {
  name: 'MyAccount',
  data () {
    return {
      user: null,
      accountId: '',
      company: '',

      formData: {},

      successDialog: false,
      message: '',

      rules: {
        email: value => {
          if (commons.isNull(value)) return true
          const pattern = /^$|^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
          return (
            pattern.test(value) || 'Not a valid Email'
          )
        }
      }
    }
  },
  computed: {
    msg () {
      return {
        inputEmail: this.$t('Please enter the email to receive the report.')
      }
    },
    Label_Id () { return this.$t('ID') },
    Label_Name () { return this.$t('Name') },
    Label_Email () { return this.$t('Email') },
    Label_Alarm () { return this.$t('Alarm with email') },
    Label_Report () { return this.$t('Report with email') }
  },
  methods: {
    getUserInfo () {
      const config = {
        params: {
          account: this.accountId,
          company: this.$store.state.auth.user.company
        }
      }
      this.$utils
        .callAxios(
          codes.requests.getUser.method,
          codes.requests.getUser.url,
          config
        )
        .then(({ data }) => {
          this.formData = data
          this.formData.firstName = this.$store.state.auth.tokenAPI.account.idToken.name
          this.formData.emailAddress = this.$store.state.auth.tokenAPI.account.idToken.emails[0]
          this.password = data.password
          this.$refs.password.resetValidation()
        })
    },
    updateUserInfo () {
      const formData = commons.copy(this.formData)
      const config = {
        params: {
          company: this.$store.state.auth.user.company,
          myAccessLevel: this.formData.accessLevel
        }
      }
      const accountData = {
        account: formData.account,
        emailReport: formData.emailReport,
        emailAlarm: formData.emailAlarm
      }
      this.$utils.callAxiosWithBody(
        codes.requests.updateUserInfoCloud.method,
        codes.requests.updateUserInfoCloud.url,
        accountData,
        config
      )
        .then(() => {
          this.message = this.$t('The user information has been updated successfully')
          this.getUserInfo()
        })
        .catch(error => {
          this.message = this.$t(error.response.data.responseMessage)
        })
        .finally(() => {
          this.successDialog = true
        })
    },
    updateUserPasswordPopup () {
      /* const url ='https://solumb2c.b2clogin.com/solumb2c.onmicrosoft.com/b2c_1_passwordreset1/oauth2/v2.0/authorize?
      response_type=id_token
      &scope=openid%20profile
      &client_id=e08e54ff-5bb1-4ae7-afde-b9cdc8fa23ae
      &redirect_uri=https%3A%2F%2Fdc-00-01.dtonic.io%3A9444%2Flogin
      &state=eyJpZCI6ImU2ZmI1ZjU1LThhZmItNDhhMC04MDhlLTZjNzg5ZjdjMTRhZiIsInRzIjoxNjExMDI5NDc0LCJtZXRob2QiOiJwb3B1cEludGVyYWN0aW9uIn0%3D
      &nonce=f3dec9b3-79cf-4ad4-b6ed-0c6d818e3d32&client_info=1&x-client-SKU=MSAL.JS&x-client-Ver=1.4.3
      &client-request-id=f8e45bab-aff1-4a13-86a3-c6303b12819a
      &response_mode=fragment' */
    }
  },
  mounted () {
    this.accountId = this.$store.state.auth.user.account
    this.company = this.$store.state.auth.user.company
    // 상단 공통 팝업 & 자동완성기능 사용유무
    EventBus.$emit('enableSelectedStores', false)
    this.getUserInfo()
    this.user = this.$store.state.auth.user
  }
}
</script>
