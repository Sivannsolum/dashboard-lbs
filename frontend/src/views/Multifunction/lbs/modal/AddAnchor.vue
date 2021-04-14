<template>
  <v-dialog
    v-model="dialog"
    @click:outside="cancelAddAnchor"
    width="400"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn :disabled="addBtnDisabled" text v-bind="attrs" v-on="on" class="btn">{{$t('New')}}</v-btn>
    </template>
    <v-card class="popup add_store_popup">
      <h3 class="page-title-bar"><i class="ico ico-multi"></i>{{$t('New Anchor')}}</h3>
      <v-row>
        <v-col>
          <v-text-field
            v-model="labelId"
            :label="Label_LabelId"
            :placeholder="$t('Input the label ID')"
            class="form-input"
            outlined
            dense
            hide-details
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="positionId"
            :label="Label_PositionId"
            :placeholder="$t('Input the location ID')"
            :maxlength=50
            class="form-input"
            outlined
            dense
            hide-details
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
      <v-card-actions class="d-flex justify-center">
        <v-btn @click="addAnchor" text icon class="btn">{{ $t('Save') }}</v-btn>
        <v-btn @click="cancelAddAnchor" text icon class="btn">{{ $t('Cancel') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import EventBus from '@/plugins/eventBus.js'
import commons from '@/plugins/commons'
import codes from '@/plugins/codes'

const requests = {
  addAnchor: {
    method: 'post',
    url: '/api/common/lbs/anchor/config'
  }
}

export default {
  props: ['user', 'addBtnDisabled'],
  data () {
    return {
      productionType: process.env.VUE_APP_PRODUCTION_TYPE,
      dialog: false,
      positionId: null,
      labelId: null
    }
  },
  computed: {
    cloudMode () {
      return (process.env.VUE_APP_PRODUCTION_TYPE === codes.productionTypes.CLOUD)
    },
    Label_LabelId () {
      return this.$t('Label ID')
    },
    Label_PositionId () {
      return this.$t('Location ID')
    }
  },
  methods: {
    cancelAddAnchor () {
      this.positionId = null
      this.labelId = null
      this.dialog = false
    },
    addAnchor () {
      const anchor = { positionId: this.positionId, labelId: this.labelId }
      if (this.cloudMode) anchor.storeCode = this.$store.state.dataStore.selectedStore?.code
      const isValidData = commons.isValidData({ LocationId: this.positionId, labelId: this.labelId })
      if (!isValidData.result) {
        const msg = commons.converMsg(isValidData.msg, commons.msgType.InvalidAnchorData)
        EventBus.$emit('messageAlert', this.$t(msg))
        return
      }
      const params = { company: this.user.company }
      if (this.productionType === codes.productionTypes.CLOUD) {
        params.storeCode = this.$store.state.dataStore.selectedStore.code
      }
      const config = { params: params }

      return this.$utils
        .callAxiosWithBody(
          requests.addAnchor.method,
          requests.addAnchor.url,
          anchor,
          config
        )
        .then(res => {
          const result = res.data
          EventBus.$emit('messageAlert', this.$t(result.responseMessage))
          this.$emit('fireResetAnchors')
          this.cancelAddAnchor()
        })
        .catch(error => {
          EventBus.$emit('messageAlert', this.$t(error.response.data.responseMessage))
          console.log(error)
          this.cancelAddAnchor()
        })
    }
  }
}
</script>

<style>
</style>
