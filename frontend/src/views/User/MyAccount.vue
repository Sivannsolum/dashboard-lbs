<template>
  <div>
    <h2 class="page-title-bar"><i class="ico ico-user"></i>{{ $t('My Info') }}</h2>
    <div class="myInfo mt-10">
      <v-row>
        <v-col cols="6">
          <v-text-field
            :value="accountId"
            :label="Label_Id"
            :placeholder="$t('Input the ID')"
            class="form-input"
            clearable
            outlined dense hide-details disabled
          ></v-text-field>
        </v-col>
      </v-row>
      <v-form ref="password">
        <v-row>
          <v-col>
            <v-text-field
              ref="thePassword"
              v-model="password1"
              @keyup="handleThePassword"
              :rules="[rules.password1]"
              :label="Label_Password"
              :placeholder="$t('Input the password')"
              type="password"
              class="form-input"
              clearable
              outlined dense hide-details
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              ref="passwordConfirm"
              v-model="password2"
              @keyup="handleConfirmPassword"
              :rules="[rules.password2]"
              :label="Label_Password2"
              :placeholder="$t('Input the password')"
              type="password"
              class="form-input"
              clearable
              outlined dense hide-details
            ></v-text-field>
          </v-col>
        </v-row>
        <!--
      <v-row>
        <v-col>
          <v-select outlined dense hide-details
            label="Security Question 1 *"
            placeholder="Select the question"
            :items="['question1', 'question2']"
            class="form-select"
          ></v-select>
          <v-text-field outlined dense hide-details solo
            placeholder="Input the answer"
            class="form-input mt-2"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-select outlined dense hide-details
            label="Security Question 2 *"
            placeholder="Select the question"
            :items="['question1', 'question2']"
            class="form-select"
          ></v-select>
          <v-text-field outlined dense hide-details solo
            placeholder="Input the answer"
            class="form-input mt-2"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-select outlined dense hide-details
            label="Security Question 3 *"
            placeholder="Select the question"
            :items="['question1', 'question2']"
            class="form-select"
          ></v-select>
          <v-text-field outlined dense hide-details solo
            placeholder="Input the answer"
            class="form-input mt-2"
          ></v-text-field>
        </v-col>
      </v-row>
      -->
      <v-row>
        <v-col cols="6">
          <v-text-field outlined dense hide-details
            v-model="formData['firstName']"
            :label="Label_Name"
            :placeholder="$t('Input the name')"
            class="form-input"
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
      <!-- 삭제
      <v-row>
        <v-col cols="6">
          <v-text-field outlined dense hide-details
            label="Phone Number"
            placeholder="Input the phone number"
            class="form-input"
            v-model="formData['phoneNumber']"
          ></v-text-field>
        </v-col>
      </v-row>
       -->
      <v-row>
        <v-col cols="6">
          <v-text-field
            ref="email"
            v-model="formData['emailAddress']"
            @input="handleEmailChange"
            @keyup="handleEmailChange(formData['emailAddress'])"
            class="form-input"
            :rules="[rules.email]"
            :label="Label_Email"
            :placeholder="$t('Input the email address')"
            clearable
            outlined dense hide-details
          ></v-text-field>
          <v-switch
            v-model="formData['emailAlarm']"
            :label="Label_Alarm"
            class="form-switch"
            style="display: none;"
            inset hide-details
          ></v-switch>
          <v-switch
            v-model="formData['emailReport']"
            @change="handleEmailReportChange"
            :label="Label_Report"
            class="form-switch"
            inset hide-details
          ></v-switch>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <p class="label-txt">{{ $t('My Store' )}}</p>
          <div class="listBox mt-2">
            <ul :key="index" v-for="(store, index) in formData['managedStores']">
              <li v-text="`${store.name} (store code: ${store.code})` "></li>
            </ul>
          </div>
        </v-col>
        <v-col>
          <p class="label-txt">{{ $t('My Level') }}</p>
          <div class="listBox mt-2">
            <ul>
              <li v-text="`${formData['title']}(${formData['accessLevel']})`"></li>
            </ul>
          </div>
        </v-col>
      </v-row>
      </v-form>
    </div>
    <!-- Button group -->
    <div class="table-options">
      <div>
        <v-btn
          @click="updateUserInfo"
          class="btn"
          text
        >{{ $t('Save') }}
        </v-btn>
        <v-dialog
          v-model="passwordEditDialog"
          @click:outside="cancelPasswordEdit"
          width="400"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              class="btn ml-2"
              text
            >{{ $t('Change Password') }}</v-btn>
          </template>
          <v-card class="popup add_store_popup">
            <h3 class="page-title-bar"><i class="ico ico-user"></i>{{ $t('Change Password') }}</h3>
            <v-form
              ref="form"
            >
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="oldPassword"
                    :label="`${$t('Current Password')} *`"
                    class="form-input"
                    :placeholder="$t('Input the current password')"
                    type="password"
                    outlined dense hide-details
                    clearable
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    ref="newPassword1"
                    v-model="newPassword1"
                    @keyup="handleNewPassword1Keyup"
                    :rules="[rules.newPassword1]"
                    :label="`${$t('New Password')} *`"
                    class="form-input"
                    :placeholder="$t('Input the new password')"
                    type="password"
                    outlined dense hide-details
                    clearable
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    ref="newPassword2"
                    v-model="newPassword2"
                    @keyup="handleNewPassword2Keyup"
                    :rules="[rules.newPassword2]"
                    :label="`${$t('Verify Password')} *`"
                    class="form-input"
                    :placeholder="$t('Input the new password')"
                    type="password"
                    outlined dense hide-details
                    clearable
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
            <v-card-actions class="d-flex justify-center">
              <v-btn @click="handlePasswordEditClick" text icon class="btn">{{ $t('Save') }}</v-btn>
              <v-btn @click="cancelPasswordEdit" text icon class="btn">{{ $t('Cancel') }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
import { getPasswordValidation, getEmailValidation } from '@/plugins/passwordValidator'

export default {
  name: 'MyAccount',
  data () {
    return {
      passwordEditDialog: false,
      user: null,
      accountId: '',
      company: '',
      formData: {
        accessLevel: null,
        title: null,
        managedStores: null,
        emailReport: null,
        emailAlarm: null,
        emailAddress: null,
        firstName: null
      },
      oldPassword: '',
      password1: '',
      password2: '',
      newPassword1: '',
      newPassword2: '',

      successDialog: false,
      message: '',

      rules: {
        password1: value => (value && value !== undefined) || 'not matching password',
        password2: value => (value && value !== undefined && value === this.password1) || 'not matching password',
        newPassword1: value => (value && value !== undefined) || 'not matching password',
        newPassword2: value => (value && value !== undefined && value === this.newPassword1) || 'not matching password',
        passwordRegex: value => {
          const pattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/
          return (
            pattern.test(value) ||
            'Min. 8 characters with at least one capital letter, a number and a special character.'
          )
        },
        passwordConfirm: value => this.newPassword1.trim() === this.newPassword2.trim() || 'not matching password',
        email: value => {
          if (commons.isNull(value)) return true
          const pattern = /^$|^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
          return (
            pattern.test(value) || 'Not a valid Email'
          )
        }
      },
      userInfoDisabled: false
    }
  },
  computed: {
    msg () {
      return {
        inputEmail: this.$t('Please enter the email to receive the report.')
      }
    },
    Label_Id () { return this.$t('ID') },
    Label_Password () { return this.$t('Password') },
    Label_Password2 () { return this.$t('Confirm Password') },
    Label_Name () { return this.$t('Name') },
    Label_Email () { return this.$t('Email') },
    Label_Alarm () { return this.$t('Alarm with email') },
    Label_Report () { return this.$t('Report with email') }
  },
  methods: {
    handleThePassword () {
      this.$refs.passwordConfirm.validate()
    },
    handleConfirmPassword () {
      this.$refs.thePassword.validate()
    },
    handleNewPassword1Keyup () {
      this.$refs.newPassword2.validate()
    },
    handleNewPassword2Keyup () {
      this.$refs.newPassword1.validate()
    },
    handleEmailChange (val) {
      if (!commons.isValidStr(val)) this.formData.emailReport = false
    },
    handleEmailReportChange (e) {
      if (!e) return
      if (
        !commons.isValidStr(this.formData.emailAddress) ||
        !this.$refs.email.validate()
      ) {
        this.successDialog = true
        this.message = this.msg.inputEmail
        this.$nextTick(() => {
          this.formData.emailReport = false
        })
      }
    },
    buildParams () {
      const params = {
        account: this.accountId,
        company: this.$store.state.auth.user.company
      }
      return params
    },
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
          this.formData = Object.assign(this.formData, data)
          this.password = data.password
          this.$refs.password.resetValidation()
        })
    },
    updateUserInfo () {
      const formData = commons.copy(this.formData)
      let invalidData = null
      if (!this.$refs.thePassword.validate() || !this.$refs.passwordConfirm.validate()) invalidData = 'Password'

      if (invalidData !== null) {
        // 빈 칸 검사 (email은 필수가 아니므로 제외)
        this.successDialog = true
        this.message = this.$t(`The ${invalidData} is incorrect. Try again.`)
        return
      } else {
        // 빈 칸 없는경우 유효성 검사.
        if (!commons.isNull(formData.emailAddress)) {
          // 이메일 입력된 경우 유효성 검사.
          const emailValidation = getEmailValidation(formData.emailAddress)
          if (!emailValidation.result) {
            this.successDialog = true
            this.message = this.$t(emailValidation.msg)
            return
          }
        }
      }

      const config = {
        params: {
          company: this.$store.state.auth.user.company,
          myAccessLevel: this.formData.accessLevel
        }
      }
      if (commons.isNull(formData.emailAddress)) formData.emailAddress = ''
      const accountData = {
        account: formData.account,
        password: this.password1,
        firstName: formData.firstName,
        emailAddress: formData.emailAddress,
        emailReport: formData.emailReport
      }
      this.$utils.callAxiosWithBody(
        codes.requests.updateUserInfo.method,
        codes.requests.updateUserInfo.url,
        accountData,
        config
      )
        .then(() => {
          this.message = this.$t('The user information has been updated successfully')
          this.$refs.password.reset()
          this.getUserInfo()
        })
        .catch(error => {
          this.message = this.$t(error.response.data.responseMessage)
        })
        .finally(() => {
          this.successDialog = true
        })
    },
    updatePassword: function () {
      this.dialog = false
      const body = {
        account: this.accountId,
        oldPassword: this.oldPassword,
        newPassword: this.newPassword2
      }
      const config = {
        params: {
          company: this.$store.state.auth.user.company
        }
      }
      this.$utils.callAxiosWithBody('put', codes.requests.updatePassword.url, body, config)
        .then(res => {
          this.successDialog = true
          this.message = this.$t('Your password has been successfully updated')
          this.password = this.newPassword1
          this.formData.password = this.newPassword1
          this.cancelPasswordEdit()
        })
        .catch(error => {
          this.successDialog = true
          this.message = this.$t('Failed to update your password.')
          this.cancelPasswordEdit()
          console.debug(error)
        })
    },
    cancelPasswordEdit () {
      this.resetPasswordEdit()
      this.passwordEditDialog = false
    },
    resetPasswordEdit () {
      this.oldPassword = ''
      this.newPassword1 = ''
      this.newPassword2 = ''
    },
    handlePasswordEditClick () {
      const passwordValidation = getPasswordValidation(this.accountId, this.newPassword2, this.user)
      if (this.newPassword1 !== this.newPassword2) {
        passwordValidation.result = false
        passwordValidation.msg = 'The password is incorrect. Try again'
      }
      if (passwordValidation.result) {
        this.updatePassword()
      } else {
        this.successDialog = true
        this.message = this.$t(passwordValidation.msg)
      }
    }
  },
  mounted () {
    this.accountId = this.$store.state.auth.user.account
    this.company = this.$store.state.auth.user.company

    // 상단 공통 팝업 & 자동완성기능 사용유무
    EventBus.$emit('enableSelectedStores', false)

    this.getUserInfo()
    this.user = this.$store.state.auth.user
    this.$store.dispatch('auth/isAccessMenu', '8100').then((flag) => {
      this.userInfoDisabled = flag
    })
  }
}
</script>
