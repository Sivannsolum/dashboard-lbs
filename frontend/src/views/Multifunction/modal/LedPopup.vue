<template>
  <div>
     <v-dialog
          v-model="dialogPopup"
          @click:outside="closeModal()"
          width="400"
        >
          <v-card class="popup add_store_popup">
            <h3 class="page-title-bar"><i class="ico ico-multi"></i>{{$t('Edit Pattern')}}</h3>

            <!-- <template v-slot:activator="{ on, attrs }">
                <v-btn text v-bind="attrs" v-on="on" @click="openPopup()">{{item.name}}</v-btn>
            </template> -->
            <v-row>
              <v-col class="pt-0">
                <v-text-field outlined dense hide-details
                  :label="Label_PatternName"
                  :disabled="true"
                  v-model="ledItem.patternName"
                  ref="patternName"
                  placeholder="Input the name"
                  class="form-input"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field outlined dense hide-details
                  :label="Label_OnTime"
                  v-model="ledItem.onTime"
                  ref="onTime"
                  type="number"
                  placeholder="Input On time(msec) Value(10~2250, unit:10)"
                  class="form-input"
                  min=10
                  max=2250
                  @keyup.prevent="handleKeyUp"
                  clearable
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field outlined dense hide-details
                  :label="Label_OffTime"
                  v-model="ledItem.offTime"
                  ref="offTime"
                  type="number"
                  placeholder="Input Off time(msec) Value(10~2250, unit:10)"
                  class="form-input"
                  min=10
                  max=2250
                  @keyup.prevent="handleKeyUp"
                  clearable
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field outlined dense hide-details
                  :label="Label_IdleTime"
                  v-model="ledItem.idleTime"
                  ref="idleTime"
                  type="number"
                  placeholder="Input Idle time(sec) Value(1~225, unit:1)"
                  class="form-input"
                  min=1
                  max=225
                  @keyup.prevent="handleKeyUp"
                  clearable
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field outlined dense hide-details
                  :label="Label_RepeatCount"
                  v-model="ledItem.repeatCount"
                  type="number"
                  ref="repeatCount"
                  placeholder="Input Active count Value(1~225, unit:1)"
                  class="form-input"
                  min=1
                  max=225
                  @keyup.prevent="handleKeyUp"
                  clearable
                ></v-text-field>
              </v-col>
            </v-row>

            <v-card-actions class="d-flex justify-center">
              <v-btn text icon @click="save()" class="btn" @>{{$t('Save')}}</v-btn>
              <v-btn text icon @click="closeModal()" class="btn">{{$t('Cancel')}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
  </div>
</template>

<script>
import EventBus from '@/plugins/eventBus.js'

export default {
  name: 'LedPopup',
  props: {
    dialogPopup: Boolean,
    selectedItem: Object
  },
  watch: {
    dialogPopup: function (val) {
      if (val) { // init
        this.ledItem = {
          id: this.selectedItem.id,
          patternName: this.selectedItem.patternName,
          onTime: this.selectedItem.onTime,
          offTime: this.selectedItem.offTime,
          idleTime: this.selectedItem.idleTime,
          repeatCount: this.selectedItem.repeatCount
        }
      } else { // close
        this.ledItem = {
          id: '',
          patternName: '',
          onTime: null,
          offTime: null,
          idleTime: null,
          repeatCount: null
        }
      }
    }
  },
  methods: {
    closeModal (refresh) {
      if (refresh) {
        this.$emit('reload', true)
      } else {
        this.$emit('reload', false)
      }
    },
    save () {
      if (this.ledItem.patternName === '') {
        this.$refs.patternName.focus()
        EventBus.$emit('messageAlert', this.$t('Input the data'))
        return
      }
      if (this.ledItem.onTime === '') {
        this.$refs.onTime.focus()
        EventBus.$emit('messageAlert', this.$t('Input the data'))
        return
      } else {
        if (this.ledItem.onTime * 1 < 10 || this.ledItem.onTime * 1 > 2250) {
          EventBus.$emit('messageAlert', this.$t('Input On time(msec) Value(10~2250, unit:10)'))
          return
        }
      }
      if (this.ledItem.offTime === '') {
        this.$refs.offTime.focus()
        EventBus.$emit('messageAlert', this.$t('Input the data'))
        return
      } else {
        if (this.ledItem.offTime * 1 < 10 || this.ledItem.offTime * 1 > 2250) {
          EventBus.$emit('messageAlert', this.$t('Input Off time(msec) Value(10~2250, unit:10)'))
          return
        }
      }
      if (this.ledItem.idleTime === '') {
        this.$refs.idleTime.focus()
        EventBus.$emit('messageAlert', this.$t('Input the data'))
        return
      } else {
        if (this.ledItem.idleTime * 1 < 1 || this.ledItem.idleTime * 1 > 225) {
          EventBus.$emit('messageAlert', this.$t('Input Idle time(sec) Value(1~225, unit:1)'))
          return
        }
      }
      if (this.ledItem.repeatCount === '') {
        this.$refs.repeatCount.focus()
        EventBus.$emit('messageAlert', this.$t('Input the data'))
        return
      } else {
        if (this.ledItem.repeatCount * 1 < 1 || this.ledItem.repeatCount * 1 > 225) {
          EventBus.$emit('messageAlert', this.$t('Input Active count Value(1~225, unit:1)'))
          return
        }
      }

      const data = {}
      const params = {}
      params.pattern = this.ledItem.patternName
      data.onTime = this.ledItem.onTime * 1
      data.offTime = this.ledItem.offTime * 1
      data.idleTime = this.ledItem.idleTime * 1
      data.repeatCount = this.ledItem.repeatCount * 1
      if (this.productionType === 'cloud') params.company = this.$store.state.auth.user.company
      const config = { params }
      this.$utils
        .callAxiosWithBody(
          this.requests.saveLedItem.method,
          this.requests.saveLedItem.url,
          data,
          config
        )
        .then((res) => {
          const result = res.data
          if (result.responseCode === '200') {
            EventBus.$emit('messageAlert', this.$t('Saved successfully'))
            this.closeModal(true)
          } else {
            EventBus.$emit('messageAlert', this.$t(result.responseMessage))
          }
        })
    },
    handleKeyUp (e) {
      const koreanExp = /[ㄱ-ㅎㅏ-ㅣ가-힣]/g
      e.target.value = e.target.value.replace(koreanExp, '')
    }
  },
  data () {
    return {
      productionType: process.env.VUE_APP_PRODUCTION_TYPE,
      Label_PatternName: this.$t('Name'),
      Label_OnTime: this.$t('On Time (msec)'),
      Label_OffTime: this.$t('Off Time(msec)'),
      Label_IdleTime: this.$t('Idle Time (sec)'),
      Label_RepeatCount: this.$t('Active Count'),
      ledItem: {
        id: '',
        patternName: '',
        onTime: null,
        offTime: null,
        idleTime: null,
        repeatCount: null
      },
      requests: {
        saveLedItem: {
          method: 'put',
          url: '/api/common/functions/led/pattern'
        }
      }
    }
  }
}

</script>
