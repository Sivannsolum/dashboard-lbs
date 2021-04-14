<template>
  <v-dialog
    v-model="show"
    width="800"
    @click:outside="cancelAddGateway()"
  >
    <v-card class="popup add_store_popup">
      <h3 class="page-title-bar"><i class="ico ico-gateway"></i>{{$t('Add Gateway')}}</h3>

      <p class="label-txt">{{$t('Register Type')}}</p>
      <v-radio-group
        row
        dense
        hide-details
        v-model="radioValue"
        class="form-radio-group"
      >
        <v-radio
          hide-details
          :label="`${$t('Scan')}`"
          value="Scan"
          class="form-radio flat"
        ></v-radio>
        <v-radio
          hide-details
          :label="`${$t('Direct')}`"
          value="Direct"
          class="form-radio flat"
        ></v-radio>
      </v-radio-group>
      <!-- 병합 임시 -->
      <!-- scan type 일때 노출 -->
      <div v-if="radioValue === registerType.scan">
        <!-- 검색 -->
        <div class="searchArea flexable">
          <v-text-field
            v-model="scanData.startIp"
            :rules="[rules.ip]"
            outlined
            dense
            hide-details
            :label="`${$t('Start')} *`"
            :placeholder="`${$t('Input the start IP')}`"
            class="form-input"
            clearable
          ></v-text-field>
          <v-text-field
            v-model="scanData.endIp"
            :rules="[rules.ip]"
            outlined
            dense
            hide-details
            :label="`${$t('End')}*`"
            :placeholder="`${$t('Input the last IP')}`"
            class="form-input ml-1"
            clearable
          ></v-text-field>
          <v-select
            v-model="scanData.uriScheme"
            :items="scanOptions.uriSchemes"
            @change="setPortByProtocol(scanData)"
            outlined
            dense
            hide-details
            :label="`${$t('Protocol Type')}`"
            :placeholder="`${$t('Select the protocol type')}`"
            class="form-select ml-1"
            style="width:110px"
          ></v-select>
          <v-text-field
            v-model="scanData.port"
            outlined
            dense
            hide-details
            :label="`${$t('Port')}`"
            :placeholder="`${$t('Select the port')}`"
            class="form-select ml-1"
            type="number"
            style="width:110px"
          ></v-text-field>

          <v-btn @click="scanGateways()" text class="btn type-search ml-1">{{ $t('Scan') }}</v-btn>
        </div>

        <v-data-table
          v-model="scanSelected"
          :headers="scanHeaders"
          :items="scannedGateways"
          :page.sync="page"
          :hide-default-footer="true"
          disable-pagination
          item-key="ip"
          show-select
          fixed-header
          height="275"
          class="tbl-type01 flat-type02 mt-5"
        >
          <template slot="no-data">
            <p>
              {{ $t('No data available') }}
            </p>
          </template>
        </v-data-table>

        <v-card-actions class="d-flex justify-center">
          <v-btn text icon @click="registerScannedGateways" class="btn">{{$t('Register')}}</v-btn>
          <v-btn text icon @click="cancelAddGateway" class="btn">{{$t('Cancel')}}</v-btn>
        </v-card-actions>
      </div>

      <!-- direct type 일때 노출 -->
      <div v-else>
        <!-- 검색 -->
        <div class="searchArea flexable">
          <v-select
            v-model="directData.code"
            :items="directOptions.codes"
            @change="handleCodeChange"
            item-text="text"
            item-value="abbr"
            outlined
            dense
            hide-details
            :label="`${$t('Code')} *`"
            :placeholder="`${$t('Choose the code')}`"
            class="form-select selected"
          ></v-select>
          <v-text-field
            v-model="directData.gateway"
            :rules="getDirectRuleByCode()"
            ref="directAddress"
            outlined
            dense
            hide-details
            :placeholder="`${$t('Input the Address')}`"
            class="form-input ml-1"
            clearable
          ></v-text-field>
          <v-select
            v-model="directData.uriScheme"
            :items="directOptions.uriSchemes"
            @change="setPortByProtocol(directData)"
            :disabled="macSelected"
            outlined
            dense
            hide-details
            :label="`${$t('Protocol Type')}`"
            :placeholder="`${$t('Select the protocol type')}`"
            class="form-select ml-1"
            style="width:110px"
          ></v-select>
          <v-text-field
            v-model="directData.port"
            outlined
            dense
            hide-details
            :label="`${$t('Port')}`"
            :placeholder="`${$t('Select the port')}`"
            class="form-select ml-1"
            type="number"
            style="width:110px"
          ></v-text-field>

          <v-btn @click="addDirectGateway()" text class="btn type-search ml-1">{{$t('Add')}}</v-btn>
        </div>

        <v-data-table
          v-model="directSelected"
          :headers="directHeaders"
          :items="directGateways"
          item-key="gateway"
          show-select
          :hide-default-footer="true"
          fixed-header
          height="275"
          class="tbl-type01 flat-type02 mt-5"
        >
          <template slot="no-data">
            <p>
              {{ $t('No data available') }}
            </p>
          </template>
          <template v-slot:[`item.del`]="{ item }">
            <v-btn
              @click="removeDirectGateway(item)"
              text
              icon
              ><img src="@/assets/img/ico-delete2.png" alt=""
            /></v-btn>
          </template>
        </v-data-table>

        <v-card-actions class="d-flex justify-center">
          <v-btn text icon @click="registerDirectGateways()" class="btn">{{$t('Register')}}</v-btn>
          <v-btn text icon @click="cancelAddGateway()" class="btn">{{$t('Cancel')}}</v-btn>
        </v-card-actions>
      </div>

    </v-card>
  </v-dialog>
</template>

<script>
import EventBus from '@/plugins/eventBus.js'
import commons from '@/plugins/commons'

export default {
  props: {
    value: Boolean
  },
  data () {
    return {
      registerType: {
        scan: 'Scan',
        direct: 'Direct'
      },
      rules: {
        required: value => !!value || 'Required.',
        ip: value => ((/^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\.(?!$)|$)){4}$/g.test(value)) || value === null) || 'Invalid IP addres.',
        mac: value => ((/^[A-Za-z0-9]{16}$/g.test(value)) || value === null) || 'Invalid MAC address.'
      },
      directRule: [],
      requests: {
        addGateway: {
          method: 'post',
          url: '/api/common/gateway'
        },
        scanGateway: {
          method: 'get',
          url: '/api/common/gateway/scangateway'
        }
      },
      user: null,
      scanData: { code: 'ip', startIp: null, endIp: null, uriScheme: 'HTTP', port: '80' },
      directData: { code: 'ip', gateway: null, uriScheme: 'HTTP', port: '80' },
      initialScanData: {},
      initialdirectData: {},
      radioValue: 'Scan',
      page: 1,
      pageCount: 0,
      scanSelected: [],
      directSelected: [],
      scanned: 0, // Means literally the number of scanned gateways
      scannedGateways: [], // Are scanned and shown to the user
      directGateways: [],
      indexedDirectGateways: [],
      scanOptions: {
        uriSchemes: ['HTTP', 'HTTPS'],
        ports: ['80', '443']
      }
    }
  },
  computed: {
    scanHeaders () {
      return [
        { text: this.$t('IP ADDRESS'), align: 'center', value: 'ip' },
        { text: this.$t('MAC ID'), align: 'center', value: 'mac' }
      ]
    },
    directHeaders () {
      return [
        { text: this.$t('IP ADDRESS'), align: 'center', value: 'ip' },
        { text: this.$t('MAC ID'), align: 'center', value: 'mac' },
        { text: this.$t('DELETE'), align: 'center', value: 'del' }
      ]
    },
    directOptions () {
      return {
        codes: [
          { text: this.$t('IP Address'), abbr: 'ip' },
          { text: this.$t('MAC ID'), abbr: 'mac' }
        ],
        uriSchemes: ['HTTP', 'HTTPS'],
        ports: ['80', '443']
      }
    },
    show: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    macSelected () {
      return this.directData.code === this.directOptions.codes[1].abbr
    }
  },
  methods: {
    copy (data) {
      return JSON.parse(JSON.stringify(data))
    },
    resetInputs () {
      this.scanData = this.copy(this.initialScanData)
      this.directData = this.copy(this.initialDirectData)
    },
    cancelAddGateway () {
      this.show = false
      this.radioValue = this.registerType.scan
      this.directGateways = []
      this.scannedGateways = []
      this.scanSelected = []
      this.directSelected = []
      this.resetInputs()
    },
    async handleCodeChange () {
      // Set HTTPS, 443 when the address type is mac.
      const directOptions = this.directOptions
      if (this.directData.code === directOptions.codes[1].abbr) {
        this.directData.uriScheme = directOptions.uriSchemes[1]
        this.directData.port = directOptions.ports[1]
      } else {
        this.directData.uriScheme = directOptions.uriSchemes[0]
        this.directData.port = directOptions.ports[0]
      }
      this.$nextTick(() => {
        this.$refs.directAddress.validate()
      })
    },
    makeTableIndex () {
      this.indexedDirectGateways = this.directGateways.map(
        (items, index) => ({
          ...items,
          index: index + 1
        }))
    },
    toggleAddGateway () {
      this.show = !this.show
    },
    showGatewayScanResult () {
      EventBus.$emit('toggleLoadingModal', '')
      if (this.scanned < 1) EventBus.$emit('messageAlert', this.$t('No gateway found'))
      this.scanned = 0
    },
    // scanData: { code: 'ip', startIp: '', endIp: '', uriScheme: '', port: '' },
    scanOneGateway (ip, port, protocol, hasNext) {
      const config = {
        params: {
          company: this.$store.state.auth.user.company,
          ip: ip,
          port: port,
          protocol: protocol
        }
      }
      this.$utils
        .callAxios(
          this.requests.scanGateway.method,
          this.requests.scanGateway.url,
          config
        )
        .then(res => {
          const gateway = res.data
          if (
            gateway !== null &&
            gateway !== '' &&
            gateway !== undefined
          ) {
            const parsedScanResult = this.parseScanResult(gateway)
            // Prevent the function from scanning existing GWs.
            if (this.scannedGateways.find(gw => gw.gateway === parsedScanResult.gateway) === undefined) {
              this.scannedGateways.push(parsedScanResult)
              this.scanned++
            }
          }
        })
        .finally(() => {
          if (!hasNext) {
            this.showGatewayScanResult()
          }
        })
    },
    convertGatewayMacAddr (mac) {
      mac = mac.replace('FFFE', '').split('')
      let macAddr = ''
      for (let i = 1; i < mac.length + 1; i++) {
        macAddr += mac[i - 1]
        if (i % 2 === 0 && i !== mac.length) macAddr += '-'
      }
      return macAddr
    },
    parseScanResult (scanResult) {
      const gateway = {
        ip: scanResult.ip,
        mac: this.convertGatewayMacAddr(scanResult.mac),
        gateway: scanResult.ip,
        code: this.scanData.code,
        port: this.scanData.port,
        uriScheme: this.scanData.uriScheme
      }
      return gateway
    },
    addIp (startIp, idx) {
      if (startIp[idx] === 255) {
        startIp[idx] = 0
        return this.addIp(startIp, idx - 1)
      } else {
        startIp[idx]++
        return startIp
      }
    },
    checkIpRange (startIp, endIp) {
      // 123.123.123.123 => 123123123123
      startIp = startIp.split('.').join('')
      endIp = endIp.split('.').join('')
      if (startIp.length > endIp.length) {
        while (startIp.length === endIp.length) endIp += '0'
      } else if (startIp.length < endIp.length) {
        while (startIp.length === endIp.length) startIp += '0'
      }
      return (Number(startIp) > Number(endIp))
    },
    scanGateways () {
      // IP addr validation check
      const scanData = this.scanData
      if (!this.hasValidAddress({ code: scanData.code, gateway: scanData.startIp })) {
        EventBus.$emit('messageAlert', this.$t('The value does not match the IP address format'))
        return
      }
      if (!this.hasValidAddress({ code: scanData.code, gateway: scanData.endIp })) {
        EventBus.$emit('messageAlert', this.$t('The value does not match the IP address format'))
        return
      }
      if (this.checkIpRange(scanData.startIp, scanData.endIp)) {
        EventBus.$emit('messageAlert', this.$t('The last IP is lower than the start IP.'))
        return
      }
      // Scan gateways
      // '123.123.123.123' => [123,123,123,123]
      let startIp = scanData.startIp.split('.').map(ip => Number(ip))
      const endIp = scanData.endIp.split('.').map(ip => Number(ip))
      const idx = 3 // 0, 1, 2, 3 = ip addr consists of three parts.
      let hasNext = true
      EventBus.$emit('toggleLoadingModal', 'Scanning Gateways...')
      while (hasNext) {
        hasNext = (startIp.toString() !== endIp.toString())
        this.scanOneGateway(startIp.join('.'), scanData.port, scanData.uriScheme, hasNext)
        startIp = this.addIp(startIp, idx)
      }
    },
    checkIpAddr (ip) {
      const ipRegex = /^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\.(?!$)|$)){4}$/
      if (!ipRegex.test(ip)) return false
      return true
    },
    checkMacAddr (mac) {
      const macRegex = /^[A-Za-z0-9]{16}$/
      if (!macRegex.test(mac)) return false
      return true
    },
    hasValidAddress (gatewayData) {
      if (gatewayData.code === 'ip') {
        return this.checkIpAddr(gatewayData.gateway)
      } else {
        return this.checkMacAddr(gatewayData.gateway)
      }
    },
    addDirectGateway () {
      const directData = this.directData
      const isValidData = commons.isValidData(directData)
      if (!isValidData.result) {
        EventBus.$emit('messageAlert', this.$t(isValidData.msg))
        return
      }
      if (!this.hasValidAddress(directData)) {
        EventBus.$emit('messageAlert', this.$t('The address is invalid.'))
        return
      }
      if (directData.code === 'ip') {
        directData.ip = directData.gateway
      } else {
        directData.mac = directData.gateway
      }
      if (this.directGateways.find(gw => gw.gateway === directData.gateway) !== undefined) {
        EventBus.$emit('messageAlert', this.$t('The Gateway already exists.'))
        return
      }
      this.directGateways.push(directData)
      this.directData = {
        code: '', gateway: '', uriScheme: '', port: ''
      }
      // this.makeTableIndex()
    },
    removeDirectGateway (directData) {
      // this.indexedDirectGateways.splice(this.indexedDirectGateways.indexOf(directData), 1)
      // delete directData.index
      this.directGateways.splice(this.directGateways.indexOf(directData), 1)
      // this.makeTableIndex()
    },
    toDashLessMacAddr (mac) {
      if (!commons.isValidStr(mac)) return
      const macAddress = mac.replaceAll('-', '')
      return `${macAddress.substring(0, 6)}FFFE${macAddress.substring(6, 13)}`
    },
    buildGateway (gatewayData) {
      const gateway = {
        code: gatewayData.code,
        gateway: gatewayData.gateway,
        port: gatewayData.port,
        uriScheme: gatewayData.uriScheme
      }
      return gateway
    },
    registerGateway (gatewayData) {
      const gatewayToAdd = this.buildGateway(gatewayData)
      const params = {
        store: this.$store.getters['dataStore/GET_SELECTED_STORE'].code,
        company: this.$store.state.auth.user.company
      }
      const config = { params: params }
      return this.$utils
        .callAxiosWithBody(
          this.requests.addGateway.method,
          this.requests.addGateway.url,
          gatewayToAdd,
          config
        )
        .then(res => {
          if (res.data.responseCode === '200') return gatewayToAdd.gateway
          return false
        })
        .catch(error => {
          console.log(error)
          return false
        })
    },
    async registerGateways (gateways) {
      if (gateways.length < 1) {
        EventBus.$emit('messageAlert', this.$t('Select the gateway to add.'))
        return
      }
      const registeredGateways = []
      for (const gateway of gateways) {
        const gatewayRegistered = await this.registerGateway(gateway)
        if (gatewayRegistered) registeredGateways.push(gatewayRegistered)
      }
      if (registeredGateways.length > 0) {
        EventBus.$emit(`${registeredGateways.toString()} gateways are registered.`)
      } else {
        EventBus.$emit('messageAlert', this.$t('Failed to register gateways.'))
      }
      this.cancelAddGateway()
      this.$emit('fireResetCondition')
    },
    registerDirectGateways () {
      this.registerGateways(this.directSelected)
    },
    registerScannedGateways () {
      this.registerGateways(this.scanSelected)
    },
    setPortByProtocol (data) {
      if (data.uriScheme === this.scanOptions.uriSchemes[0]) {
        data.port = this.scanOptions.ports[0]
      } else {
        data.port = this.scanOptions.ports[1]
      }
    },
    getDirectRuleByCode () {
      if (this.directData.code === this.directOptions.codes[0].abbr) return [this.rules.ip]
      return [this.rules.mac]
    }
  },
  create () {
    this.user = this.$store.state.auth.user
  },
  mounted () {
    this.initialScanData = this.copy(this.scanData)
    this.initialDirectData = this.copy(this.directData)
  }
}
</script>
