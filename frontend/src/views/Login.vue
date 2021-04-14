<template>
  <div class="login d-flex">
    <div class="bg"></div>
    <div class="loginBox d-flex justify-center align-center">
      <v-card class="loginForm" flat>
        <v-card-title class="login-tit justify-center">{{
          $t('ESL DASHBOARD')
        }}</v-card-title>
        <v-card-subtitle class="login-txt mt-1">{{
          $t('Welcome back! Please login to your account.')
        }}</v-card-subtitle>
        <v-card-text class="mt-7">
          <v-form>
            <v-select
              v-model="loginMode"
              :hint="`${loginMode.code}, ${loginMode.name}`"
              :items="loginModeItems"
              :class="cloudMode ? 'hidden' : null"
              item-text="name"
              item-value="code"
              return-object
              class="form-select"
              outlined
              dense
              solo
            ></v-select>
            <v-text-field
              ref="account"
              v-model="user.account"
              :class="cloudMode ? 'hidden' : null"
              class="form-login"
              :label="$t('ID')"
              clearable
            />
            <v-text-field
              ref="password"
              v-model="user.password"
              @keyup.enter="onLogin"
              :label="$t('Password')"
              :class="cloudMode ? 'hidden' : null"
              class="form-login"
              type="password"
              clearable
            />
            <v-text-field
              v-show="domainInputShow"
              v-model="user.domain"
              label="Domain"
              class="form-login"
              clearable
            />
            <div class="d-flex justify-space-between align-center">
              <v-checkbox
                v-model="staySignedIn"
                :label="$t('Stay Signed In')"
                :class="cloudMode ? 'hidden' : null"
                class="form-checkbox _login"
                hide-details
              ></v-checkbox>
              <v-dialog v-model="dialog" width="500">
                <template v-if="false" v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" text class="link">{{
                    $t('Forgot Password?')
                  }}</v-btn>
                </template>
                <v-card class="popup add_store_popup">
                  <h3 class="page-title-bar">
                    <i class="ico ico-overview"></i>{{ $t('Reset Password') }}
                  </h3>
                  <p class="guide_txt">
                    {{
                      $t(
                        'Answer the following questions to reset your password'
                      )
                    }}.
                  </p>
                  <v-row class="mt-5">
                    <v-col>
                      <p>{{ $t('Security Question 1') }} *</p>
                      <v-text-field
                        outlined
                        dense
                        hide-details
                        clearable
                        label="What was the name of your first pet?"
                        class="form-input"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <p>{{ $t('Security Question 2') }} *</p>
                      <v-text-field
                        outlined
                        dense
                        hide-details
                        clearable
                        label="What is your father’s name?"
                        class="form-input"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <p>{{ $t('Security Question 3') }} *</p>
                      <v-text-field
                        class="form-input"
                        label="What is your dream job?"
                        outlined
                        dense
                        hide-details
                        clearable
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-card-actions class="d-flex justify-center">
                    <v-btn @click="dialog = false" text icon class="btn">{{
                      $t('Submit')
                    }}</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </v-form>
        </v-card-text>
        <p v-if="licenseExpired" class="txt-activation">
          <img src="@/assets/img/loginerror.png" alt="" />
          {{ $t('License has expired. Please activate license.') }}
        </p>
        <v-btn
          v-if="licenseExpired"
          @click="showLoginLicenseActivation"
          class="btn-activation"
          text
          >{{ $t('License Activation') }}
        </v-btn>
        <license-activation
          :license-expired="licenseExpired"
          @messageAlert="messageAlert"
          @hideActivateLicenseBtn="hideActivateLicenseBtn"
        />
        <p v-show="passwordExpired" class="txt-activation">
          <img src="@/assets/img/loginerror.png" alt="" />
          {{ $t("User's password has expired.") }}
        </p>
        <v-btn
          v-if="passwordExpired"
          @click="showLoginPasswordChange"
          class="btn-activation"
          >{{ $t('Change Password') }}</v-btn
        >
        <password-change
          :account="passwordExpiredAccount"
          :passwordexpired="passwordExpired"
          @messageAlert="messageAlert"
          @hideChangePasswordBtn="hideChangePasswordBtn"
        />
        <v-btn
          @click="onLogin"
          :class="cloudMode ? 'hidden' : null"
          class="btn-login"
        >
          {{ $t('Login') }}
        </v-btn>
      </v-card>
      <p class="copyright">
        <img src="@/assets/img/logo-login.jpg" alt="solum" /><br />@2020 SOLUM
        Proprietary and Confidential
      </p>
    </div>
    <!--Message Box-->
    <div>
      <v-dialog v-model="messageDialog" width="300">
        <v-card class="popup add_store_popup" align="center" justify="center">
          <v-row align="center">
            <v-col>
              <span v-text="messageText"></span>
            </v-col>
          </v-row>
          <v-card-actions class="d-flex justify-center">
            <v-btn text icon @click="messageDialog = false" class="btn">{{
              $t('OK')
            }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
// Cloud
import User from '@/models/user'
import { signIn, cloudLogout } from '@/adLogin/authPopup'
// Utils
import EventBus from '@/plugins/eventBus'
import commons from '@/plugins/commons'
import codes from '@/plugins/codes'
// Components
import LicenseActivation from '@/views/LoginLicenseActivation'
import PasswordChange from '@/views/LoginPasswordChange'

export default {
  name: 'Login',
  components: {
    LicenseActivation,
    PasswordChange
  },
  data () {
    return {
      cloudMode: false,
      productionType: process.env.VUE_APP_PRODUCTION_TYPE,
      dialog: false,
      messageDialog: false,
      messageText: '',
      serverLoginForm: true,
      loginModeItems: [
        { code: 'local', name: this.$t('Local Mode Login') },
        { code: 'domain', name: this.$t('Domain Mode Login') }
      ],
      loginMode: { code: 'local', name: 'Local Mode Login' },
      domainInputShow: false,
      user: new User('', ''),
      licenseExpired: false,
      passwordExpired: false,
      passwordExpiredAccount: '',
      staySignedIn: false
    }
  },
  watch: {
    loginMode (val) {
      if (this.loginMode.code === 'domain') {
        this.domainInputShow = true
      } else {
        this.domainInputShow = false
      }
    }
  },
  created () {
    commons.clearVuex()
  },
  mounted () {
    if (this.productionType === 'cloud') {
      this.cloudMode = true
      signIn(this.user).then(async account => {
        this.user.account = account
        await this.onLogin()
      })
    }
  },
  methods: {
    messageAlert (text) {
      this.messageText = text
      this.messageDialog = true
    },
    onLogin () {
      if (commons.isNull(this.user.account)) {
        this.$refs.account.$el.getElementsByTagName('input')[0].focus()
        return
      }
      if (commons.isNull(this.user.password)) {
        this.$refs.password.$el.getElementsByTagName('input')[0].focus()
        return
      }
      this.user.loginMode = this.loginMode.code
      this.$store
        .dispatch('auth/login', this.user)
        .then(res => {
          console.log(res)
          this.$store.dispatch(
            'dataStore/updateStaySignedIn',
            this.staySignedIn
          )
          this.$store.dispatch('dataStore/INIT_SELECTED_STORE', this.$store)
          this.$router.push('/')
        })
        .catch(error => {
          this.loading = false
          this.messageText = error.responseMessage || 'Failed to login'
          this.messageDialog = true
          switch (error.responseCode) {
            case '401':
              if (error.responseMessage === codes.errors.passwordExpired.msg) {
                this.passwordExpiredAccount = this.user.account
                this.passwordExpired = true
              }
              break
            case '402':
              this.licenseExpired = true
              break
            default:
              if (this.productionType === 'cloud') {
                setTimeout(
                  cloudLogout => {
                    // alert 메세지 때문에 2초 딜레이
                    cloudLogout()
                  },
                  2000,
                  cloudLogout
                )
              }
              break
          }
        })
    },
    hideActivateLicenseBtn () {
      this.licenseExpired = false
    },
    hideChangePasswordBtn () {
      this.passwordExpired = false
    },
    showLoginLicenseActivation () {
      EventBus.$emit('showLoginLicenseActivation')
    },
    showLoginPasswordChange () {
      EventBus.$emit('showLoginPasswordChange')
    }
  }
}
</script>

<style scoped>
.hidden {
  display: none !important;
}
.login {
  height: 100%;
}
.login .bg {
  width: 50%;
  background: url(../assets/img/bg-login.jpg) no-repeat center center / cover;
}
.login .loginBox {
  position: relative;
  width: 50%;
}
.login .loginBox .loginForm {
  width: auto;
}
.login .loginBox .loginForm .login-tit {
  font-size: var(--font40);
  font-weight: 700;
  color: #001e38;
  letter-spacing: 0.18em;
}
.login .loginBox .loginForm .login-txt {
  font-size: var(--font20);
  color: #4d4f5c;
}
.v-btn.link {
  padding: 0;
  font-size: var(--font18);
  color: #43425d;
  text-transform: none;
  letter-spacing: 0;
}
.form-login {
  font-size: var(--font20);
}
.form-login .v-label {
  font-size: var(--font20) !important;
}
.btn-login {
  display: block;
  width: 150px;
  height: 40px !important;
  margin: 8px auto 0;
  background: #001e38 !important;
  color: #fff;
  border-radius: 5px;
  font-size: var(--font16);
}
.btn-activation {
  display: block;
  width: 150px;
  height: 40px !important;
  margin: 8px auto 0;
  background: #e27070 !important;
  color: #fff;
  border-radius: 5px;
  font-size: var(--font16);
}
.txt-activation {
  margin: 10px 0 20px;
  color: #e27070;
  font-size: var(--font18);
  text-align: center;
}
.copyright {
  position: absolute;
  bottom: 5vh;
  left: 0;
  width: 100%;
  margin-bottom: 0;
  text-align: center;
  font-size: var(--font11);
  color: #43425d;
}
.copyright img {
  margin-bottom: 5px;
}
.guide_txt {
  font-size: var(--font22);
  font-weight: 700;
}
</style>
