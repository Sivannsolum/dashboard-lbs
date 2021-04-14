<template>
  <v-dialog
    v-model="dialog_passwordChange"
    width="400"
    @click:outside="cancelPasswordChange"
  >
    <v-card class="popup add_store_popup">
    <h3 class="page-title-bar"><i class="ico ico-overview"></i>{{$t('Change Password')}}</h3>

    <v-row class="mt-5">
        <v-col>
        <p>Old Password *</p>
        <v-text-field
            v-model="passwordChangeData.oldPassword"
            type="password"
            class="form-input mt-1"
            outlined dense hide-details clearable solo
        ></v-text-field>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
        <p>{{$t('New Password')}} *</p>
        <v-text-field
            ref="newPassword"
            :value="passwordChangeData.newPassword"
            @keyup="handleNewPasswordKeyup"
            :rules="[rules.password]"
            type="password"
            class="form-input mt-1"
            outlined dense hide-details clearable solo
        ></v-text-field>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
        <p>{{$t('Confirm Password')}} *</p>
        <v-text-field
            ref="confirmPassword"
            v-model="passwordChangeData.confirmPassword"
            @keyup="handleConfirmPasswordKeyup"
            :rules="[rules.passwordConfirm]"
            type="password"
            class="form-input mt-1"
            outlined dense hide-details clearable solo
        ></v-text-field>
        </v-col>
    </v-row>

    <v-card-actions class="d-flex justify-center">
        <v-btn text icon @click="handleChangePasswordBtn" class="btn">Change</v-btn>
        <v-btn text icon @click="cancelPasswordChange" class="btn">{{$t('Close')}}</v-btn>
    </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import EventBus from '@/plugins/eventBus.js'
import commons from '@/plugins/commons'
import { getPasswordValidation } from '@/plugins/passwordValidator'
import codes from '@/plugins/codes'

export default {
  name: 'LoginPasswordChange',
  props: {
    account: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      user: null,
      dialog_passwordChange: false,
      passwordExpired: false,
      passwordChangeData: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        password: value => this.passwordChangeData.confirmPassword === value || 'Passwords do not match.',
        passwordConfirm: value => this.passwordChangeData.newPassword === value || 'Passwords do not match.'
      }
    }
  },
  mounted () {
    this.user = this.$store.state.auth.user
    EventBus.$on('showLoginPasswordChange', () => {
      this.dialog_passwordChange = true
    })
  },
  destroyed () {},
  methods: {
    getCompany () {
      const config = { params: { } }
      return this.$utils
        .callAxios(
          codes.requests.getAreas.method,
          codes.requests.getAreas.url,
          config
        )
        .then(res => {
          return res.data.areaParamList.pop().company
        })
    },
    async updatePassword () {
      const body = {
        account: this.account, // account is a prop from the Login.vue component.
        oldPassword: this.passwordChangeData.oldPassword,
        newPassword: this.passwordChangeData.newPassword
      }
      // const company = await this.getCompany()
      // const company = ''
      // const config = { params: { company: company } }

      const config = { params: { } }
      const isValidData = commons.isValidData(body)
      if (!isValidData.result) {
        this.$emit('messageAlert', this.$t(isValidData.msg))
        return
      }
      const passwordValidation = getPasswordValidation(body.account, body.newPassword, { pwMinimumLength: 8, pwPolicyEnable: 'true' })
      if (!passwordValidation.result) {
        this.$emit('messageAlert', this.$t(passwordValidation.msg))
        return
      }
      this.$utils
        .callAxiosWithBody(
          codes.requests.updatePassword.method,
          codes.requests.updatePassword.url,
          body,
          config
        )
        .then(res => {
          this.$emit('messageAlert', this.$t('Your password has been successfully updated'))
          this.cancelPasswordChange()
        })
        .catch(error => {
          this.$emit('messageAlert', this.$t('Failed to update the password.'))
          console.log(error)
        })
    },
    handleChangePasswordBtn () {
      this.updatePassword()
    },
    handleNewPasswordKeyup (e) {
      const val = e.target.value
      this.passwordChangeData.newPassword = val.trim()
      this.$refs.confirmPassword.validate()
    },
    handleConfirmPasswordKeyup (e) {
      const val = e.target.value
      this.passwordChangeData.confirmPassword = val.trim()
      this.$refs.newPassword.validate()
    },
    cancelPasswordChange () {
      this.dialog_passwordChange = false
      this.passwordChangeData = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
      this.$emit('hideChangePasswordBtn')
    }
  }
}
</script>

<style scoped>
    .btn-activation{display:block;width:150px; height:40px !important; margin:8px auto 0; background:#e27070 !important; color:#fff; border-radius:5px; font-size:var(--font16);}
</style>
