<template>
  <v-dialog v-model="dialogUserEdit" @click:outside="closeModal" width="700">
    <v-card class="popup add_store_popup">
      <h3 class="page-title-bar">
        <i class="ico ico-user"></i>
        {{ $t('User Edit') }}
      </h3>
      <div>
        <v-row>
          <v-col cols="6">
            <v-select
              v-model="approval"
              :label="$t('Approval')"
              :placeholder="$t('Select the Approval')"
              :items="approvalItems"
              class="form-select"
              outlined
              dense
              hide-details
            ></v-select>
          </v-col>
        </v-row>
      </div>
      <div>
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
              disabled
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="name"
              :label="`${$t('Name')}`"
              :placeholder="$t('Input the name')"
              class="form-input"
              outlined
              dense
              hide-details
              disabled
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <p class="label-txt">{{ $t('User Level') }}</p>
            <v-radio-group v-model="selectLevel" dense hide-details row>
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
        <v-card-actions class="d-flex justify-center">
          <v-btn text icon @click="clickSave" class="btn">{{
            $t('Save')
          }}</v-btn>
          <v-btn text icon @click="closeModal" class="btn">{{
            $t('Cancel')
          }}</v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import EventBus from '@/plugins/eventBus'
import codes from '@/plugins/codes'

export default {
  props: ['dialogUserEdit', 'accessLevelItems', 'userAccessLevel'],
  data () {
    return {
      approval: 'Disapproval',
      customer: null,
      name: null,
      accessLevel: this.$store.getters['auth/GET_USER_LEVEL'],
      selectLevel: null,
      email: null,
      item: {},
      approvalItems: ['Approval', 'Disapproval']
    }
  },
  computed: {},
  methods: {
    getAccessLevelDisabled (accessLevel) {
      return (Number(accessLevel) < Number(this.userAccessLevel))
    },
    closeModal () {
      this.$emit('closeModal', false)
    },
    refreshUserInfo () {
      this.$emit('updateUserInfo')
      this.closeModal()
    },
    clickSave () {
      // 기존 레벨보다 낮은건만 선택가능( 1 이 최상위 )
      if (this.accessLevel > this.selectLevel) {
        EventBus.$emit(
          'messageAlert',
          this.$t(
            'You cannot update a user with a level higher than your level.'
          )
        )
        return
      }
      const config = {
        params: {}
      }

      const body = [
        {
          account: this.item.account,
          approvalStatus: this.approval === 'Approval',
          accountLevel: this.selectLevel,
          customerCode: this.customer
        }
      ]

      this.$utils
        .callAxiosWithBody(
          codes.requests.editUserCloud.method,
          codes.requests.editUserCloud.url,
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
          EventBus.$emit(
            'messageAlert',
            this.$t(error.response.data.responseMessage)
          )
        })
    },
    setData () {
      this.approval = this.item.isApproved
        ? this.approvalItems[0]
        : this.approvalItems[1]
      this.name = this.item.firstName
      this.email = this.item.emailAddress
      // this.accessLevel = this.item.accessLevel
      this.selectLevel = this.item.accessLevel
      this.customer = this.item.customer
    },
    initData () {
      this.approval = 'Disapproval'
      this.name = null
      this.email = null
      this.customer = null
    }
  },
  mounted () {
    EventBus.$on('openUserInfoEditPopup', item => {
      Object.assign(this.item, item)
      this.initData()
      this.setData()
    })
    this.$store.dispatch('auth/getDisabledBtn', '8100').then((flag) => {
      this.userSaveDisabled = flag
    })
  }
}
</script>
