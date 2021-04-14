<template>
  <v-dialog v-model="dialog" width="400">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        text
        :disabled="btnDisabledBlinking"
        v-bind="attrs"
        v-on="on"
        class="btn ml-2"
        @click="initData()"
        >{{ $t('Blink LED') }}</v-btn
      >
    </template>

    <v-card class="popup">
      <h3 class="page-title-bar">
        <i class="ico ico-label"></i>{{ $t('Blink LED') }}
      </h3>
      <v-row>
        <v-col class="pt-0">
          <v-select
            outlined
            dense
            hide-details
            v-model="pattern"
            :label="$t('Pattern')"
            :items="patternItems"
            item-text="name"
            item-value="id"
            class="form-select"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-select
            outlined
            dense
            hide-details
            v-model="duration"
            :label="$t('Duration')"
            :placeholder="durationItems[0]"
            :items="durationItems"
            class="form-select"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-select
            outlined
            dense
            hide-details
            v-model="color"
            :label="$t(Label_Color)"
            :placeholder="colorItems[0]"
            :items="colorItems"
            class="form-select"
          ></v-select>
        </v-col>
      </v-row>

      <v-card-actions class="d-flex justify-center">
        <v-btn text icon @click="handleSaveBtnClick" class="btn">{{
          $t('Save')
        }}</v-btn>
        <v-btn text icon @click="dialog = false" class="btn">{{
          $t('Cancel')
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import EventBus from '@/plugins/eventBus.js'

const requests = {
  getLabelLedData: {
    method: 'get',
    url: '/api/common/functions/led/pattern'
  },
  blinkLabelLed: {
    method: 'put',
    url: '/api/common/labels/led'
  }
}

export default {
  props: ['selectedLabel', 'btnDisabledBlinking'],
  data () {
    return {
      Label_Color: this.$t('Color'),
      dialog: false,
      ledPattern: null,
      patternItems: [],
      durationItems: ['0s', '10s', '30s', '1m', '2m', '5m'],
      colorItems: [
        'RED',
        'GREEN',
        'BLUE',
        'MAGENTA',
        'YELLOW',
        'CYAN',
        'WHITE'
      ],
      pattern: null,
      duration: '0s',
      color: 'RED'
    }
  },
  computed: {
    selectedStore () {
      return this.$store.getters['dataStore/GET_SELECTED_STORE'].code
    }
  },
  methods: {
    initData () {
      this.pattern = 0
      this.duration = '0s'
      this.color = 'RED'
      this.getBlinkData()
    },
    getBlinkData () {
      const config = {
        params: { company: this.$store.state.auth.user.company }
      }
      this.$utils
        .callAxios(
          requests.getLabelLedData.method,
          requests.getLabelLedData.url,
          config
        )
        .then(res => {
          this.ledPattern = res.data
          if (res.data !== undefined && res.data.ledConfigList.length > 0) {
            this.patternItems = res.data.ledConfigList.map(ledConfig => {
              return { name: ledConfig.patternName, id: ledConfig.id }
            })
          }
          if (this.patternItems[0] !== undefined) { this.pattern = this.patternItems[0].id }
        })
    },
    handleSaveBtnClick () {
      this.dialog = false
      const params = {
        company: this.$store.state.auth.user.company,
        store: this.selectedStore
      }
      const ledBlinkList = this.selectedLabel.map(label => {
        return {
          color: this.color,
          duration: this.duration,
          labelCode: label,
          patternId: this.pattern
        }
      })
      const body = { ledBlinkList }
      const config = { params: params }
      this.$utils
        .callAxiosWithBody(
          requests.blinkLabelLed.method,
          requests.blinkLabelLed.url,
          body,
          config
        )
        .then(res => {
          if (res.data) {
            EventBus.$emit('messageAlert', this.$t('Blink LED Success'))
          } else {
            EventBus.$emit('messageAlert', this.$t('Failed to blink LED'))
          }
          this.color = null
          this.duration = null
          this.pattern = {}
        })
        .catch(error => {
          const result = error.response.data
          EventBus.$emit('messageAlert', this.$t(result.responseMessage))
        })
    }
  }
}
</script>
