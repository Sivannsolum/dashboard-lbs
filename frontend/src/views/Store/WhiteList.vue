<template>
  <div>
    <h2 class="page-title-bar"><i class="ico ico-store"></i>{{$t('Whitelist')}}</h2>
    <v-row class="mt-10">
      <v-col cols="3">
        <v-text-field
          v-model="searchBy.storeNameCode"
          @keyup="searchStores(searchBy.storeNameCode)"
          @click:clear="clearStoreNameCode"
          :label="$t('Store List')"
          :placeholder="$t('Input the store name or code')"
          class="form-input"
          outlined dense hide-details
          clearable
        ></v-text-field>
        <v-data-table
          v-model="selectedStores"
          @click:row="selectStore"
          :headers="storeHeaders"
          :items="stores"
          :item-class="getRowClass"
          :hide-default-footer="true"
          :items-per-page="-1"
          class="tbl-type01 style01 grayline mt-5"
          item-key="code"
          fixed-header
          height="815"
      >
        <template slot="no-data">
          <p>{{ $t('No data available') }}</p>
        </template>
      </v-data-table>
      </v-col>
      <v-col cols="1" class="d-flex justify-center align-center">
        <img src="@/assets/img/ico-next-step.png" alt="" />
      </v-col>
      <v-col cols="8">
        <table class="layout_whitelist">
          <colgroup>
            <col style="width:135px;">
            <col>
          </colgroup>
          <tr>
            <th>{{ $t('Function Setting') }}</th>
            <td class="setting">
              <div class="d-flex align-baseline">
                <v-text-field
                  :value="functionSetting.name"
                  :label="$t('Store Name')"
                  class="form-input"
                  style="width:30%;"
                  disabled
                  outlined dense hide-details
                  clearable
                ></v-text-field>
                <v-select
                  v-model="functionSetting.whiteListEnabled"
                  :items="functionSettingOptions.whitelistEnabled"
                  :label="$t('Enable Whitelist')"
                  item-text="text"
                  item-value="abbr"
                  class="form-select ml-2"
                  style="width:20%;"
                  outlined dense hide-details
                ></v-select>
                <v-text-field
                  v-model="functionSetting.divisionCode"
                  :disabled="divisionCodeDisabled"
                  :label="`${$t('Division Code')}`"
                  class="form-input ml-2"
                  style="width:20%;"
                  outlined dense hide-details
                  clearable
                ></v-text-field>
                <v-btn
                  :disabled="functionSettingDisabled"
                  @click="updateWhitelist"
                  text class="btn ml-2"
                  style="width:20%;"
                >{{ $t('Save') }}
                </v-btn>
              </div>
            </td>
          </tr>
          <tr>
            <th>{{ $t('Whitelist') }}</th>
            <td>
              <div class="d-flex justify-end">
                <v-select
                  v-model="searchBy.id.type"
                  @change="handleSearchTypeChange"
                  :items="searchOptions.id"
                  item-text="text"
                  item-value="abbr"
                  outlined dense hide-details solo
                  class="form-select d-inline-flex"
                  style="max-width:180px;"
                ></v-select>
                <v-text-field
                  v-model="searchBy.id.value"
                  @keyup="handleSearchValueKeyup"
                  @click:clear="handleSearchValueClear"
                  :placeholder="$t(searchByIdPlaceHolder)"
                  class="form-input ml-2"
                  style="max-width:180px;"
                  outlined dense hide-details solo
                  clearable
                ></v-text-field>
              </div>
              <v-data-table
                v-model="selectedWhitelist"
                :headers="whitelistHeaders"
                :items="whitelist"
                :options.sync="options"
                :hide-default-footer="true"
                class="tbl-type01 style01 mt-5"
                item-key="id"
                fixed-header
                height="530"
              >
                <template slot="no-data">
                  <p>
                    {{ $t('No data available') }}
                  </p>
                </template>
              </v-data-table>
              <!-- Button group -->
              <div class="table-options">
                <div>
                  <add-whitelist
                    :addWhitelistDisabled="addWhitelistDisabled"
                    @addWhitelist="addWhitelist"
                  />
                  <delete-whitelist
                    :deleteWhitelistDisabled="deleteWhitelistDisabled"
                    @deleteWhitelist="deleteWhitelist"
                  />
                  <v-btn
                    :disabled="exportBtnDisabled"
                    @click="exportWhitelistList"
                    text class="btn-s ml-2"
                  >{{ $t('Export') }}
                  </v-btn>
                </div>
                <!-- pagination -->
                <div>
                  <div class="pageInfo">{{ whitelistPageInfoText }}</div>
                  <v-pagination
                    v-model="whitelistPage"
                    @input="whitelistPaging"
                    :length="whitelistTotalPages*1"
                    :total-visible="whitelistTotalVisiblePages"
                    color="#2f3b4c"
                  >
                  </v-pagination>
                </div>
              </div>
            </td>
          </tr>
        </table>
      </v-col>
    </v-row>
    <a ref="link" :style="{ display:'none' }" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import EventBus from '@/plugins/eventBus'
import codes from '@/plugins/codes'
import commons from '@/plugins/commons'
import { exportFiles } from '@/plugins/exporter'
import { setTempObj, getTempObj } from '@/plugins/sessionStorageManager'

import AddWhitelist from './modal/AddWhitelist'
import DeleteWhitelist from './modal/DeleteWhitelist'

export default {
  components: {
    AddWhitelist,
    DeleteWhitelist
  },
  data () {
    return {
      user: null,
      selectedStore: null,
      requestConfig: {},
      stores: [],
      selectedStores: [],
      functionSetting: {},
      functionSettingOptions: {
        whitelistEnabled: [
          { text: 'On', abbr: 'Enable' },
          { text: 'Off', abbr: 'Disable' }
        ]
      },
      options: null,
      whitelist: [],
      selectedWhitelist: [],
      whitelistPage: 1,
      whitelistTotalPages: 1,
      whitelistPageInfoText: '',
      whitelistTotalVisiblePages: 5,
      whitelistOptions: {},
      totalWhitelist: null,
      searchBy: {
        storeNameCode: '',
        id: {
          type: 'label',
          value: ''
        }
      },
      ROW_CLASS: 'row-class',
      saveAddDeleteDisabled: false,
      exportDisabled: false
    }
  },
  computed: {
    storeHeaders () {
      return [
        { text: this.$t('STORE NAME'), align: 'center', value: 'nameCode' }
      ]
    },
    whitelistHeaders () {
      return [
        { text: '#', sortable: false, align: 'center', value: 'no' },
        { text: this.$t('LABEL ID'), sortable: false, value: 'label' },
        { text: this.$t('MAC ID'), sortable: false, value: 'mac' },
        { text: this.$t('REGISTER TIME'), sortable: false, value: 'updateTime' }
      ]
    },
    searchOptions () {
      return {
        id: [
          { text: this.$t('LABEL ID'), abbr: 'label', originalText: 'LABEL ID' },
          { text: this.$t('MAC ID'), abbr: 'mac', originalText: 'MAC ID' }
        ]
      }
    },
    ...mapGetters({
      store: 'dataStore/GET_SELECTED_STORE'
    }),
    isSearching () {
      return (this.searchBy.storeNameCode !== null && this.searchBy.storeNameCode.length > 0)
    },
    searchByIdPlaceHolder () {
      let searchBy = this.searchOptions.id.find(x => x.abbr === this.searchBy.id.type).originalText
      searchBy = searchBy.replace('LABEL', 'label')
      return `Input the ${searchBy}`
    },
    whitelistEnabled () {
      return (this.functionSetting.whiteListEnabled === this.functionSettingOptions.whitelistEnabled[0].abbr)
    },
    functionSettingDisabled () {
      return (this.saveAddDeleteDisabled)
    },
    addWhitelistDisabled () {
      return (this.selectedStore === null || this.selectedStore === undefined || !this.whitelistEnabled || this.saveAddDeleteDisabled)
    },
    deleteWhitelistDisabled () {
      return (this.selectedStore === null || this.selectedStore === undefined || !this.whitelistEnabled || this.saveAddDeleteDisabled || this.whitelist.length < 1)
    },
    exportBtnDisabled () {
      return (this.whitelist.length < 1 || !this.whitelistEnabled || this.exportDisabled)
    },
    divisionCodeDisabled () { return !this.whitelistEnabled }
  },
  watch: {
    options: {
      handler () {
        if (this.selectedStore !== null && this.selectedStore !== undefined) {
          this.getWhitelist(1, this.selectedStore.code)
          this.whitelistPage = 1
        }
      },
      deep: true
    },
    store: {
      handler () {
        if (this.selectedStore) {
          this.getWhitelist(1, this.selectedStore.code)
          this.whitelistPage = 1
        }
      }
    },
    searchBy: {
      handler (newSearchBy) {
        const whitelist = {
          searchBy: newSearchBy
        }
        setTempObj('whitelist', whitelist)
      },
      deep: true
    }
  },
  methods: {
    getFunctionSetting (storeCode) {
      const params = { account: this.user.account, company: this.user.company, store: storeCode }
      const config = { params }
      return this.$utils
        .callAxios(
          codes.requests.getFunctionSetting.method,
          codes.requests.getFunctionSetting.url,
          config
        )
        .then(res => {
          return res.data
        })
    },
    async setFunctionSetting (storeCode) {
      const functionSetting = await this.getFunctionSetting(storeCode)
      functionSetting.whiteListEnabled = (functionSetting.whiteListEnabled === true)
        ? this.functionSettingOptions.whitelistEnabled[0].abbr
        : this.functionSettingOptions.whitelistEnabled[1].abbr
      this.functionSetting = functionSetting
    },
    whitelistPaging () {
      this.getWhitelist(this.whitelistPage, this.selectedStore.code)
    },
    getPageInfoText: function (headers) {
      if (headers['x-totalelements'] === 0) return '0 to 0, 0 in total'
      return `${headers['x-number'] * 1 * headers['x-size'] + 1} 
      to ${(headers['x-number'] * 1 * headers['x-size']) + headers['x-total-count'] * 1},
       ${headers['x-totalelements'] * 1} in total`
    },
    resetWhitelist () {
      this.getWhitelist(1, this.selectedStore.code)
      this.whitelistPage = 1
      this.selectedWhitelists = []
    },
    claerWhitelist () {
      this.selectedStore = null
      this.whitelist = []
      this.functionSetting = []
    },
    saveRequestConfig: function (config) {
      const requestConfig = {
        url: config.url,
        method: config.method,
        params: config.params
      }
      this.requestConfig = requestConfig
    },
    exportWhitelistList () {
      if (this.whitelist.length < 1) {
        EventBus.$emit('messageAlert', this.$t('No data to export.'))
        return
      }
      exportFiles(this.requestConfig, this.$refs.link, 'WhiteList.xlsx')
    },
    insertIndex (list, headers) {
      let idx = Number(headers['x-number'] * headers['x-size']) + 1
      list = list.map(el => {
        el.no = idx
        el.updateTime = commons.convertDate(el.updateTime)
        idx++
        return el
      })
      return list
    },
    handleGetWhitelistResponse (res) {
      if (res.status === 204) {
        this.handleGetWhitelistError('No content')
        return
      }
      this.saveRequestConfig(res.config)
      // Refresh articels
      this.whitelist = this.insertIndex(res.data.whiteList, res.headers)
      this.totalwhitelist = this.whitelist.length
      // Pagination
      this.whitelistPageInfoText = this.getPageInfoText(res.headers)
      this.whitelistTotalPages = res.headers['x-totalpages']
      this.selectedwhitelist = []
    },
    handleGetWhitelistError (error) {
      this.whitelist = []
      this.totalwhitelist = this.whitelist.length
      const headers = {}
      headers['x-totalelements'] = 0
      this.whitelistPageInfoText = this.getPageInfoText(headers)
      this.whitelistTotalPages = 0
      this.selectedWhitelist = []
      console.log(error)
    },
    getWhitelistSortKey (sortKey) {
      switch (sortKey) {
        case 'updateTime': sortKey = 'updateTime'
          break
        default: break
      }
      return sortKey
    },
    buildParmas () {
      const { sortBy, sortDesc, itemsPerPage } = this.options
      const params = { account: this.user.account, company: this.user.company }
      let sort = null
      if (sortBy.length === 1 && sortDesc.length === 1) {
        const sortKey = this.getWhitelistSortKey(sortBy[0])
        const sortOrder = sortDesc[0]
        sort = `${sortKey},${sortOrder ? 'desc' : 'asc'}`
      }
      if (sort !== null) params.sort = sort
      if (itemsPerPage > 0) params.size = itemsPerPage
      if (this.searchBy.id.value !== null &&
      this.searchBy.id.value !== undefined &&
      this.searchBy.id.value.length > 0) {
        // 검색하는 경우
        params.searchType = this.searchBy.id.type
        params.search = this.searchBy.id.value
      }
      return params
    },
    getWhitelist (page, storeCode) {
      const params = this.buildParmas()
      params.store = storeCode
      if (page !== null) params.page = page - 1
      const config = { params: params }
      this.$utils
        .callAxios(
          codes.requests.getWhitelist.method,
          codes.requests.getWhitelist.url,
          config
        )
        .then(res => {
          this.handleGetWhitelistResponse(res)
        })
        .catch(error => {
          this.handleGetWhitelistError(error)
        })
    },
    searchStores (storeNameCode) {
      const stores = this.user.managedStores.filter(store => {
        return (store.code.includes(storeNameCode) || store.name.includes(storeNameCode))
      })
      this.stores = this.addStoreNameCode(stores)
      this.claerWhitelist()
    },
    addStoreNameCode (stores) {
      return stores.map(store => {
        store.nameCode = `${store.name}(${store.code})`
        return store
      })
    },
    // whiteListFetchType: "NONE", "ADD", "DELETE"
    putWhitelist (whiteListFetchType, labelList, callback = () => {}) {
      if (commons.isNull(this.selectedStore)) {
        EventBus.$emit('messageAlert', this.$t('Select the store.'))
        return
      }
      const params = { company: this.user.company, store: this.selectedStore.code }
      const config = { params }
      const reqBody = {
        whiteListEnable: this.functionSetting.whiteListEnabled,
        divisionCode: String(this.functionSetting.divisionCode),
        whiteListFetchType,
        labelCodeList: labelList
      }
      this.$utils
        .callAxiosWithBody(
          codes.requests.updateWhitelist.method,
          codes.requests.updateWhitelist.url,
          reqBody,
          config
        )
        .then(res => {
          const result = res.data
          EventBus.$emit('messageAlert', this.$t(result.responseMessage))
          this.resetWhitelist()
          this.setFunctionSetting(this.selectedStore.code)
          callback()
        })
        .catch(error => {
          console.log(error)
          EventBus.$emit('messageAlert', this.$t('Failed to update the whitelist information'))
        })
    },
    updateWhitelist () {
      const whitelist = this.whitelist.map(wl => wl.label)
      this.putWhitelist(codes.whitelistFetchType.none, whitelist)
    },
    addWhitelist (labelList) {
      const callback = () => EventBus.$emit('fireCancelAddWhitelist')
      this.putWhitelist(codes.whitelistFetchType.add, labelList, callback)
    },
    deleteWhitelist (labelList) {
      const callback = () => EventBus.$emit('fireCancelDeleteWhitelist')
      this.putWhitelist(codes.whitelistFetchType.delete, labelList, callback)
    },
    resetWhitelistSearchInput () {
      this.searchBy.id.type = this.searchOptions.id[0].abbr
      this.searchBy.id.value = null
    },
    deselectStore () {
      this.stores.map(str => {
        str.selected = false
        return str
      })
    },
    async selectStore (store) {
      this.stores.map(str => {
        str.selected = false
        return str
      })
      store.selected = true
      this.stores = [...this.stores]
      this.selectedStore = store
      this.setFunctionSetting(store.code)
      this.getWhitelist(1, store.code)
      this.resetWhitelistSearchInput()
    },
    getRowClass (item) {
      if (item.selected) return `${this.ROW_CLASS} active`
      return this.ROW_CLASS
    },
    clearStoreNameCode () {
      this.searchBy.storeNameCode = ''
      this.searchStores(this.searchBy.storeNameCode)
    },
    handleSearchTypeChange () {
      this.searchWhitelist(this.searchBy.id.value)
    },
    handleSearchValueKeyup (e) {
      // Only 0~9, a~f are allowed to be entered.
      const labelIdFilter = /[ㄱ-ㅎㅏ-ㅣ가-힣g-zG-Z~!@#$%^&*()\-=+_';<>/.`:",[]?|{}]/gi
      e.target.value = e.target.value.toUpperCase().replace(labelIdFilter, '')
      this.searchBy.id.value = e.target.value
      this.searchWhitelist()
    },
    handleSearchValueClear () {
      this.searchBy.id.value = ''
      this.searchWhitelist()
    },
    searchWhitelist () {
      this.whitelistPage = 1
      this.getWhitelist(1, this.selectedStore.code)
    }
  },
  created () {
    this.user = this.$store.state.auth.user
  },
  mounted () {
    this.$store.dispatch('dataStore/UPDATE_SELECTED_STORE', this.$store.getters['dataStore/GET_SELECTED_STORE'])
    this.stores = this.addStoreNameCode(Object.assign([], this.$store.getters['dataStore/GET_STORE_ITEMS']))
    this.$store.dispatch('auth/getDisabledBtn', '7200').then(flag => {
      this.saveAddDeleteDisabled = flag
    })
    this.$store.dispatch('auth/getDisabledBtn', '7201').then(flag => {
      this.exportDisabled = flag
    })
    window.onload = () => {
      this.deselectStore()
    }
    const whitelistSessionData = getTempObj('whitelist')
    if (!commons.isNull(whitelistSessionData) && !commons.isNull(whitelistSessionData.searchBy)) {
      this.searchBy = whitelistSessionData.searchBy
      if (!commons.isNull(this.searchBy.storeNameCode)) this.searchStores(this.searchBy.storeNameCode)
    }
  },
  destroyed () {
    this.deselectStore()
  }
}
</script>

<style scoped>
  .layout_whitelist{width:100%; margin-top:85px; border-collapse: collapse;}
  .layout_whitelist th{background:#ededee; font-weight:400; color:#4d4f5c; font-size:14px;}
  .layout_whitelist td{padding:25px 25px 0 25px; vertical-align:top;}
  .layout_whitelist td.setting{height:115px; padding-bottom:25px;}
  .layout_whitelist tr:nth-of-type(1) th,
  .layout_whitelist tr:nth-of-type(1) td{border-bottom:2px solid #cfd1d7;}
  .scrollTable{height:calc(100% - 85px); overflow-y:auto;}
  .grayline{border:1px solid #b7b7b7}
  .tbl-type01{word-break:break-all;}

  .tbl-type01 >>> .row-class:hover { cursor: pointer; }
  .tbl-type01 >>> .row-class.active {font-weight:700;}
</style>
