<template>
  <v-dialog
    v-model="show"
    width="700"
    @click:outside="cancelAddGateway()">
    <v-card class="popup add_store_popup">
      <h3 class="page-title-bar"><i class="ico ico-gateway"></i>{{$t('Add Gateway')}}</h3>

      <!-- 검색 -->
      <div class="searchArea">
        <v-text-field
          v-model="searchMac"
          outlined
          dense
          hide-details
          solo
          :placeholder="`${$t('Input the gateway MAC address.')}`"
          class="form-input"
          clearable
        ></v-text-field>

        <v-btn text class="btn type-search ml-3" @click="getGatewayList()">{{$t('Search')}}</v-btn>
      </div>

      <v-row class="mt-5">
        <v-col cols="5">
          <!-- data table -->
          <v-data-table
            v-model="selectedFloating"
            :headers="popup1Headers"
            :items="floatingGwList"
            :hide-default-footer="true"
            item-key="mac_address"
            show-select
            class="tbl-type01 flat-type02"
          >
          </v-data-table>
        </v-col>
        <v-col cols="2" class="d-flex flex-column align-center justify-center">
          <v-btn text
            @click="removeAddress()"
            ><img src="@/assets/img/ico-move-left.png" alt=""
          /></v-btn>
          <v-btn text class="mt-3"
            @click="addMacAddress()"
            ><img src="@/assets/img/ico-move-right.png" alt=""
          /></v-btn>
        </v-col>
        <v-col cols="5">
          <!-- data table -->
          <v-data-table
            v-model="selectedRegisted"
            :headers="popup2Headers"
            :items="registedGwList"
            :hide-default-footer="true"
            item-key="mac_address"
            show-select
            class="tbl-type01 flat-type02"
            @toggle-select-all="selectAllToggle"
          >
          <template v-slot:[`item.data-table-select`]="{ item, isSelected, select }">
            <v-simple-checkbox
              :value="isSelected"
              :readonly="item.disabled"
              :disabled="item.disabled"
              @input="select($event)"
            ></v-simple-checkbox>
          </template>
          </v-data-table>
        </v-col>
      </v-row>

      <v-card-actions class="d-flex justify-center">
        <v-btn text icon @click="saveAddGateway" class="btn">{{$t('Add')}}</v-btn>
        <v-btn text icon @click="cancelAddGateway" class="btn">{{$t('Cancel')}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import codes from '@/plugins/codes'
import EventBus from '@/plugins/eventBus'

export default {
  props: {
    value: Boolean
  },
  data () {
    return {
      selectedStore: this.$store.getters['dataStore/GET_SELECTED_STORE'],
      popup1Headers: [{ text: 'MAC ID', align: 'center', value: 'mac_address' }],
      floatingGwList: [],
      registedGwList: [],
      popup2Headers: [
        { text: 'SELECTED GATEWAY', align: 'center', value: 'mac_address' }
      ],
      page: 1,
      pageCount: 0,
      disabledCount: 0,
      searchMac: '',
      selectedFloating: [],
      selectedRegisted: []
    }
  },
  watch: {
    show (value) {
      if (value) this.getGatewayList()
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
    cancelAddGateway () {
      this.show = false
      this.searchMac = ''
      this.selectedFloating = []
      this.floatingGwList = []
      this.selectedRegisted = []
      this.registedGwList = []
    },
    selectAllToggle (props) {
      if (this.selectedRegisted.length !== (this.registedGwList.length - this.disabledCount)) {
        this.selectedRegisted = []
        props.items.forEach(item => {
          if (!item.disabled) {
            this.selectedRegisted.push(item)
          }
        })
      } else this.selectedRegisted = []
    },
    getGatewayList () {
      this.getFloatingList()
      // this.getRegistedList()
    },
    addMacAddress () {
      // Add  registedGwList
      this.selectedFloating.map((row) => {
        if (this.checkDuplicate(this.registedGwList, row.mac_address)) {
          //  row.macAddress = row.mac_address
          this.registedGwList.push(row)
        }
      })
      // Remove Duplicate registedGwList
      this.floatingGwList = this.floatingGwList.filter(row => {
        return this.checkList(this.registedGwList, row.mac_address)
      })
      this.selectedFloating = []
    },
    removeAddress () {
      // Add  selectedFloating
      this.selectedRegisted.map((row) => {
        if (this.checkDuplicate(this.floatingGwList, row.mac_address)) {
        //  row.macAddress = row.mac_address
          this.floatingGwList.push(row)
        }
      })

      // Remove Duplicate floatingGwList
      this.registedGwList = this.registedGwList.filter(row => {
        return this.checkList(this.floatingGwList, row.mac_address)
      })

      this.selectedRegisted = []
    },
    checkList (list, value) {
      let state = false
      Object.keys(list).forEach(key => {
        if (list[key].mac_address === value) {
          state = true
        }
      })
      return !state
    },
    async checkDuplicate (list, value) {
      let state = false
      Object.keys(list).forEach(key => {
        if (list[key].macAddress !== value) {
          state = true
        }
      })
      return state
    },
    getFloatingList () {
      const config = {
        params: {
          company: this.$store.getters['dataStore/GET_SELECTED_STORE'].company,
          mac: this.searchMac
        }
      }
      this.$utils
        .callAxios(
          codes.requests.getFloatingGateway.method,
          codes.requests.getFloatingGateway.url,
          config
        )
        .then(res => {
          if (res.data !== '') {
            this.floatingGwList = res.data
            this.gatewayDetailDialog = true
          } else {
            this.floatingGwList = []
          }
        })
    },
    getRegistedList () {
      const config = {
        params: {
          company: this.$store.getters['dataStore/GET_SELECTED_STORE'].company,
          store: this.$store.getters['dataStore/GET_SELECTED_STORE'].code
        }
      }
      this.$utils
        .callAxios(
          codes.requests.getGateways.method,
          codes.requests.getGateways.url,
          config
        )
        .then(res => {
          if (res.data !== '') {
            this.disabledCount = 0
            this.registedGwList = res.data.gatewayList.map((row) => {
              this.disabledCount += 1
              row.mac_address = row.macAddress
              row.disabled = true
              return row
            })
            this.gatewayDetailDialog = true
          } else {
            this.registedGwList = []
          }
        })
    },
    /*   buildGateway (registedGwList) {
      return registedGwList.map((row) => {
        row.company = this.selectedStore.company
        row.store = this.selectedStore.code
        row.macAddress = row.mac_address
        return row
      })
    }, */
    buildGateway (registedGwList) {
      let macAddress = ''
      registedGwList.map((row) => {
        if (macAddress === '') {
          macAddress = row.mac_address
        } else {
          macAddress += ',' + row.mac_address
        }
      })

      return { gateway: macAddress }
    },
    saveAddGateway () {
      // const gatewayList = this.buildGateway(this.registedGwList)
      const body = this.buildGateway(this.registedGwList)
      const config = {
        params: {
          company: this.$store.getters['dataStore/GET_SELECTED_STORE'].company,
          store: this.$store.getters['dataStore/GET_SELECTED_STORE'].code
        }
      }
      // const body = {
      //   gateway: gatewayList
      // }
      this.$utils
        .callAxiosWithBody(
          codes.requests.addGateway.method,
          codes.requests.addGateway.url,
          body,
          config
        )
        .then(res => {
          if (res.data.responseCode === '200') {
            this.cancelAddGateway()
            this.$emit('fireUpdateGatewayList')
          }
        })
        .catch(error => {
          EventBus.$emit('messageAlert', this.$t(error.response.data.responseMessage))
        })
    }
  }
}
</script>
