<template>
  <div>
    <h2 class="page-title-bar">
      <i class="ico ico-product"></i>{{ $t('Update Records') }}
    </h2>
    <!-- 검색창 -->
    <div class="searchArea">
      <v-text-field
        outlined
        dense
        hide-details
        v-model="searchBy.fileName"
        @keyup.enter="searchRecords"
        :label="$t('File Name')"
        :placeholder="$t('Input the File Name')"
        class="form-input ml-3"
        clearable
      ></v-text-field>
      <v-menu
        v-model="showStartDatePicker"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            :value="searchBy.startDate"
            @click:clear="clearDate(searchBy, 'startDate')"
            :label="`${$t('Period')}`"
            :placeholder="`${$t('Input the date')}`"
            class="form-input ml-3"
            v-bind="attrs"
            v-on="on"
            outlined
            dense
            hide-details
            readonly
            clearable
          >
            <template v-slot:append>
              <img width="16" height="16" src="@/assets/img/ico-calendar.png" />
            </template>
          </v-text-field>
        </template>
        <v-date-picker
          v-model="searchBy.startDate"
          @change="checkStartDate"
          @input="showStartDatePicker = false"
          no-title
        ></v-date-picker>
      </v-menu>
      <span class="ml-1 mr-1">~</span>
      <v-menu
        v-model="showEndDatePicker"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            :value="searchBy.endDate"
            @click:clear="clearDate(searchBy, 'endDate')"
            v-bind="attrs"
            v-on="on"
            :placeholder="`${$t('Input the date')}`"
            class="form-input"
            outlined
            dense
            hide-details
            solo
            readonly
            clearable
          >
            <template v-slot:append>
              <img width="16" height="16" src="@/assets/img/ico-calendar.png" />
            </template>
          </v-text-field>
        </template>
        <v-date-picker
          v-model="searchBy.endDate"
          @change="checkEndDate"
          @input="showEndDatePicker = false"
          no-title
        ></v-date-picker>
      </v-menu>
      <v-btn text class="btn type-search ml-3" @click="searchRecords">{{
        $t('Search')
      }}</v-btn>
    </div>
    <v-data-table
      item-key="id"
      :headers="recordHeaders"
      :items="tableItems"
      :page.sync="page"
      :hide-default-footer="true"
      :options.sync="options"
      :server-items-length="totalRecords"
      class="tbl-type01 mt-10"
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
        <v-btn
          @click="exportRecords"
          :disabled="exportDisabled"
          class="btn"
          text
          >{{ $t('Export') }}</v-btn
        >
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
import { mapGetters } from 'vuex'
import EventBus from '@/plugins/eventBus'
import { getRequestConfig, exportFiles } from '@/plugins/exporter'
import { setTempObj, getTempObj } from '@/plugins/sessionStorageManager'
import codes from '@/plugins/codes'
import commons from '@/plugins/commons'
// Mixins
import Pagenation from '@/mixins/Pagenation'

export default {
  name: 'UpdateRecords',
  mixins: [Pagenation],
  data () {
    return {
      productionType: process.env.VUE_APP_PRODUCTION_TYPE,
      user: null,
      showStartDatePicker: false,
      showEndDatePicker: false,
      btnShowProductExport: false,
      page: 1,
      totalPages: 0,
      totalVisiblePages: 5,
      pageInfoText: '',
      goToPageInput: null,
      options: {},
      requestConfig: {},
      tableItems: [],
      totalRecords: null,
      searchBy: {
        fileName: null,
        startDate: null,
        endDate: null
      }
    }
  },
  computed: {
    ...mapGetters({ store: 'dataStore/GET_SELECTED_STORE' }),
    recordHeaders () {
      let severSort = true
      if (this.productionType === 'cloud') severSort = false
      return [
        {
          text: '#',
          sortable: false,
          align: 'center',
          value: 'id',
          width: '7%'
        },
        {
          text: this.$t('File Name'),
          sortable: true,
          value: 'name',
          width: '22%'
        },
        {
          text: this.$t('Result'),
          sortable: severSort,
          value: 'result',
          width: '15%'
        },
        {
          text: this.$t('Total'),
          sortable: severSort,
          value: 'total',
          width: '10%'
        },
        {
          text: this.$t('Success'),
          sortable: severSort,
          value: 'success',
          width: '10%'
        },
        {
          text: this.$t('Fail'),
          sortable: severSort,
          value: 'fail',
          width: '10%'
        },
        { text: this.$t('Created Date'), sortable: true, value: 'created' }
      ]
    },
    exportDisabled () {
      let btnDisabled = this.btnShowProductExport
      if (!btnDisabled) {
        if (this.tableItems !== undefined) {
          btnDisabled = this.tableItems.length < 1
        } else {
          btnDisabled = true
        }
      }
      return btnDisabled
    },
    selectedStore () {
      return this.store.code
    }
  },
  watch: {
    options: {
      handler (newVal, oldVal) {
        if (newVal.page === oldVal.page) {
          this.getRecords(1)
          this.page = 1
        }
      },
      deep: true
    },
    searchBy: {
      handler (newSearchBy) {
        const updateRecords = {
          searchBy: newSearchBy
        }
        setTempObj('updateRecords', updateRecords)
      },
      deep: true
    },
    selectedStore () {
      this.resetSearchCondition()
    }
  },
  created () {
    this.user = this.$store.state.auth.user
  },
  mounted () {
    // button 권한 체크
    // Update Records : Export
    this.$store.dispatch('auth/getDisabledBtn', '3200').then(flag => {
      this.btnShowProductExport = flag
    })
    EventBus.$emit('enableSelectedStores', true)
    const updateRecordsSessionData = getTempObj('updateRecords')
    if (
      !commons.isNull(updateRecordsSessionData) &&
      !commons.isNull(updateRecordsSessionData.searchBy)
    ) {
      this.searchBy = updateRecordsSessionData.searchBy
    }
    this.getRecords(1)
  },
  methods: {
    clearDate (searchBy, dateType) {
      searchBy[dateType] = null
    },
    resetSearchCondition () {
      this.searchBy = {
        fileName: null,
        startDate: null,
        endDate: null
      }
      this.page = 1
      this.getRecords(1)
    },
    saveRequestConfig: function (config) {
      this.requestConfig = getRequestConfig(config)
    },
    buildSearchParams: function (params) {
      if (commons.isValidStr(this.searchBy.fileName)) {
        params.name = this.searchBy.fileName
      }
      if (!commons.isNull(this.searchBy.startDate)) {
        params.start = this.searchBy.startDate
      }
      if (!commons.isNull(this.searchBy.endDate)) {
        params.end = this.searchBy.endDate
      }
      return params
    },
    buildParmas () {
      const { sortBy, sortDesc, itemsPerPage } = this.options
      let params = {
        company: this.user.company,
        store: this.store.code
      }
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
    getRecords (page) {
      if (this.searchBy.startDate > this.searchBy.endDate) {
        EventBus.$emit('messageAlert', this.$t('The period is invalid.'))
        return
      }
      const params = this.buildParmas()
      if (page !== null) params.page = page - 1
      const config = { params: params }
      this.$utils
        .callAxios(
          codes.requests.getRecords.method,
          codes.requests.getRecords.url,
          config
        )
        .then(res => {
          this.saveRequestConfig(res.config)
          this.tableItems = res.data.articleFileHistoryList.map(list => {
            list.created = commons.convertDate(list.created)
            return list
          })
          this.totalRecords = res.data.articleFileHistoryList.length
          this.pageInfoText = this.getPageInfoText(res.headers)
          this.totalPages = Number(res.headers['x-totalpages'])
          this.selected = []
        })
        .catch(error => {
          this.tableItems = []
          this.totalRecords = this.tableItems.length
          const headers = {}
          headers['x-totalelements'] = 0
          this.pageInfoText = this.getPageInfoText(headers)
          this.totalPages = 0
          this.selected = []
          console.debug(`Could not find any update record ${error}`)
        })
    },
    exportRecords () {
      exportFiles(
        this.requestConfig,
        this.$refs.link,
        'ProductHistoryList.xlsx'
      )
    },
    getPageInfoText: function (headers) {
      if (headers['x-totalelements'] === 0) return '0 to 0, 0 in total'
      return `${headers['x-number'] * 1 * headers['x-size'] + 1} 
      to ${headers['x-number'] * 1 * headers['x-size'] +
        headers['x-total-count'] * 1},
       ${headers['x-totalelements'] * 1} in total`
    },
    paging (page = this.page) {
      this.page = Number(page)
      this.goToPageInput = page
      this.getRecords(this.page)
    },
    searchRecords () {
      this.getRecords(1)
    },
    checkStartDate (val) {
      if (val > this.searchBy.endDate) {
        this.searchBy.startDate = null
        EventBus.$emit(
          'messageAlert',
          this.$t('The start date is must be prior to the end date.')
        )
      }
    },
    checkEndDate (val) {
      if (val < this.searchBy.startDate) {
        this.searchBy.endDate = null
        EventBus.$emit(
          'messageAlert',
          this.$t('The end date is must be after the start date.')
        )
      }
    }
  }
}
</script>
