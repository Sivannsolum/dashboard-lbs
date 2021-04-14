<template>
  <div>
    <h2 class="page-title-bar"><i class="ico ico-gateway"></i>{{ $t('Gateway Info') }}</h2>
    <div class="searchArea">
      <v-text-field
        v-model="search.ip"
        @keyup.enter="updateGatewayList(1)"
        :label="$t('IP Address')"
        :placeholder="$t('Input the IP address')"
        class="form-input"
        clearable
        outlined
        dense
        hide-details
      ></v-text-field>
      <v-text-field
        v-model="search.mac"
        @keyup.enter="updateGatewayList(1)"
        :label="$t('MAC ID')"
        :placeholder="$t('Input the MAC ID')"
        class="form-input ml-3"
        outlined
        dense
        hide-details
        clearable
      ></v-text-field>
      <v-select
        v-model="search.network"
        :label="$t('Network')"
        :placeholder="$t('Input the status')"
        :items="searchOptions.network"
        item-text="text"
        item-value="abbr"
        class="form-select ml-3"
        outlined
        dense
        hide-details
      ></v-select>
      <v-btn
        @click="updateGatewayList(1)"
        class="btn type-search ml-3"
        text
      >
      {{ $t('Search') }}
      </v-btn
      >
    </div>
    <v-data-table
      v-model="selected"
      @click:row="detailPopup"
      :headers="gatewayHeaders"
      :hide-default-footer="true"
      :items="gateways"
      :item-class="getRowClass"
      :singleSelect="false"
      :options.sync="options"
      :server-items-length="totalGateways"
      class="tbl-type01 mt-10"
      show-select
      item-key="name"
    >
      <template slot="no-data">
        <p>
          {{ $t('No data available') }}
        </p>
      </template>
      <template v-slot:[`item.networkStatus`]="{ item }">
        <p class="text-center">
          <i
            class="state-icon"
            :class="networkStatusStyle(item.networkStatus)"
          ></i>
        </p>
      </template>
    </v-data-table>
    <detailModal
      v-model="gatewayDetailDialog"
      :gateway="gateway"
      @fireUpdateGatewayList="updateGatewayList(1)"
    />
    <div class="table-options">
      <div>
        <v-btn
          v-if="serverType === 'cloud'"
          @click.stop="addGatewayDialog = true"
          :disabled="notSelectedAdd"
          class="btn"
          text
        >{{ $t('Add') }}
        </v-btn>
        <addCloudModal v-model="addGatewayDialog" />
        <v-btn
          v-if="serverType === 'server'"
          @click.stop="addGatewayDialogServer = true"
          :disabled="addBtnDisabled"
          class="btn ml-2"
          text
        >{{ $t('Add') }}
        </v-btn>
        <addServerModal v-model="addGatewayDialogServer" @fireResetCondition="resetGatewayList" />
        <v-btn
          @click="deleteSelectedGateway"
          :disabled="notSelectedDelete"
          class="btn ml-2"
          text
          >{{ $t('Delete') }}
        </v-btn>
        <v-btn
          @click="rebootSelectedGateway"
          :disabled="notSelectedReboot"
          class="btn ml-2"
          text
          >{{ $t('Reboot') }}
        </v-btn>
        <v-btn @click="exportGatewayList" :disabled="exportDisabled" text class="btn ml-2">{{ $t('Export') }}</v-btn>
      </div>
      <div>
        <div class="pageInfo"> {{ pageInfoText }} </div>
        <v-pagination
          v-model="page"
          @input="paging"
          :length="totalPages"
          :total-visible="totalVisiblePages"
        ></v-pagination>
      </div>
    </div>
    <a ref="link" :style="{ display:'none' }" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import EventBus from '@/plugins/eventBus'
import commons from '@/plugins/commons'
import codes from '@/plugins/codes'
import { exportFiles } from '@/plugins/exporter'
import { setTempObj, getTempObj } from '@/plugins/sessionStorageManager'

import detailModal from './modal/GatewayDetailModal'
import addCloudModal from './modal/AddGatewayModalCloud'
import addServerModal from './modal/AddGatewayModalServer'

export default {
  name: 'GatewayInfo',
  components: {
    detailModal,
    addCloudModal,
    addServerModal
  },
  data () {
    return {
      user: null,
      gatewayDetailDialog: false,
      addGatewayDialog: false,
      addGatewayDialogServer: false,
      btnDisabledDetailed: false,
      btnDisabledAddDelete: false,
      btnDisabledReboot: false,
      btnDisabledExport: false,
      message: '',
      page: 1,
      totalPages: 10,
      totalVisiblePages: 5,
      totalGateways: null,
      options: {},
      pageInfoText: '',
      requestConfig: {},
      selected: [],
      search: {
        network: 'all',
        ip: null,
        mac: null
      },
      gateways: [],
      gateway: {},
      // serverType: process.env.VUE_APP_PRODUCTION_TYPE
      ROW_CLASS: 'row-class',
      serverType: 'server'
    }
  },
  computed: {
    gatewayHeaders () {
      return [
        { text: this.$t('IP ADDRESS'), value: 'ipAddress' },
        { text: this.$t('MAC ID'), value: 'macAddress', width: '15%' },
        { text: this.$t('NTP SERVER IP'), value: 'ntpServerIp', width: '15%', sortable: false },
        { text: this.$t('DISPLAY NO.'), value: 'displayNo', width: '15%', sortable: false },
        { text: this.$t('LABEL'), value: 'labelCount', width: '15%', sortable: false },
        { text: this.$t('NETWORK'), align: 'center', value: 'networkStatus', width: '10%' },
        { text: this.$t('VERSION'), align: 'center', value: 'gwVersion', width: '15%' }
      ]
    },
    searchOptions () {
      return {
        network: [
          { text: this.$t('ALL'), abbr: 'all' },
          { text: this.$t('Online'), abbr: 'online' },
          { text: this.$t('Not Ready'), abbr: 'notready' },
          { text: this.$t('Offline'), abbr: 'offline' }
        ]
      }
    },
    selectedStore () {
      return this.$store.getters['dataStore/GET_SELECTED_STORE'].code
    },
    ...mapGetters({
      store: 'dataStore/GET_SELECTED_STORE'
    }),
    exportDisabled () {
      let btnDisabled = this.btnDisabledExport
      if (!btnDisabled) {
        btnDisabled = (this.gateways === null || this.gateways === undefined || this.gateways.length < 1)
      }
      return btnDisabled
    },
    addBtnDisabled () {
      return this.btnDisabledAddDelete
    },
    notSelectedReboot () {
      let btnDisabled = this.btnDisabledReboot
      if (!btnDisabled) {
        btnDisabled = (this.selected.length < 1)
      }
      return btnDisabled
    },
    notSelectedDelete () {
      let btnDisabled = this.btnDisabledAddDelete
      if (!btnDisabled) {
        btnDisabled = (this.selected.length < 1)
      }
      return btnDisabled
    },
    notSelected () {
      return (this.selected.length < 1)
    }
  },
  watch: {
    options: {
      handler () {
        this.updateGatewayList(1)
        this.page = 1
      },
      deep: true
    },
    store: {
      handler () {
        this.updateGatewayList(1)
        this.page = 1
      }
    },
    search: {
      handler (newSearchBy) {
        const gatewayInfo = {
          search: newSearchBy
        }
        setTempObj('gatewayInfo', gatewayInfo)
      },
      deep: true
    }
  },
  created () {
    this.user = this.$store.state.auth.user
  },
  mounted () {
    // button 권한 체크
    // Gateway Info : Get Detailed
    this.$store.dispatch('auth/getDisabledBtn', '4100').then((flag) => {
      this.btnDisabledDetailed = flag
    })
    // Gateway Info : Add / Delete
    this.$store.dispatch('auth/getDisabledBtn', '4101').then((flag) => {
      this.btnDisabledAddDelete = flag
    })
    // Gateway Info : Reboot
    this.$store.dispatch('auth/getDisabledBtn', '4102').then((flag) => {
      this.btnDisabledReboot = flag
    })
    // Gateway Info : Export
    this.$store.dispatch('auth/getDisabledBtn', '4103').then((flag) => {
      this.btnDisabledExport = flag
    })
    const gatewayInfoSessionData = getTempObj('gatewayInfo')
    if (
      !commons.isNull(gatewayInfoSessionData) &&
      !commons.isNull(gatewayInfoSessionData.search) &&
      (
        !commons.isNull(gatewayInfoSessionData.search.mac) ||
        !commons.isNull(gatewayInfoSessionData.search.ip)
      )
    ) {
      this.search = gatewayInfoSessionData.search
    }
    if (!commons.isNull(this.$route.query.network)) {
      this.resetSearchCondition()
      this.search.network = this.$route.query.network
    }
    EventBus.$emit('enableSelectedStores', true)
    // Store 선택하지 않은경우 사용자에게 Store 선택 요구
    if (!this.store.code) {
      EventBus.$emit('openSelectedStores')
    } else {
      this.updateGatewayList(1)
    }
  },
  methods: {
    resetSearchCondition () {
      this.page = 1
      this.search = { network: 'all', ip: null, mac: null }
    },
    resetGatewayList () {
      this.resetSearchCondition()
      this.updateGatewayList(1)
    },
    paging () { this.updateGatewayList(this.page) },
    saveRequestConfig: function (config) {
      const requestConfig = {
        url: config.url,
        method: config.method,
        params: config.params
      }
      this.requestConfig = requestConfig
    },
    exportGatewayList () {
      exportFiles(this.requestConfig, this.$refs.link, 'GatewayList.xlsx')
    },
    networkStatusStyle (networkStatus) {
      const color = codes.networkStatusColor.get(networkStatus)
      if (commons.isNull(color)) return 'bg-danger'
      return color
    },
    detailPopup (value) {
      if (this.btnDisabledDetailed === true) return
      const config = {
        params: {
          company: this.$store.state.auth.user.company,
          store: this.selectedStore,
          gateway: commons.toDashLessMacAddr(value.macAddress)
        }
      }
      this.$utils
        .callAxios(
          codes.requests.getGatewayDetail.method,
          codes.requests.getGatewayDetail.url,
          config
        )
        .then(res => {
          if (res.data !== '') {
            this.gateway = res.data
            this.gatewayDetailDialog = true
          }
        })
    },
    handleGetGwResponse (res) {
      this.gateways = res.data.gatewayList
      this.saveRequestConfig(res.config)
      if (this.gateways instanceof Array) this.totalGateways = this.gateways.length
      this.pageInfoText = commons.getPageInfoText(res.headers)
      if (commons.isValidStr(res.headers['x-totalpages'])) this.totalPages = res.headers['x-totalpages'] * 1
      this.totalPages = 0
      this.selected = []
    },
    handleGetGwError (error) {
      this.gateways = []
      this.totalGateways = this.gateways.length
      const headers = {}
      headers['x-totalelements'] = 0
      this.pageInfoText = commons.getPageInfoText(headers)
      this.totalPages = 0
      this.selected = []
      console.debug(`Could not find any gateway. ${error}`)
    },
    buildSearchParams (params, search) {
      if (search.network !== null && search.network !== 'all') params.network = search.network
      if (!commons.isNull(search.ip)) params.ip = search.ip
      if (!commons.isNull(search.mac)) params.mac = search.mac
      return params
    },
    getGatewaySortKey (sortKey) {
      switch (sortKey) {
        case 'networkStatus': sortKey = 'state'
          break
        default: break
      }
      return sortKey
    },
    buildGetGatewaysParams () {
      const { sortBy, sortDesc, itemsPerPage } = this.options
      let params = { store: this.store.code }
      let sort = null
      if (commons.isSorting(sortBy, sortDesc)) {
        const sortKey = this.getGatewaySortKey(sortBy[0])
        const sortOrder = sortDesc[0]
        sort = `${sortKey},${sortOrder ? 'desc' : 'asc'}`
      }
      if (sort !== null) params.sort = sort
      if (itemsPerPage > 0) params.size = itemsPerPage
      params = this.buildSearchParams(params, this.search)
      params.company = this.$store.state.auth.user.company
      params.store = this.store.code
      return params
    },
    updateGatewayList (page) {
      if (!this.$store.getters['dataStore/IS_SELECTED_STORE']) EventBus.$emit('openSelectedStores')
      const params = this.buildGetGatewaysParams()
      if (commons.isNull(params.store)) return
      if (page !== null) params.page = page - 1
      const config = { params }
      this.$utils
        .callAxios(
          codes.requests.getGateways.method,
          codes.requests.getGateways.url,
          config
        )
        .then(res => {
          this.handleGetGwResponse(res)
        })
        .catch(error => {
          this.handleGetGwError(error)
        })
    },
    getSelectedMacAddr (selected) {
      const gateways = []
      if (this.selected.length < 1) return
      this.selected.forEach(gateway => {
        const dashLessMacAddr = commons.toDashLessMacAddr(gateway.macAddress)
        gateways.push(dashLessMacAddr)
      })
      return gateways.join(',').toString()
    },
    handleSuccess (res, msg) {
      this.page = 1
      this.selected = []
      EventBus.$emit('toggleLoadingModal', msg)
      EventBus.$emit('messageAlert', this.$t(res.data.responseMessage))
      this.updateGatewayList(1)
    },
    handleError (error, msg) {
      EventBus.$emit('toggleLoadingModal', '')
      EventBus.$emit('messageAlert', this.$t(msg))
      this.updateGatewayList(1)
      console.debug(`Failed to perform the given operation on gateways. ${error}`)
    },
    deleteSelectedGateway: function () {
      if (!this.$store.getters['dataStore/IS_SELECTED_STORE']) {
        EventBus.$emit('openSelectedStores')
        return
      }
      const gateways = this.getSelectedMacAddr(this.selected)
      const config = {
        params: {
          company: this.user.company,
          store: this.selectedStore,
          gateways: gateways
        }
      }
      const msg = this.$t('Deleting Gateways...')
      EventBus.$emit('toggleLoadingModal', msg)
      this.$utils
        .callAxios(
          codes.requests.deleteGateway.method,
          codes.requests.deleteGateway.url,
          config
        )
        .then(res => {
          this.handleSuccess(res, msg)
        })
        .catch(error => {
          this.handleError(error, this.$t('Failed to delete gateways.'))
        })
    },
    getRowClass () { return codes.ROW_CLASS },
    rebootSelectedGateway () {
      if (!this.$store.getters['dataStore/IS_SELECTED_STORE']) {
        EventBus.$emit('openSelectedStores')
        return
      }
      if (this.selected.find(sel => sel.networkStatus === 'DISCONNECTED') !== undefined) {
        EventBus.$emit('messageAlert', this.$t('Disconnected gateways can not be rebooted.'))
        return
      }
      const gateways = this.getSelectedMacAddr(this.selected)
      const config = {
        params: {
          company: this.user.company,
          store: this.selectedStore,
          gateways: gateways
        }
      }
      const msg = 'Rebooting Gateways...'
      EventBus.$emit('toggleLoadingModal', msg)
      this.$utils
        .callAxiosWithBody(
          codes.requests.rebootGateway.method,
          codes.requests.rebootGateway.url,
          {},
          config
        )
        .then(res => {
          this.handleSuccess(res, msg)
        })
        .catch(error => {
          this.handleError(error, this.$t('Failed to reboot gateways.'))
        })
    }
  }
}
</script>
<style>
  .row-class:hover { cursor: pointer; }
</style>
