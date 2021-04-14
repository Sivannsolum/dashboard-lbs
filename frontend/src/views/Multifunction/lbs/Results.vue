<template>
  <div>
    <!-- 검색 -->
    <div class="searchArea w50 mt-15">
      <v-select
        v-model="search.by"
        :items="searchByOptions"
        item-text="text"
        item-value="abbr"
        :label="Label_By"
        outlined
        dense
        hide-details
        class="form-select"
      ></v-select>

      <v-text-field
        v-model="search.value"
        @keyup.enter="searchResults"
        :placeholder="$t(searchValuePlaceholder)"
        outlined
        dense
        hide-details
        class="form-input in-btn ml-2"
        clearable
      >
        <template v-slot:append>
          <v-btn @click="searchResults" text>
            <img src="@/assets/img/btn-search.jpg" alt="" />
          </v-btn>
        </template>
      </v-text-field>
    </div>

    <!-- data table -->
    <v-data-table
      v-model="selected"
      :headers="resultHeaders"
      :items="results"
      item-key="no"
      :options.sync="options"
      :server-items-length="totalResults"
      :single-select="true"
      :hide-default-footer="true"
      class="tbl-type01 mt-10"
      clearable
    >
      <template slot="no-data">
        <p>
          {{ $t('No data available') }}
        </p>
      </template>
    </v-data-table>

    <!-- 하단 옵션 -->
    <div class="table-options">
      <div></div>
      <div>
        <!-- 특정 페이지 이동 -->
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
            type="button"
            @click="goToPage(goToPageInput, paging, totalPages)"
            class="btnGoToPage"
          >
            <i
              class="v-icon notranslate mdi mdi-chevron-right theme--light"
              aria-hidden="true"
            >
            </i>
          </button>
          <button
            @click="goTenPageBackwards(page, paging)"
            class="pagination-nav pagination-nav-prev pagination-nav-disapled"
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import EventBus from '@/plugins/eventBus.js'
import commons from '@/plugins/commons'
import codes from '@/plugins/codes'
import { setTempObj, getTempObj } from '@/plugins/sessionStorageManager'
import Pagenation from '@/mixins/Pagenation'

const requests = {
  getResults: {
    method: 'get',
    url: '/api/common/lbs/result'
  }
}

const searchType = {
  getByStore: 'getByStore',
  getByLabelId: 'getByLabel',
  getByPosition: 'getByPosition',
  getByArticleId: 'getByArticleId',
  getByArticleName: 'getByArticleName'
}

export default {
  mixins: [Pagenation],
  data () {
    return {
      user: null,
      page: 1,
      totalPages: 1,
      pageInfoText: '',
      resultSearchType: '',
      totalVisiblePages: 5,
      goToPageInput: null,
      options: {},
      totalResults: null,
      results: [],
      selected: [],
      search: {
        by: 'getByPosition',
        value: null
      }
    }
  },
  computed: {
    cloudMode () {
      return process.env.VUE_APP_PRODUCTION_TYPE === codes.productionTypes.CLOUD
    },
    searchByOptions () {
      return [
        {
          text: this.$t('Location ID'),
          abbr: 'getByPosition',
          originalText: 'Location ID'
        },
        {
          text: this.$t('Label ID'),
          abbr: 'getByLabel',
          originalText: 'Label ID'
        },
        {
          text: this.$t('Product ID'),
          abbr: 'getByArticleId',
          originalText: 'Product ID'
        },
        {
          text: this.$t('Product Name'),
          abbr: 'getByArticleName',
          originalText: 'Product Name'
        }
      ]
    },
    Label_By () {
      return this.$t('Location Search')
    },
    resultHeaders () {
      return [
        { text: '#', align: 'center', value: 'no', sortable: false },
        { text: this.$t('LOCATION ID'), value: 'positionId' },
        { text: this.$t('PRODUCT NAME'), value: 'articleName' },
        { text: this.$t('PRODUCT ID'), value: 'articleId' },
        {
          text: this.$t('LABEL ID'),
          value: this.cloudMode ? 'labelCode' : 'mac'
        }
      ]
    },
    ...mapGetters({
      store: 'dataStore/GET_SELECTED_STORE'
    }),
    searchValuePlaceholder () {
      let searchBy = this.searchByOptions.find(
        option => option.abbr === this.search.by
      ).originalText
      searchBy = searchBy.toLowerCase().replace('id', 'ID')
      return `Input the ${searchBy}`
    }
  },
  watch: {
    options: {
      handler () {
        if (this.isValidStr(this.search.value)) {
          this.searchResults()
        } else {
          // 선택된 스토가 있으면 실행
          if (this.store.code) {
            this.getResults(1)
            this.page = 1
          }
        }
      },
      deep: true
    },
    store: {
      handler () {
        this.getResults(1)
        this.page = 1
      }
    },
    search: {
      handler (newSearch) {
        const results = { search: newSearch }
        setTempObj('results', results)
      },
      deep: true
    }
  },
  created () {
    this.user = this.$store.state.auth.user
  },
  mounted () {
    // 선택된 스토가 없으면 팝업  Open
    if (!this.store.code) {
      EventBus.$emit('openSelectedStores')
    }
    const resultsSessionData = getTempObj('results')
    if (
      !commons.isNull(resultsSessionData) &&
      !commons.isNull(resultsSessionData.search)
    ) {
      this.search = resultsSessionData.search
    }
  },
  methods: {
    isValidStr (val) {
      return val !== undefined && val !== null && val.length > 0
    },
    paging (input) {
      this.page = Number(input)
      this.goToPageInput = input
      // 기존 조건값으로 페이지 요청 하도록 수정
      this.getResults(this.page, this.resultSearchType, this.store.code)
    },
    getPageInfoText (headers) {
      const page = this.page - 1
      if (
        headers['x-totalelements'] === 0 ||
        headers['x-totalelements'] === undefined
      ) {
        return '0 to 0, 0 in total'
      }
      return `${page * 1 * headers['x-size'] + 1} 
      to ${page * 1 * headers['x-size'] + this.results.length},
       ${headers['x-totalelements'] * 1} in total`
    },
    resetResults () {
      this.getResults(1)
      this.page = 1
      this.selected = []
    },
    searchResults () {
      const searchBy = this.search.by
      const searchValue = this.search.value
      if (!commons.isValidStr(searchValue)) {
        this.getResults(1)
        return
      }
      const getByCondition = `/${searchBy}/${searchValue}`
      this.getResults(1, getByCondition, this.store.code)
      this.page = 1
    },
    getResultSortKey (sortKey) {
      switch (sortKey) {
        case 'Location ID':
          sortKey = 'positionID'
          break
        case 'Label ID':
          sortKey = this.cloudMode ? 'labelCode' : 'labelId'
          break
        case 'Request Date':
          sortKey = 'requestDate'
          break
        default:
          break
      }
      return sortKey
    },
    insertIndex (list, headers) {
      if (!commons.isValidStr(list)) return []
      let idx = (this.page - 1) * Number(headers['x-size']) + 1
      if (list.length < 2) idx = 1
      list = list.map(el => {
        el.no = idx
        idx++
        return el
      })
      return list
    },
    handleGetResultResponse (res) {
      if (res.data.length < 1) return
      const results = this.insertIndex(res.data, res.headers)
      this.results = results.map(result => {
        result.articleName = result.articleName.pop()
        result.articleId = result.articleId.pop()
        return result
      })
      this.totalResults = this.anchors.length
      this.pageInfoText = this.getPageInfoText(res.headers)
      this.totalPages = 1
      this.selected = []
    },
    handleGetResultsResponse (res) {
      this.results = this.insertIndex(res.data.resultResponse, res.headers)
      this.page = res.headers['x-number'] * 1 + 1
      this.totalResults = this.results.length
      this.pageInfoText = this.getPageInfoText(res.headers)
      this.totalPages = Number(res.headers['x-totalpages'])
      this.selected = []
    },
    handleGetResultsError (error) {
      this.results = []
      this.totalResults = this.results.length
      const headers = {}
      headers['x-totalelements'] = 0
      this.pageInfoText = this.getPageInfoText(headers)
      this.totalPages = 0
      this.selected = []
      console.log(error)
    },
    buildParmas () {
      const { sortBy, sortDesc, itemsPerPage } = this.options
      const params = { company: this.user.company }
      let sort = null
      if (sortBy.length === 1 && sortDesc.length === 1) {
        const sortKey = this.getResultSortKey(sortBy[0])
        const sortOrder = sortDesc[0]
        sort = `${sortKey},${sortOrder ? 'desc' : 'asc'}`
      }
      if (sort !== null) params.sort = sort
      if (itemsPerPage > 0) params.size = itemsPerPage
      return params
    },
    getResults (
      page,
      resultSearchType = `/${searchType.getByStore}/${this.store.code}`,
      storeId = null
    ) {
      // Cloud인 경우 sorting parameters 분기처리 필요. buildParmas에서 작업할것.
      const params = this.buildParmas()
      if (storeId !== null) params.storeId = storeId
      if (page !== null) params.page = page - 1
      const config = { params: params }
      this.resultSearchType = resultSearchType
      this.$utils
        .callAxios(
          requests.getResults.method,
          `${requests.getResults.url}${resultSearchType}`,
          config
        )
        .then(res => {
          if (commons.isNull(res.data) || res.data === '') {
            this.handleGetResultsError('Could not found any anchors.')
          } else if (!commons.isValidStr(res.data.resultResponse)) {
            // labelId 검색인 경우, 한 개의 result만 응답으로 받는다.
            this.handleGetResultsResponse(res)
          } else {
            this.handleGetResultsResponse(res)
          }
        })
        .catch(error => this.handleGetResultsError(error))
    }
  }
}
</script>

<style></style>
