<template>
  <div>
    <h2 class="page-title-bar">
      <i class="ico ico-store"></i>{{ $t('Store Info') }}
    </h2>
    <!-- 검색창 -->
    <div class="searchArea">
      <v-text-field
        v-for="searchInput of searchInputs.text"
        :key="searchInput.name"
        v-model="searchInput.value"
        @keyup.enter="searchStores()"
        :label="$t(searchInput.label)"
        :placeholder="$t(getPlaceholder(searchInput))"
        outlined
        dense
        hide-details
        class="form-input ml-3"
        clearable
      ></v-text-field>
      <v-select
        v-for="(searchInput, idx) of searchInputs.select"
        :key="searchInput.name"
        v-model="searchInput.value"
        @change="setSelectableAreaNames(idx)"
        :label="$t(searchInput.label)"
        :placeholder="$t(getPlaceholder(searchInput))"
        :items="searchInput.options"
        :no-data-text="$t('No data available')"
        class="form-select ml-3"
        outlined
        dense
        hide-details
        clearable
      ></v-select>
      <v-btn @click="searchStores()" class="btn type-search ml-3" text
        >{{ $t('Search') }}
      </v-btn>
    </div>
    <!-- Store List -->
    <v-data-table
      v-model="selected"
      item-key="store"
      :headers="storeHeaders"
      :items="tableItems"
      :hide-default-footer="true"
      :options.sync="options"
      :server-items-length="totalStores"
      :single-select="singleSelect"
      class="tbl-type01 mt-10"
      show-select
    >
      <template slot="no-data">
        <p>
          {{ $t('No data available') }}
        </p>
      </template>
      <template v-slot:[`item.storeName`]="{ item }">
        <popupSummary
          :user="user"
          :item="item"
          :buttonDisabled="popupDisabled"
          @fireGetStores="initiateStoreInfoPage(1)"
        ></popupSummary>
      </template>
      <template v-slot:[`item.setting`]="{ item }">
        <store-settings-modal
          :user="user"
          :store="item"
          :countries="areas"
          :timezones="timezones"
          :buttonDisabled="buttonDisabled"
          :areaAddDisabled="areaAddDisabled"
          @fireGetStores="initiateStoreInfoPage(page)"
        />
      </template>
    </v-data-table>
    <!-- Button group -->
    <div class="table-options">
      <div>
        <popupAddSummary
          :user="user"
          :buttonDisabled="buttonDisabled"
          :areaAddDisabled="areaAddDisabled"
          @fireGetStores="initiateStoreInfoPage(1)"
        ></popupAddSummary>
        <v-btn
          :class="{ hidden: SingleUser }"
          :disabled="btnDisabledDelete"
          @click="deleteStores()"
          class="btn ml-2"
          text
          >{{ $t('Delete') }}
        </v-btn>
        <v-btn
          @click="exportStores()"
          :disabled="exportDisabled"
          :class="{ hidden: SingleUser }"
          class="btn ml-2"
          text
          >{{ $t('Export') }}
        </v-btn>
      </div>
      <!-- Pagination -->
      <div>
        <div class="pageInfo">{{ pageInfoText }}</div>
        <div class="pagination2">
          <v-text-field
            v-model="goToPageInput"
            class="form-input noneline"
            placeholder="Page"
            outlined
            dense
            hide-details
            solo
            @keyup.enter="goToPage(goToPageInput, paging, totalPages)"
          ></v-text-field>

          <button
            @click="goToPage(goToPageInput, paging, totalPages)"
            type="button"
            class="btnGoToPage"
          >
            <i
              class="v-icon notranslate mdi mdi-chevron-right theme--light"
              aria-hidden="true"
            >
            </i>
          </button>
          <!-- 페이지 앞 뒤 이동 -->
          <button
            @click="goTenPageBackwards(page, paging)"
            :class="page < 10 ? 'pagination-nav-disabled' : null"
            class="pagination-nav pagination-nav-prev"
            type="button"
          >
            <img
              src="@/assets//img/ico-paging-prev.png"
              alt="이전 10페이지 이동"
            />
          </button>
          <v-pagination
            v-model="page"
            @input="paging"
            :length="totalPages * 1 || 1"
            :total-visible="10"
            color="#2f3b4c"
            style="display: block;"
          ></v-pagination>
          <button
            @click="goTenPageForward(page, paging, totalPages)"
            :class="page + 10 > totalPages ? 'pagination-nav-disabled' : null"
            class="pagination-nav pagination-nav-next"
            type="button"
          >
            <img
              src="@/assets//img/ico-paging-next.png"
              alt="다음 10페이지 이동"
            />
          </button>
        </div>
      </div>
    </div>
    <a ref="link" :style="{ display: 'none' }" />
  </div>
</template>

<script>
import popupAddSummary from './modal/StorePopupAddSummary'
import popupSummary from './modal/StorePopupSummary'
import storeSettingsModal from './modal/StoreSettingsModal'
import { exportFiles } from '@/plugins/exporter'
import { setTempObj, getTempObj } from '@/plugins/sessionStorageManager'

import EventBus from '@/plugins/eventBus'
import commons from '@/plugins/commons'
import codes from '@/plugins/codes'
// Mixins
import Pagenation from '@/mixins/Pagenation'

const msg = {
  areaSelection: {
    addCountry: 'Add Country.',
    addRegion: 'Add Region.',
    addCity: 'Add City.'
  }
}

export default {
  name: 'StoreInfo',
  mixins: [Pagenation],
  components: {
    popupSummary,
    popupAddSummary,
    storeSettingsModal
  },
  data () {
    return {
      productionType: process.env.VUE_APP_PRODUCTION_TYPE,
      selectedStore: this.$store.getters['dataStore/GET_SELECTED_STORE'],
      user: null,
      areas: [],
      countries: [],
      timezones: [],
      page: 1,
      totalPages: 0,
      totalVisiblePages: 5,
      itemsPerPage: 10,
      pageInfoText: '',
      goToPageInput: null,
      totalStores: null,
      options: {},
      selected: [],
      SingleUser: true,
      singleSelect: false,
      search: '',
      popupDisabled: false,
      buttonDisabled: false,
      areaAddDisabled: false,
      requestConfig: {
        url: '',
        method: '',
        params: {
          sort: null
        }
      },
      searchInputs: {
        text: [
          {
            name: 'Store Code',
            label: 'Store Code',
            key: 'store',
            value: '',
            placeholderType: 'input'
          },
          {
            name: 'Store Name',
            label: 'Store Name',
            key: 'name',
            value: '',
            placeholderType: 'input'
          }
        ],
        select: [
          {
            name: 'Country',
            key: 'country',
            value: '',
            options: [],
            placeholderType: 'select'
          },
          {
            name: 'Region',
            key: 'region',
            value: '',
            options: [],
            placeholderType: 'select'
          },
          {
            name: 'City',
            key: 'city',
            value: '',
            options: [],
            placeholderType: 'select'
          }
        ]
      },
      tableItems: [],
      storeCode: '',
      exportDisabledByAuth: false
    }
  },
  computed: {
    storeHeaders () {
      return [
        { text: this.$t('STORE CODE'), value: 'store', width: '12%' },
        { text: this.$t('STORE NAME'), value: 'storeName' },
        { text: this.$t('COUNTRY'), value: 'country', width: '10%' },
        { text: this.$t('REGION'), value: 'region', width: '10%' },
        { text: this.$t('CITY'), value: 'city', width: '10%' },
        {
          text: this.$t('LABEL'),
          value: 'labelCount',
          sortable: false,
          width: '10%'
        },
        {
          text: this.$t('GATEWAY'),
          value: 'gatewayCount',
          sortable: false,
          width: '10%'
        },
        {
          text: this.$t('STORE SETTING'),
          align: 'center',
          value: 'setting',
          sortable: false,
          width: '10%'
        }
      ]
    },
    btnDisabledDelete () {
      let btnDisabled = this.buttonDisabled
      if (!btnDisabled) {
        btnDisabled = this.selected.length < 1
      }
      return btnDisabled
    },
    exportDisabled () {
      return this.tableItems.length < 1 || this.exportDisabledByAuth
    }
  },
  watch: {
    options: {
      handler () {
        this.getStores(1)
        this.page = 1
      },
      deep: true
    },
    searchInputs: {
      handler (newSearchInputs) {
        const storeInfo = {
          searchInputs: newSearchInputs
        }
        setTempObj('storeInfo', storeInfo)
      },
      deep: true
    }
  },
  created () {
    this.user = this.$store.state.auth.user
    this.SingleUser = this.user.serverType === 'SINGLE' //  || CENTRAL
    this.setAreas()
  },
  mounted () {
    //  Store Info : Detail Popup
    this.$store.dispatch('auth/getDisabledBtn', '7100').then(flag => {
      this.popupDisabled = flag
    })
    //  Store Info : Add / Delete / Setting
    this.$store.dispatch('auth/getDisabledBtn', '7101').then(flag => {
      this.buttonDisabled = flag
    })
    //  Store Info : Export
    this.$store.dispatch('auth/getDisabledBtn', '7102').then(flag => {
      this.exportDisabledByAuth = flag
    })
    //  Store Info : Export
    this.$store.dispatch('auth/getDisabledBtn', '7103').then(flag => {
      this.areaAddDisabled = flag
    })
    EventBus.$emit('enableSelectedStores', false)
    this.initiateStoreInfoPage(1)
  },
  methods: {
    getAreas () {
      const config = { params: { company: this.user.company } }
      return this.$utils
        .callAxios(
          codes.requests.getAreas.method,
          codes.requests.getAreas.url,
          config
        )
        .then(res => {
          return res.data.areaParamList
        })
    },
    paging (page = this.page) {
      this.page = Number(page)
      this.goToPageInput = page

      this.getStores(this.page)
    },
    searchStores () {
      this.getStores(1)
    },
    validate (val) {
      return val !== null && val !== undefined && val.length > 0
    },
    buildSearchParams (params) {
      const inputs = [...this.searchInputs.text, ...this.searchInputs.select]
      for (const input of inputs) {
        if (this.validate(input.value) && input.key === 'name') {
          params.storeName = input.value
          continue
        }
        if (this.validate(input.value) && input.value !== ' ') {
          params[input.key] = input.value
        }
      }
      return params
    },
    buildParmas: function () {
      const { sortBy, sortDesc, itemsPerPage } = this.options
      let params = { account: this.user.account, company: this.user.company }
      params = this.buildSearchParams(params)
      let sort = null
      if (sortBy.length === 1 && sortDesc.length === 1) {
        const sortKey = sortBy[0]
        const sortOrder = sortDesc[0]
        sort = `${sortKey},${sortOrder ? 'desc' : 'asc'}`
      }
      if (sort !== null) params.sort = sort
      if (itemsPerPage > 0) params.size = itemsPerPage
      return params
    },
    getStores (page) {
      const params = this.buildParmas()
      if (page !== null) params.page = page - 1
      const config = { params }
      if (this.productionType === 'cloud') {
        if (this.selectedStore.company) {
          params.company = this.selectedStore.company
          params.account = this.$store.state.auth.user.account
        } else {
          params.company = this.$store.state.auth.user.company
        }
      }
      this.$utils
        .callAxios(
          codes.requests.getStores.method,
          codes.requests.getStores.url,
          config
        )
        .then(res => {
          if (res.status === 204) {
            res.headers['x-totalelements'] = 0
            res.headers['x-totalpages'] = 0
            res.data = { stores: [] }
          }
          this.saveRequestConfig(res.config)
          this.tableItems = res.data.stores
          this.totalStores = res.data.stores.length
          // Pagination
          this.pageInfoText = this.getPageInfoText(res.headers)
          this.totalPages = res.headers['x-totalpages']
          this.selected = []
        })
    },
    saveRequestConfig: function (config) {
      const requestConfig = {
        url: config.url,
        method: config.method,
        params: config.params
      }
      this.requestConfig = requestConfig
    },
    exportStores () {
      if (this.tableItems.length < 1) {
        EventBus.$emit('messageAlert', this.$t('No data to export.'))
        return
      }
      exportFiles(this.requestConfig, this.$refs.link, 'StoreList.xlsx')
    },
    getPageInfoText: function (headers) {
      if (headers['x-totalelements'] === 0) return '0 to 0, 0 in total'
      return `${headers['x-number'] * 1 * headers['x-size'] + 1} 
      to ${headers['x-number'] * 1 * headers['x-size'] +
        headers['x-total-count'] * 1},
       ${headers['x-totalelements'] * 1} in total`
    },
    getPlaceholder (input) {
      let placeholder = ''
      switch (input.placeholderType) {
        case 'select':
          placeholder = `Select the ${input.name.toLowerCase()}`
          break
        case 'input':
          placeholder = `Input the ${input.name.toLowerCase()}`
          break
        default:
          placeholder = `Input the ${input.name.toLowerCase()}`
          break
      }
      return placeholder
    },
    buildDeleteStoreReqBody (selected) {
      const reqBody = {}
      reqBody.storeList = selected.map(store => store.store)
      return reqBody
    },
    async deleteStores () {
      if (this.user.lbsEnable === 'true') {
        // User의 LBS 사용여부가 가능인경우, 우선 LBS 설정을 삭제후 성공 여부에 따라서 Store도 삭제.
        const lbsConfigDeleted = await this.deleteLbsConfiguration()
        if (lbsConfigDeleted === true) this.deleteStore()
      } else {
        this.deleteStore()
      }
    },
    async deleteLbsConfiguration () {
      const storeIds = this.selected.map(store => store.store)
      const params = { company: this.user.company }
      const config = { params }

      let state = true
      for await (const storeId of storeIds) {
        params.store = storeId
        const url = `${codes.requests.deleteLbsConfiguration.url}/${storeId}`
        state = await this.$utils
          .callAxios(codes.requests.deleteLbsConfiguration.method, url, config)
          .then(res => {
            return true
          })
          .catch(error => {
            EventBus.$emit(
              'messageAlert',
              this.$t(error.response.data.responseMessage)
            )
            return false
          })
        if (state === false) break
      }
      return state
    },
    deleteStore () {
      const reqBody = this.buildDeleteStoreReqBody(this.selected)
      const config = { params: {}, data: reqBody }
      if (this.productionType === 'cloud') {
        config.params.company = this.$store.getters[
          'dataStore/GET_SELECTED_STORE'
        ].company
      }
      this.$utils
        .callAxios(
          codes.requests.deleteStores.method,
          codes.requests.deleteStores.url,
          config
        )
        .then(res => {
          EventBus.$emit('messageAlert', this.$t(res.data.responseMessage))
          this.selected = []
          this.page--
          this.getStores(this.page)
          // 선택된 스토어를 삭제시 선택된 스토어 클리어
          const selectedStore = this.$store.state.dataStore.selectedStore
          if (config.data.storeList.includes(selectedStore.code)) {
            this.$store.dispatch('dataStore/UPDATE_SELECTED_STORE', {})
          }
          // Refresh ManagedStores
          EventBus.$emit('setManagedStores')
        })
    },
    getArea (areas, areaName) {
      if (areas[areaName] !== undefined) return areas[areaName]
      areas[areaName] = {}
      return areas[areaName]
    },
    loadStoreLocations (stores) {
      if (!commons.isAllValid(stores)) return []
      const countries = {}
      for (const store of stores) {
        const country = this.getArea(countries, store.country)
        const region = this.getArea(country, store.region)
        this.getArea(region, store.city)
      }
      return countries
    },
    getAreaMsg (idx) {
      return Object.values(msg.areaSelection)[idx]
    },
    getAreaNames (area) {
      if (area !== null && area !== undefined) return [...Object.keys(area)]
    },
    getSelectableAreaNames (areaNames = [], inputs, areas, idx, length) {
      if (idx === length - 1) return areaNames
      // Find selected value's children.
      if (areas === undefined) {
        for (let i = idx + 1; i < length; i++) {
          areaNames.push([])
        }
        return areaNames
      } else {
        areaNames[idx] = this.getAreaNames(areas[inputs[idx].value]) || []
      }
      return this.getSelectableAreaNames(
        areaNames,
        inputs,
        areas[inputs[idx].value],
        ++idx,
        length
      )
    },
    setSelectableAreaNames (inputIdx) {
      const areaNames = this.getSelectableAreaNames(
        [],
        this.searchInputs.select,
        this.countries,
        0,
        this.searchInputs.select.length
      )

      for (let idx = 0; idx < areaNames.length; idx++) {
        // Show processed data.
        this.searchInputs.select[idx + 1].options = areaNames[idx]
      }
      for (let i = 1; i < this.searchInputs.select.length; i++) {
        // Empty every child node's value.
        if (i > inputIdx) this.searchInputs.select[i].value = ''
      }
    },
    getTimezones () {
      const config = { params: {} }
      return this.$utils
        .callAxios(
          codes.requests.getTimezones.method,
          codes.requests.getTimezones.url,
          config
        )
        .then(res => {
          return res.data.timezoneList
        })
    },
    async setAreas () {
      const areas = await this.getAreas()
      this.areas = this.loadStoreLocations(areas)
    },
    getUserDetails () {
      if (this.productionType === 'cloud') {
        const config = {
          params: {
            company: this.user.company,
            account: this.$store.state.auth.user.account,
            isLoginResponse: true
          }
        }
        return this.$utils
          .callAxios(
            codes.requests.getCloudStores.method,
            codes.requests.getCloudStores.url,
            config
          )
          .then(res => {
            return res.data.managedStores
          })
      } else {
        const config = {
          params: { company: this.user.company, account: this.user.account }
        }
        return this.$utils
          .callAxios(
            codes.requests.getUserDetails.method,
            codes.requests.getUserDetails.url,
            config
          )
          .then(res => {
            return res.data.managedStores
          })
      }
    },
    setPrevSearchInputValues (searchInputs, prevSearchInputs) {
      for (const inputsIdx in searchInputs) {
        searchInputs[inputsIdx] = searchInputs[inputsIdx].map(
          (searchInput, inputIdx) => {
            searchInput.value = prevSearchInputs[inputsIdx][inputIdx].value
            return searchInput
          }
        )
      }
      return searchInputs
    },
    async initiateStoreInfoPage (page) {
      const managedStores = await this.getUserDetails()
      this.countries = this.loadStoreLocations(managedStores)
      this.searchInputs.select[0].options = this.getAreaNames(this.countries)
      this.searchInputs.select[0].value = null
      getTempObj('storeInfo')
      // 검색한 적이 있다면 이전 검색어를 불러옴
      const storeInfoSessionData = getTempObj('storeInfo')
      if (
        !commons.isNull(storeInfoSessionData) &&
        !commons.isNull(storeInfoSessionData.searchInputs)
      ) {
        this.searchInputs = this.setPrevSearchInputValues(
          this.searchInputs,
          storeInfoSessionData.searchInputs
        )
      }
      this.getTimezones().then(timezones => {
        this.timezones = timezones.map(timezone => timezone.name)
      })
      this.getStores(page)
    }
  }
}
</script>
<style scoped>
.hidden {
  display: none;
}
</style>
