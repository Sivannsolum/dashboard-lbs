<template>
  <div>
    <v-dialog v-model="show" width="700">
      <v-card class="popup add_store_popup">
        <h3 class="page-title-bar">
          <i class="ico ico-gateway"></i>{{ $t('Gateway Detail') }}
        </h3>

        <v-row>
          <v-col>
            <v-text-field
              outlined
              dense
              hide-details
              :label="`${$t('MAC Address')} *`"
              :placeholder="`${$t('Input the MAC Address')}`"
              v-model="gateway['macAddress']"
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
              :label="`${$t('Name')}`"
              :placeholder="`${$t('Input the name')}`"
              v-model="gateway['name']"
              class="form-input"
              disabled
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              outlined
              dense
              hide-details
              :label="`${$t('Data CH')}`"
              :placeholder="$t('Input the Data CH')"
              v-model.number="gateway['dataChannel']"
              class="form-input"
              clearable
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              outlined
              dense
              hide-details
              :label="`${$t('Wakeup CH')}`"
              :placeholder="$t('Input the Wakeup CH')"
              v-model.number="gateway['wakeupChannel']"
              class="form-input"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              outlined
              dense
              hide-details
              :label="`${$t('Beacon CH ')}**`"
              :placeholder="$t('Input the Beacon CH')"
              v-model.number="gateway['beaconChannel']"
              class="form-input"
              clearable
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              outlined
              dense
              hide-details
              :label="$t('Machine ID')"
              :placeholder="$t('Input the Int Machine ID')"
              v-model.number="gateway['machId']"
              class="form-input"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              outlined
              dense
              hide-details
              :label="`${$t('Int Machine ID')} **`"
              :placeholder="`${$t('Input the Int Machine ID')}`"
              v-model.number="gateway['integMachId']"
              class="form-input"
              clearable
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              outlined
              dense
              hide-details
              :label="`${$t('Refresh Start')}`"
              :placeholder="`${$t('Input the Refresh Start')}`"
              v-model.number="gateway['refreshStart']"
              class="form-input"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
        <!-- <v-row>
          <v-col>
            <v-select
              outlined
              dense
              hide-details
              :label="`${$t('Number Display')}`"
              :placeholder="`${$t('Choose the Number Display')}`"
              :items="['Yes', 'No']"
              class="form-select"
              v-model="gateway['displayNoEnable']"
              clearable
            ></v-select>
          </v-col>
          <v-col>
            <v-text-field
              outlined
              dense
              hide-details
              :label="`${$t('Number')}`"
              :placeholder="`${$t('Input the Number')}`"
              v-model="gateway['displayNo']"
              class="form-input"
              clearable
            ></v-text-field>
          </v-col>
        </v-row> -->
        <p class="label-txt">
          <span><strong>*</strong> {{ $t('Mandatory') }}</span>
          <span class="ml-5"
            ><strong>**</strong>
            {{ $t('Gateways will be rebooted by changing the config') }}</span
          >
        </p>

        <v-card-actions class="d-flex justify-center">
          <v-btn text icon @click="updateSingleGateway" class="btn">{{
            $t('Save')
          }}</v-btn>
          <v-btn text icon @click="show = false" class="btn">{{
            $t('Cancel')
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import EventBus from '@/plugins/eventBus.js'
import commons from '@/plugins/commons'

const requests = {
  updateGateway: {
    method: 'put',
    url: '/api/common/gateway'
  }
}

export default {
  props: {
    value: Boolean,
    gateway: Object
  },
  data () {
    return {
      dialog: false,
      message: ''
    }
  },
  computed: {
    show: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    buildSingleGateway (gateway) {
      const singleGateway = {
        name: gateway.name,
        dataChannel: gateway.dataChannel,
        wakeupChannel: gateway.wakeupChannel,
        beaconChannel: gateway.beaconChannel,
        machId: gateway.machId,
        integMachId: gateway.integMachId,
        refreshStart: gateway.refreshStart
        // displayNoEnable: (gateway.displayNoEnable === 'Yes'),
        // displayNo: gateway.displayNo
      }
      return singleGateway
    },
    toDashLessMacAddr (mac) {
      if (!commons.isValidStr(mac)) return
      const macAddress = mac.replaceAll('-', '')
      return `${macAddress.substring(0, 6)}FFFE${macAddress.substring(6, 13)}`
    },
    updateSingleGateway: function () {
      this.show = false
      // const config = {
      //   params: {
      //     company: this.$store.state.auth.user.company,
      //     store: this.$store.getters['dataStore/GET_SELECTED_STORE'].code,
      //     gateway: this.toDashLessMacAddr(this.gateway.macAddress)
      //   }
      // }
      const config = {
        params: {
          company: this.$store.state.auth.user.company,
          store: this.$store.getters['dataStore/GET_SELECTED_STORE'].code,
          gateway: this.gateway.macAddress
        }
      }
      const singleGateway = this.buildSingleGateway(this.gateway)
      this.$utils
        .callAxiosWithBody(
          requests.updateGateway.method,
          requests.updateGateway.url,
          singleGateway,
          config
        )
        .then(res => {
          EventBus.$emit(
            'messageAlert',
            this.$t('The gateway information has been updated successfully')
          )
          this.$emit('fireUpdateGatewayList')
        })
        .catch(error => {
          EventBus.$emit(
            'messageAlert',
            this.$t('Failed to updated the Gateway')
          )
          console.log(error)
        })
    }
  }
}
</script>
