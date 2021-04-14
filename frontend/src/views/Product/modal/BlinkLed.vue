<template>
  <v-dialog v-model="showBlinkLed" @click:outside="cancelBlinkLed" width="400">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        v-on="on"
        class="btn ml-2"
        :disabled="blinkLedDisabled"
        text
        >{{ $t("Blink LED") }}</v-btn
      >
    </template>
    <v-card class="popup">
      <h3 class="page-title-bar">
        <i class="ico ico-label"></i>{{ $t("Blink LED") }}
      </h3>
      <v-row v-for="input in blinkLedInputs" :key="input.name">
        <v-col v-if="input.selectable" class="pt-0">
          <v-select
            v-model="input.value"
            :items="input.options"
            :label="$t(input.label)"
            :placeholder="$t(input.placeholder)"
            class="form-select"
            outlined
            dense
            hide-details
          ></v-select>
        </v-col>
        <v-col v-else>
          <v-text-field
            v-model="input.value"
            :label="$t(input.label)"
            :placeholder="$t(input.placeholder)"
            class="form-input"
            outlined
            dense
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
      <v-card-actions class="d-flex justify-center">
        <v-btn
          @click="saveBlinkLed"
          class="btn"
          text
          icon
        >{{ $t("Save") }}
        </v-btn>
        <v-btn
          @click="cancelBlinkLed"
          class="btn"
          text
          icon
        >{{ $t("Cancel") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import EventBus from '@/plugins/eventBus'
import commons from '@/plugins/commons'
import codes from '@/plugins/codes'

export default {
  props: {
    btnDisabledBlinking: Boolean,
    store: Object,
    selected: Array
  },
  data () {
    return {
      productionType: process.env.VUE_APP_PRODUCTION_TYPE,
      blinkLedInputs: [
        {
          name: 'patternId',
          label: 'Pattern',
          placeholder: 'Pattern',
          options: [],
          value: '',
          selectable: true
        },
        {
          name: 'duration',
          label: 'Duration',
          placeholder: 'Duration',
          options: ['0s', '10s', '30s', '1m', '2m', '5m'],
          value: '',
          selectable: true
        },
        {
          name: 'color',
          label: 'Color',
          placeholder: 'Color',
          options: [
            'RED',
            'GREEN',
            'BLUE',
            'MAGENTA',
            'YELLOW',
            'CYAN',
            'WHITE'
          ],
          value: '',
          selectable: true
        }
      ],
      InitialBlinkLedInputs: [],
      ledPatterns: [],
      showBlinkLed: false
    }
  },
  computed: {
    blinkLedDisabled () {
      let btnDisabled = this.btnDisabledBlinking
      if (!btnDisabled) btnDisabled = (this.selected.length < 1)
      return btnDisabled
    }
  },
  mounted () {
    this.initLedPatterns()
    this.InitialBlinkLedInputs = commons.copy(this.blinkLedInputs)
  },
  methods: {
    async initLedPatterns () {
      this.ledPatterns = await this.getLedPatterns()
      this.showLedPatterns(this.ledPatterns)
    },
    cancelBlinkLed () {
      this.showBlinkLed = false
      this.blinkLedInputs = commons.copy(this.InitialBlinkLedInputs)
      this.initLedPatterns()
    },
    getPatternId (patternName) {
      const patternId = this.ledPatterns
        .filter(ledPattern => ledPattern.patternName === patternName)
        .pop().id
      return String(patternId)
    },
    buildLedBlinkList (blinkLedInputs, selected) {
      const ledBlinkList = []
      for (const product of selected) {
        const ledBlink = {}
        for (const input of blinkLedInputs) {
          ledBlink[input.name] = input.value
        }
        ledBlink.stationCode = this.store.code
        ledBlink.articleId = product.articleId
        ledBlink.patternId = this.getPatternId(ledBlink.patternId)
        ledBlinkList.push(ledBlink)
      }
      return ledBlinkList
    },
    saveBlinkLed () {
      if (this.selected.length < 1) return
      const ledBlinkList = this.buildLedBlinkList(this.blinkLedInputs, this.selected)
      const reqBody = { ledBlinkList }
      const params = {
        store: this.store.code
      }

      if (this.productionType === 'cloud') {
        params.company = this.$store.state.auth.user.company
      }

      const config = { params }
      this.$utils
        .callAxiosWithBody(
          codes.requests.saveBlinkLed.method,
          codes.requests.saveBlinkLed.url,
          reqBody,
          config
        )
        .then(res => {
          EventBus.$emit('messageAlert', this.$t(res.data.responseMessage))
          this.$emit('fireResetProduct')
        })
        .catch(error => {
          const result = error.response.data
          if (result.responseCode === '406') {
            EventBus.$emit(
              'messageAlert',
              this.$t('Each article has to has at least one assigned label.')
            )
          } else {
            EventBus.$emit('messageAlert', this.$t(result.responseMessage))
          }
        })
        .finally(() => {
          this.cancelBlinkLed()
        })
    },
    showLedPatterns (ledPatterns) {
      ledPatterns = ledPatterns.map(ledPattern => ledPattern.patternName)
      this.blinkLedInputs.find(input => input.name === 'patternId').options = ledPatterns
      this.blinkLedInputs = this.blinkLedInputs.map(input => {
        input.value = input.options[0]
        return input
      })
    },
    getLedPatterns () {
      const params = { store: this.store.code }
      const config = { params: params }
      if (this.productionType === 'cloud') {
        params.company = this.$store.state.auth.user.company
      }
      return this.$utils
        .callAxios(
          codes.requests.getLedPatterns.method,
          codes.requests.getLedPatterns.url,
          config
        )
        .then((res) => {
          return res.data.ledConfigList
        })
    }
  }
}
</script>

<style>
</style>
