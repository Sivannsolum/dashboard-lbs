<template>
  <div>
    <h2 class="page-title-bar">
      <i class="ico ico-label"></i>{{ $t('Label Info') }}
    </h2>
    <!-- 검색창: Template 이름검색 -->
    <section class="searchArea">
      <v-text-field
        v-model="searchBy.labelParam"
        @keyup="handleSearchLabelIdKeyUp"
        :style="{ width: '14.5%', marginLeft: '0 !important' }"
        :label="$t('Label ID')"
        :placeholder="$t('Input the label ID')"
        class="form-input ml-4"
        outlined
        dense
        hide-details
        clearable
      ></v-text-field>
      <v-text-field
        v-model="searchBy.gatewayParam"
        @keyup.enter="clickSearch()"
        :label="$t('Linked Gateway')"
        :placeholder="$t('Input the gateway ID')"
        class="form-input ml-3"
        outlined
        dense
        hide-details
        clearable
      ></v-text-field>
      <v-select
        v-model="searchBy.typeParam"
        :items="typeItems"
        :label="$t('Type')"
        :placeholder="$t('Input the type')"
        class="form-select ml-3"
        clearable
        outlined
        dense
        persistent-hint
        hide-details
        style="width:150px"
      ></v-select>
      <v-select
        v-model="searchBy.statusParam"
        :items="statusItems"
        :label="$t('Status')"
        :placeholder="$t('Input the status')"
        item-value="value"
        item-text="text"
        class="form-select ml-3"
        outlined
        dense
        hide-details
        clearable
        style="width:150px"
      ></v-select>
      <v-text-field
        v-model="searchBy.templateParam"
        @keyup.enter="clickSearch()"
        :style="{ width: '14%' }"
        :label="$t('Template Name')"
        :placeholder="$t('Input the template name')"
        class="form-input ml-3"
        outlined
        dense
        hide-details
        clearable
      ></v-text-field>
      <v-btn
        @click="clickSearch()"
        class="btn type-search ml-3"
        text
        style="width:120px"
        >{{ $t('Search') }}
      </v-btn>
    </section>

    <!-- 결과 내 찾기 Checkboxs -->
    <div class="opt-result d-flex justify-end align-center">
      <p>{{ $t('In-Result Search') }}</p>
      <v-checkbox
        hide-details
        :label="`${$t('Offline')}`"
        class="form-checkbox ml-4"
        v-model="searchParam.network"
        value="false"
        @change="clickCheckBox"
      ></v-checkbox>
      <v-checkbox
        hide-details
        :label="`${$t('Low Battery')}`"
        class="form-checkbox ml-4"
        v-model="searchParam.battery"
        value="BAD"
        @change="clickCheckBox"
      ></v-checkbox>
      <v-checkbox
        hide-details
        :label="`${$t('Bad Signal')}`"
        class="form-checkbox ml-4"
        v-model="searchParam.signal"
        value="BAD"
        @change="clickCheckBox"
      ></v-checkbox>
      <!-- MisusedLabels -->
      <v-checkbox
        hide-details
        :label="`${$t('Misused')}`"
        class="form-checkbox ml-4"
        v-model="searchParam.misusedLabelType"
        value="All"
        @change="clickCheckBox"
      ></v-checkbox>
    </div>
    <!-- Label List -->
    <v-data-table
      v-model="selected"
      :headers="labelHeaders"
      :items="labelItems"
      :item-class="getRowClass"
      :hide-default-footer="true"
      item-key="id"
      show-select
      :options.sync="options"
      class="tbl-type01"
      :items-per-page="10"
      @click:row="openLabelModal"
    >
      <template slot="no-data">
        <p>
          {{ $t('No data available') }}
        </p>
      </template>
      <template v-slot:[`item.battery`]="{ item }">
        <p v-bind:class="batteryStyle(item.battery)">{{ item.battery }}</p>
      </template>
      <template v-slot:[`item.network`]="{ item }">
        <p class="text-center">
          <i
            class="state-icon"
            v-bind:class="networkStatusStyle(item.network)"
          ></i>
        </p>
      </template>
      <template v-slot:[`item.status`]="{ item }">
        <p v-bind:class="statusStyle(item.status)">{{ item.status }}</p>
      </template>
    </v-data-table>
    <!-- Label detail popup -->
    <popupLabel
      :item="detailItem"
      :labelDetailDisabled="btnDisabledDetail"
      @updateLabelList="searchLabelList"
    ></popupLabel>
    <!-- Button group -->
    <div class="table-options">
      <div>
        <v-btn
          @click="unassignLabels"
          :disabled="btnDisabledDelete || checkSelected"
          text
          class="btn"
          >{{ $t('Unassign') }}</v-btn
        >
        <BlinkPopup
          :selectedLabel="selectedLabel"
          :btnDisabledBlinking="btnDisabledBlinking || checkSelected"
        />
        <v-btn
          @click="exportLabelList"
          :disabled="btnDisabledExport || btnDisabledExportCheckList"
          text
          class="btn ml-2"
          >{{ $t('Export') }}</v-btn
        >
        <div>
          <v-dialog v-model="messageDialog" width="300">
            <v-card
              class="popup add_store_popup"
              align="center"
              justify="center"
            >
              <v-row>
                <v-col>
                  <span v-text="messageText"></span>
                </v-col>
              </v-row>
              <v-card-actions class="d-flex justify-center">
                <v-btn
                  text
                  icon
                  @click=";(messageDialog = false), searchLabelList()"
                  class="btn"
                  >OK</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </div>
      <!-- Pagination -->
      <!-- <div class="table-options"> -->
      <!-- 특정 페이지 이동 -->
      <!-- <div class="pageInfo">{{ pageInfoText }}</div>
        <div class="pagination-wrap">
          <div class="page-input">
            <v-text-field
              v-model="goToPageInput"
              class="form-input noneline"
              placeholder="Page"
              outlined dense hide-details solo
            ></v-text-field>
            <button
              @click="goToPage(goToPageInput, paging, pageCount)"
              type="button"
            >
              <i
                class="v-icon notranslate mdi mdi-chevron-right theme--light"
                aria-hidden="true"
              >
              </i>
            </button>
          </div> -->
      <!-- 페이지 앞 뒤 이동 -->
      <!-- <div class="pagination">
            <button
              @click="goTenPageBackwards(pageIndex, paging)"
              class="pagination-nav pagination-nav-prev pagination-nav-disapled"
              type="button"
            >
              <img src="@/assets//img/ico-paging-prev.png" alt="이전 10페이지 이동" />
            </button>
            <v-pagination
              v-model="pageIndex"
              @input="paging"
              :length="pageCount*1 || 1"
              :total-visible="10"
              color="#2f3b4c"
            ></v-pagination>
            <button
              @click="goTenPageForward(pageIndex, paging, pageCount)"
              class="pagination-nav pagination-nav-next"
              type="button"
            >
              <img src="@/assets//img/ico-paging-next.png" alt="다음 10페이지 이동" />
            </button>
          </div>
        </div> -->
      <div>
        <div class="pageInfo">{{ pageInfoText }}</div>
        <v-pagination
          v-model="pageIndex"
          :length="pageCount"
          :total-visible="7"
          color="#2f3b4c"
          @input="paging"
        ></v-pagination>
      </div>
    </div>
    <a ref="link" :style="{ display: 'none' }" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// Utility
import EventBus from '@/plugins/eventBus'
import commons from '@/plugins/commons'
import { exportFiles } from '@/plugins/exporter'
import { setTempObj, getTempObj } from '@/plugins/sessionStorageManager'
// Components
import popupLabel from './modal/LabelPopupLabel'
import BlinkPopup from './modal/LabelBlinkPopup'
// Mixins
// import Pagenation from '@/mixins/Pagenation'

const requests = {
  unassignLabel: {
    method: 'post',
    url: '/api/common/labels/unlink'
  }
}

export default {
  name: 'LabelInfo',
  // mixins: [Pagenation],
  components: {
    popupLabel,
    BlinkPopup
  },
  data () {
    return {
      productionType: process.env.VUE_APP_PRODUCTION_TYPE,
      selected: [],
      page: 0,
      pageIndex: 1,
      pageCount: 0,
      pageInfoText: null,
      requestConfig: {},
      searchParam: {
        company: null,
        store: null,
        label: null,
        template: null,
        network: null,
        battery: null,
        signal: null,
        page: null,
        size: '10',
        sort: 'code,asc',
        misusedLabelType: null // API 기능 동작 확인후 수정 필요
      },
      options: {},
      // dialog : popup
      dialog1: false,
      dialog_popupLabel: false,
      dialogLabelBlinkPopup: false,
      labelItems: [],
      typeItems: [],
      detailItem: {},

      // 조회 조건
      searchBy: {
        labelParam: null,
        gatewayParam: null,
        statusParam: null,
        typeParam: null,
        templateParam: null
      },

      // 버튼 권한
      btnDisabledDelete: null,
      btnDisabledBlinking: null,
      btnDisabledExport: null,
      btnDisabledDetail: null,

      ROW_CLASS: 'row-class',
      messageDialog: false,
      messageText: null
    }
  },
  computed: {
    labelHeaders () {
      return [
        {
          text: this.$t('LABEL ID'),
          sortable: true,
          value: 'id',
          width: '10%'
        },
        {
          text: this.$t('LINKED GATEWAY'),
          sortable: false,
          value: 'gateway',
          width: '15%'
        }, // 09.27 텍스트 수정
        {
          text: this.$t('BATTERY'),
          sortable: false,
          value: 'battery',
          width: '10%'
        },
        {
          text: this.$t('SIGNAL STRENGTH'),
          sortable: false,
          value: 'signal',
          width: '10%'
        },
        { text: this.$t('TYPE'), sortable: true, value: 'type', width: '15%' },
        {
          text: this.$t('NETWORK'),
          sortable: false,
          value: 'network',
          align: 'center',
          width: '10%'
        },
        {
          text: this.$t('STATUS'),
          sortable: false,
          value: 'status',
          width: '10%'
        },
        { text: this.$t('LATEST RESPONSE TIME'), sortable: true, value: 'time' } // 09.24 텍스트 수정
      ]
    },
    statusItems () {
      return [
        {
          value: 'SUCCESS',
          text: this.$t('SUCCESS')
        },
        {
          value: 'PROCESSING',
          text: this.$t('PROCESSING')
        },
        {
          value: 'TIMEOUT',
          text: this.$t('TIMEOUT')
        },
        {
          value: 'UNASSIGNED',
          text: this.$t('UNASSIGNED')
        }
      ]
    },
    selectedLabel () {
      return this.selected.map(element => element.id)
    },
    selectedStore () {
      return this.$store.getters['dataStore/GET_SELECTED_STORE'].code
    },
    btnDisabledExportCheckList () {
      var flag = true
      if (this.labelItems.length) flag = false
      return flag
    },
    checkSelected () {
      var flag = true
      if (this.selected.length) flag = false
      return flag
    },
    ...mapGetters({ store: 'dataStore/GET_SELECTED_STORE' })
  },
  watch: {
    options (val) {
      const columnInfo = {
        id: 'code',
        type: 'type',
        time: 'lastResponseTime'
      }
      let sortParam = null
      if (val.sortBy.length && val.sortDesc[0]) {
        sortParam = columnInfo[val.sortBy[0]] + ',DESC'
      } else if (val.sortBy.length && !val.sortDesc[0]) {
        sortParam = columnInfo[val.sortBy[0]] + ',ASC'
      }
      if (!commons.isNull(sortParam)) this.searchParam.sort = sortParam
      this.page = 0
      this.searchLabelList()
    },
    selectedStore () {
      // 공통 Store 선택시 초기화 하지 않음.
      this.page = 0
      this.getTypeItems()
      this.searchLabelList()
    },
    searchBy: {
      handler (newSearchBy) {
        const labelInfo = {
          searchBy: newSearchBy
        }
        setTempObj('labelInfo', labelInfo)
      },
      deep: true
    }
  },
  mounted () {
    // button 권한 체크
    this.$store.dispatch('auth/getDisabledBtn', '2100').then(flag => {
      this.btnDisabledDelete = flag
    })
    this.$store.dispatch('auth/getDisabledBtn', '2101').then(flag => {
      this.btnDisabledBlinking = flag
    })
    this.$store.dispatch('auth/getDisabledBtn', '2102').then(flag => {
      this.btnDisabledExport = flag
    })
    this.$store.dispatch('auth/getDisabledBtn', '2103').then(flag => {
      this.btnDisabledDetail = flag
    })

    // Overview 에서 redirect된 경우, 검색조건을 다시 설정.
    if (commons.notEmpty(this.$route.params)) {
      this.resetSearchBy()
      this.setRouterSearchCondition(this.$route)
    } else {
      // 이전 검색조건 설정.
      this.initData()
      this.setLastSearchCondition()
    }
    this.searchParam.company = this.$store.state.auth.user.company
    EventBus.$emit('enableSelectedStores', true)

    if (this.store === undefined || !this.store.code) {
      EventBus.$emit('openSelectedStores')
    } else {
      this.clickSearch()
      this.getTypeItems()
    }
  },
  methods: {
    initData () {
      this.searchParam = {
        company: null,
        store: null,
        label: null,
        template: null,
        network: null,
        battery: null,
        signal: null,
        page: null,
        size: '10',
        sort: 'code,asc',
        misusedLabelType: null
      }
      this.page = 0
      this.searchBy = {
        labelParam: null,
        gatewayParam: null,
        statusParam: null,
        typeParam: null,
        templateParam: null
      }
    },
    openLabelModal (item) {
      if (this.btnDisabledDetail) return
      this.detailItem = item
      EventBus.$emit('getLabelDetailPopupDataValues', item)
      EventBus.$emit('openLabelDetail')
    },
    handleSearchLabelIdKeyUp (e) {
      this.labelParam = e.target.value.replaceAll(' ', '')
      if (e.code === 'Enter') this.clickSearch()
    },
    clickSearch () {
      this.page = 0
      this.searchParam.label = this.searchBy.labelParam
      if (this.searchBy.gatewayParam) {
        this.searchParam.gateway = this.searchBy.gatewayParam
      } else delete this.searchParam.gateway
      if (this.searchBy.typeParam) {
        this.searchParam.type = this.searchBy.typeParam
      } else delete this.searchParam.type
      if (this.searchBy.statusParam) {
        this.searchParam.status = this.searchBy.statusParam
      } else delete this.searchParam.status
      this.searchParam.template = this.searchBy.templateParam
      this.searchLabelList()
    },
    searchLabelList () {
      this.selected = []
      if (!this.$store.getters['dataStore/IS_SELECTED_STORE']) {
        EventBus.$emit('openSelectedStores')
        return
      }
      const searchParam = this.searchParam
      for (const key of Object.keys(searchParam)) {
        if (commons.isNull(searchParam[key])) delete searchParam[key]
      }
      const url = '/api/common/labels'
      const config = { params: this.searchParam }
      config.params.store = this.$store.state.dataStore.selectedStore.code
      config.params.page = this.page
      if (this.productionType === 'cloud') {
        config.params.company = this.$store.state.auth.user.company
      }

      this.$utils.callAxios('get', url, config).then(res => {
        this.saveRequestConfig(res.config)
        const headers = res.headers
        if (res.data) {
          this.labelItems = res.data.labelList.map(resData => {
            const obj = {}
            obj.id = resData.labelCode
            if (resData.gateway) {
              obj.gateway = resData.gateway.name
            } else {
              obj.gateway = '-'
            }
            obj.battery = resData.battery
            obj.signal = resData.signal
            obj.type = resData.type // 수정필요
            obj.network = resData.networkStatus
            obj.status = resData.updateStatus
            if (resData.lastResponseTime) {
              obj.time = commons.convertDate(resData.lastResponseTime)
            } else obj.time = '-'
            return obj
          })
        } else this.labelItems = []
        if (headers['x-total-count'] === '0') {
          this.pageInfoText = '0 in total'
          this.pageIndex = 1
          this.pageCount = 1
        } else {
          this.pageInfoText =
            headers['x-number'] * 1 * headers['x-size'] +
            1 +
            ' to ' +
            (headers['x-number'] * 1 * headers['x-size'] +
              this.labelItems.length) +
            ', ' +
            headers['x-totalelements'] * 1 +
            ' in total'

          this.pageIndex = headers['x-number'] * 1 + 1
          this.pageCount = headers['x-totalpages'] * 1
        }
      })
    },
    networkStatusStyle (networkStatus) {
      return networkStatus ? 'bg-stable' : 'bg-danger'
    },
    batteryStyle (battery) {
      if (battery === 'GOOD') return 'txt-stable'
      else if (battery === 'BAD') return 'txt-danger'
      else return 'txt-caution' // NONE 인경우
    },
    statusStyle (status) {
      if (status === 'TIMEOUT') return 'txt-danger'
      else return null
    },
    getTypeItems () {
      const store = this.selectedStore
      const url = '/api/common/labels/type'
      const config = {
        params: {
          company: this.$store.state.auth.user.company,
          store: store
        }
      }
      this.$utils.callAxios('get', url, config).then(res => {
        this.typeItems = res.data.labelTypeList
      })
    },
    unassignLabels () {
      const config = {
        params: {
          company: this.$store.state.auth.user.company,
          store: this.selectedStore
        }
      }
      const body = {
        unAssignList: this.selected.map(labelData => labelData.id)
      }
      this.$utils
        .callAxiosWithBody(
          requests.unassignLabel.method,
          requests.unassignLabel.url,
          body,
          config
        )
        .then(res => {
          if (res.status === 200) {
            const msg = res.data.responseMessage.split(' ')
            const labelId = msg.pop()
            this.messageText = `${this.$t(msg.join(' '))} ${labelId}`
            this.messageDialog = true
            this.paging(1)
            this.$forceUpdate()
          }
        })
        .catch(error => {
          console.debug(`Failed to unassign labels. error: ${error}`)
          this.messageText = this.$t('Unassigning failed.')
          this.messageDialog = true
        })
    },
    deleteLabels () {
      const url = '/api/common/labels'
      const config = {
        params: {
          company: this.$store.state.auth.user.company,
          store: this.selectedStore
        },
        data: {
          labelList: this.selected.map(labelData => labelData.id)
        }
      }
      this.$utils
        .callAxios('delete', url, config)
        .then(res => {
          if (res.status === 200) {
            this.messageText = res.data.responseMessage
            this.messageDialog = true
          }
        })
        .catch(error => {
          console.debug(`Failed to unassign labels. error: ${error}`)
          this.messageText = this.$t('Unassigning failed.')
          this.messageDialog = true
        })
    },
    paging (input) {
      this.page = input * 1 - 1
      this.searchLabelList()
    },
    clickCheckBox () {
      this.page = 0
      this.searchLabelList()
    },
    saveRequestConfig: function (config) {
      const requestConfig = {
        url: config.url,
        method: config.method,
        params: config.params
      }
      this.requestConfig = requestConfig
    },
    getRowClass () {
      if (this.btnDisabledDetail) return ''
      return this.ROW_CLASS
    },
    exportLabelList () {
      exportFiles(this.requestConfig, this.$refs.link, 'LabelList.xlsx')
    },
    setRouterSearchCondition (router) {
      if (commons.isAllInvalid([...Object.values(router.params)])) {
        // 검색조건 설정없으면 전체 라벨 표출.
        console.log('initData')
        return
      }
      if (!commons.isNull(router.params.status)) {
        this.searchBy.statusParam = router.params.status
        this.searchParam.status = router.params.status
      }
      if (!commons.isNull(router.params.network)) {
        this.searchParam.network = router.params.network
      }
      if (!commons.isNull(router.params.battery)) {
        this.searchParam.battery = router.params.battery
      }
      if (!commons.isNull(router.params.signal)) {
        this.searchParam.signal = router.params.signal
      }
      if (!commons.isNull(router.params.misusedLabelType)) {
        this.searchParam.misusedLabelType = router.params.misusedLabelType
      }
    },
    setLastSearchCondition () {
      const labelInfoSessionData = getTempObj('labelInfo')
      if (
        !commons.isNull(labelInfoSessionData) &&
        !commons.isNull(labelInfoSessionData.searchBy)
      ) {
        this.searchBy = labelInfoSessionData.searchBy
      }
    },
    resetSearchBy () {
      this.searchBy = {
        labelParam: null,
        gatewayParam: null,
        statusParam: null,
        typeParam: null,
        templateParam: null
      }
    }
  }
}
</script>
<style>
.row-class:hover {
  cursor: pointer;
}
</style>
