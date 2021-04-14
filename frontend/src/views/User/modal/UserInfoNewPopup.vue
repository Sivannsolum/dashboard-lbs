<template>
  <v-dialog
    v-model="dialog"
    width="700"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn text v-bind="attrs" v-on="on" :disabled="btnDisabledNewDelete" class="btn">{{$t('New')}}</v-btn>
    </template>
    <v-card class="popup add_store_popup">
      <h3 class="page-title-bar"><i class="ico ico-user"></i>{{$t('New User')}}</h3>
      <div>
        <v-row>
          <v-col>
            <v-text-field outlined dense hide-details
              :label="`${$t('ID')} *`"
              :placeholder="$t('Input the ID')"
              class="form-input"
              v-model="account"
              clearable
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field outlined dense hide-details
              :label="`${$t('Password')} *`"
              :placeholder="$t('Input the password')"
              type="password"
              class="form-input"
              v-model="password"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <p class="label-txt">{{$t('User Level')}} *</p>
            <v-radio-group
              v-model="accessLevel"
              dense
              hide-details
              row>
              <div v-for="item in accessLevelItems" v-bind:key="item.level">
                <v-radio
                  v-if="item.level === '1'"
                  :key="item.level"
                  :label="item.name"
                  :value="item.level"
                  class="form-radio flat"
                  disabled
                ></v-radio>
                <v-radio
                  v-else-if="userAccessLevel > item.level"
                  :key="item.level"
                  :label="item.name"
                  :value="item.level"
                  class="form-radio flat"
                  disabled
                ></v-radio>
                <v-radio
                  v-else-if="userAccessLevel <= item.level"
                  :key="item.level"
                  :label="item.name"
                  :value="item.level"
                  class="form-radio flat"
                ></v-radio>
              </div>
            </v-radio-group>
          </v-col>
        </v-row>
      </div>
      <div>
        <v-row>
          <v-col cols="6">
            <v-text-field outlined dense hide-details
              :label="`${$t('Name')} *`"
              :placeholder="`${$t('Input the name')}`"
              class="form-input"
              v-model="name"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              :label="$t('Email Address')"
              :placeholder="$t('Input the email address')"
              class="form-input"
              v-model="email"
              clearable
              outlined dense hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </div>
      <div>
        <v-card-actions class="d-flex justify-center">
          <v-btn text icon @click="clickSave" class="btn">{{ $t('Save') }}</v-btn>
          <v-btn text icon @click="dialog = false" class="btn">{{ $t('Cancel') }}</v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
import EventBus from '@/plugins/eventBus'
import { getPasswordValidation, getEmailValidation } from '@/plugins/passwordValidator'

export default {
  props: [
    'accessLevelItems',
    'userAccessLevel',
    'btnDisabledNewDelete'
  ],

  data () {
    return {
      dialog: false,
      user: null,
      account: null,
      password: null,
      name: null,
      accessLevel: null,
      email: null,
      emailReport: null,
      emailAlarm: null,
      phoneNumber: null
    }
  },
  methods: {
    isBodyValid (body) {
      for (const key of Object.keys(body)) {
        if (body[key] === null || body[key] === undefined || body[key].length < 1) {
          return false
        }
      }
      return true
    },
    isValidUserInfo (body) {
      const bodyToTest = {
        account: this.account,
        password: this.password,
        firstName: this.name,
        accessLevel: this.accessLevel
      }
      if (!this.isBodyValid(bodyToTest)) {
        EventBus.$emit('messageAlert', this.$t('The user information is invalid.'))
        return false
      }
      const passwordValidation = getPasswordValidation(body.account, body.password, this.user)
      if (!passwordValidation.result) {
        EventBus.$emit('messageAlert', this.$t(passwordValidation.msg))
        return false
      }
      const emailValidation = getEmailValidation(body.emailAddress)
      if (!emailValidation.result) {
        EventBus.$emit('messageAlert', this.$t(emailValidation.msg))
        return false
      }
      return true
    },
    clickSave () {
      const url = '/api/common/account'
      const config = {
        params: {
          company: this.$store.state.auth.user.company,
          myAccessLevel: this.userAccessLevel
        }
      }
      const body = {
        account: this.account,
        password: this.password,
        firstName: this.name,
        accessLevel: this.accessLevel,
        emailAddress: this.email
      }
      if (!this.isValidUserInfo(body)) return
      this.$utils.callAxiosWithBody('post', url, body, config)
        .then(res => {
          EventBus.$emit('messageAlert', this.$t(res.data.responseMessage))
        })
        .catch(error => {
          EventBus.$emit('messageAlert', this.$t(error.response.data.responseMessage))
        })
        .finally(() => {
          this.$emit('updateUserInfo')
          this.dialog = false
        })
    },
    initData () {
      this.account = null
      this.password = null
      this.name = null
      this.accessLevel = null
      this.email = null
      this.emailReport = null
      this.emailAlarm = null
      this.phoneNumber = null
    }
  },
  mounted () {
    this.user = this.$store.state.auth.user
  },
  watch: {
    dialog: function () {
      this.initData()
    }
  }
}
</script>
