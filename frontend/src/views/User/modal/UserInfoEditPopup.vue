<template>
  <v-dialog
    v-model="dialogUserEdit"
    @click:outside="closeModal"
    width="700"
  >
    <v-card class="popup add_store_popup">
      <h3 class="page-title-bar">
        <i class="ico ico-user"></i>
        {{ $t('User Edit') }}
      </h3>
      <div>
        <v-row>
          <v-col>
            <v-text-field
              outlined
              dense
              hide-details
              :label="`${$t('ID')} *`"
              :placeholder="$t('Input the ID')"
              :value="item.account"
              class="form-input"
              disabled
              clearable
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              outlined
              dense
              hide-details
              :label="`${$t('Password')} *`"
              type="Password"
              v-model="password"
              class="form-input"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <p class="label-txt">{{ $t('Permission Level') }} *</p>
            <v-radio-group
              v-model="item.accessLevel"
              dense
              hide-details
              row
            >
              <v-radio
                v-for="item in accessLevelItems"
                :disabled="getAccessLevelDisabled(item.level)"
                :key="item.level"
                :value="item.level"
                :label="item.name"
                class="form-radio flat"
              ></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
      </div>
      <div>
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="name"
              :label="`${$t('Name')} *`"
              :placeholder="$t('Input the name')"
              class="form-input"
              outlined
              dense
              hide-details
              clearable
            ></v-text-field>
          </v-col>
          <!-- 삭제
          <v-col>
            <v-text-field outlined dense hide-details
              label="Phone Number"
              placeholder="Input the phone number"
              class="form-input"
              v-model="phoneNumber"
            ></v-text-field>
          </v-col>
           -->
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="email"
              :label="$t('Email Address')"
              :placeholder="$t('Input the email address')"
              class="form-input"
              outlined
              dense
              hide-details
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
      </div>
      <div>
        <v-card-actions class="d-flex justify-center">
          <v-btn
            :disabled="userSaveDisabled"
            @click="clickSave"
            text
            icon
            class="btn"
          >{{ $t('Save') }}
          </v-btn>
          <v-btn
            text
            icon
            @click="closeModal"
            class="btn"
          >{{ $t('Cancel') }}
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import EventBus from '@/plugins/eventBus'
import codes from '@/plugins/codes'
import commons from '@/plugins/commons'
import { getEmailValidation } from '@/plugins/passwordValidator'

export default {
  props: [
    'dialogUserEdit',
    'accessLevelItems',
    'userAccessLevel'
  ],
  data () {
    return {
      accessLevel: null,
      password: null,
      name: null,
      phoneNumber: null,
      email: null,
      item: {},
      userSaveDisabled: false
    }
  },
  computed: {},
  methods: {
    getAccessLevelDisabled (accessLevel) {
      return (Number(accessLevel) <= Number(this.userAccessLevel))
    },
    closeModal () {
      this.$emit('closeModal', false)
    },
    refreshUserInfo () {
      this.closeModal()
      this.$emit('updateUserInfo')
    },
    checkUserInfoValidation (password, email) {
      if (commons.isNull(password)) {
        EventBus.$emit('messageAlert', this.$t('The password is empty.'))
        return false
      }
      const emailValidation = getEmailValidation(email)
      if (emailValidation.result === false) {
        EventBus.$emit('messageAlert', this.$t(emailValidation.msg))
        return false
      }
      return true
    },
    clickSave () {
      if (commons.isValidStr(this.email)) this.email = this.email.trim(' ') // 값이 있는경우 trim
      if (this.checkUserInfoValidation(this.password, this.email) === false) return // 빈값이 아닌경우 유효성검사
      if (this.email === null) this.email = '' // null 인경우 API요청할 수 없으므로, ''로 교체
      const config = {
        params: {
          company: this.$store.state.auth.user.company,
          myAccessLevel: this.userAccessLevel
        }
      }
      const body = {
        account: this.item.account,
        password: this.password,
        firstName: this.name,
        emailAddress: this.email,
        accessLevel: this.item.accessLevel
      }
      this.$utils
        .callAxiosWithBody(
          codes.requests.editUser.method,
          codes.requests.editUser.url,
          body,
          config
        )
        .then(res => {
          if (res.data.responseCode === '200') {
            EventBus.$emit('messageAlert', this.$t(res.data.responseMessage))
            this.refreshUserInfo()
          }
        })
        .catch(error => {
          console.debug(`Failed to edit the user information. error: ${error}`)
          EventBus.$emit('messageAlert', this.$t(error.response.data.responseMessage))
        })
    },
    getMyInfo () {
      const config = {
        params: {
          company: this.$store.state.auth.user.company,
          account: this.item.account
        }
      }
      this.$utils.callAxios(
        codes.requests.getUserDetail.method,
        codes.requests.getUserDetail.url,
        config
      ).then(res => {
        if (res.data) {
          this.email = res.data.emailAddress
          this.phoneNumber = res.data.phoneNumber
          this.name = res.data.firstName
        }
      })
    },
    initData () {
      this.password = null
      this.name = null
      this.phoneNumber = null
      this.email = null
    }
  },
  mounted () {
    EventBus.$on('openUserInfoEditPopup', (item) => {
      Object.assign(this.item, item)
      this.initData()
      this.getMyInfo()
    })
    this.$store.dispatch('auth/getDisabledBtn', '8100').then((flag) => {
      this.userSaveDisabled = flag
    })
  }
}
</script>
