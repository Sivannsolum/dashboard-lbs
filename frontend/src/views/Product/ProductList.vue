<template>
  <div>
    <h2 class="page-title-bar">
      <i class="ico ico-product"></i>{{ $t('Product Info') }}
    </h2>
    <!-- Search bar -->
    <section class="searchArea max-80">
      <v-text-field
        v-model="searchBy.articleName"
        @keyup.enter="searchProduct"
        :label="$t('Description')"
        :placeholder="$t('Input the description')"
        class="form-input ml-3"
        outlined
        dense
        hide-details
        clearable
      ></v-text-field>
      <v-text-field
        v-model="searchBy.articleId"
        @keyup.enter="searchProduct()"
        :label="$t('Product ID')"
        :placeholder="$t('Input the product ID')"
        class="form-input ml-3"
        outlined
        dense
        hide-details
        clearable
      ></v-text-field>
      <v-btn @click="searchProduct" class="btn type-search ml-3" text>{{
        $t('Search')
      }}</v-btn>
    </section>
    <!-- Product list -->
    <v-data-table
      v-model="selected"
      @click:row="showProductDetail"
      item-key="articleId"
      :headers="productHeaders"
      :items="products"
      :item-class="getRowClass"
      :options.sync="options"
      :server-items-length="totalProducts"
      :single-select="false"
      :hide-default-footer="true"
      show-select
      class="tbl-type01 mt-10 products"
    >
      <template slot="no-data">
        <p>
          {{ $t('No data available') }}
        </p>
      </template>
    </v-data-table>

    <!-- Product 상세정보 팝업창 -->
    <product-detail
      @fireResetProduct="resetProduct"
      :pdHeaders="pdHeaders"
      :pdItems="pdItems"
      :page="page"
      :store="store"
    />
    <!-- Button group -->
    <section class="table-options">
      <div>
        <file-upload
          :store="store"
          :btnDisabledFileUpload="btnDisabledFileUpload"
        />
        <add-product
          :user="user"
          :btnDisabledAddProduct="addBtnDisabled"
          @fireResetProduct="resetProduct"
        />
        <v-btn
          :disabled="btnDisabledDelete"
          @click="deleteProduct"
          class="btn ml-2"
          text
          >{{ $t('Delete') }}
        </v-btn>
        <blink-led
          :store="store"
          :selected="selected"
          :btnDisabledBlinking="btnDisabledBlinking"
          @fireResetProduct="resetProduct"
        />
        <v-btn
          :disabled="exportDisabled"
          @click="exportArticleList"
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
    </section>
    <!-- Export 기능 링크 -->
    <a ref="link" :style="{ display: 'none' }" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// Utility
import EventBus from '@/plugins/eventBus'
import { getRequestConfig, exportFiles } from '@/plugins/exporter'
import { setTempObj, getTempObj } from '@/plugins/sessionStorageManager'
import commons from '@/plugins/commons'
import codes from '@/plugins/codes'
// Components
import AddProduct from './modal/AddProduct.vue'
import ProductDetail from './modal/ProductDetail.vue'
import BlinkLed from './modal/BlinkLed.vue'
import FileUpload from './modal/FileUpload.vue'
// Mixins
import Pagenation from '@/mixins/Pagenation'

export default {
  name: 'ProductList',
  mixins: [Pagenation],
  components: {
    AddProduct,
    ProductDetail,
    BlinkLed,
    FileUpload
  },
  data () {
    return {
      productionType: process.env.VUE_APP_PRODUCTION_TYPE,
      btnShowProductDetail: false,
      btnDisabledAddDelete: false,
      btnDisabledBlinking: false,
      btnDisabledExport: false,
      btnDisabledFileUpload: false,
      user: null,
      // Product List
      requestConfig: {},
      selected: [],
      pdSelected: [],
      page: 1,
      totalPages: 1,
      pageInfoText: '',
      totalVisiblePages: 5,
      goToPageInput: null,
      options: {},
      totalProducts: null,
      // Product Detail
      productDetailPopedUp: false,
      products: [],
      pdHeaders: [
        { text: '#', sortable: false, align: 'center', value: 'no' },
        {
          text: this.$t('Update Date'),
          sortable: false,
          align: 'center',
          value: 'date'
        }
      ],
      pdItems: [],
      searchBy: { articleName: '', articleId: '' }
    }
  },
  computed: {
    productHeaders () {
      return [
        { text: this.$t('DESCRIPTION'), value: 'articleName' },
        { text: this.$t('PRODUCT ID'), value: 'articleId', width: '20%' },
        { text: this.$t('NFC URL'), value: 'nfcUrl', width: '20%' },
        {
          text: this.$t('LATEST UPDATE TIME'),
          value: 'lastUpdated',
          width: '25%'
        }
      ]
    },
    exportDisabled () {
      let btnDisabled = this.btnDisabledExport
      if (!btnDisabled) {
        btnDisabled = this.products !== undefined && this.products.length < 1
      }
      return btnDisabled
    },
    ...mapGetters({ store: 'dataStore/GET_SELECTED_STORE' }),
    btnDisabledDelete () {
      return this.btnDisabledAddDelete || this.selected.length < 1
    },
    addBtnDisabled () {
      return this.btnDisabledAddDelete || !this.store.code
    }
  },
  watch: {
    options: {
      handler () {
        this.getProduct(1)
        this.page = 1
      },
      deep: true
    },
    store: {
      handler () {
        this.getProduct(1)
        this.page = 1
      }
    },
    searchBy: {
      handler (newSearchBy) {
        const productList = {
          searchBy: newSearchBy
        }
        setTempObj('productList', productList)
      },
      deep: true
    }
  },
  created () {
    this.user = this.$store.state.auth.user
  },
  mounted () {
    this.setDiabledBtns()
    EventBus.$emit('enableSelectedStores', true)
    const productListSessionData = getTempObj('productList')
    if (
      !commons.isNull(productListSessionData) &&
      !commons.isNull(productListSessionData.searchBy)
    ) {
      this.searchBy = productListSessionData.searchBy
    }
    if (!this.store.code) {
      EventBus.$emit('openSelectedStores')
    }
  },
  methods: {
    paging (page = this.page) {
      this.page = Number(page)
      this.goToPageInput = page
      this.getProduct(this.page)
    },
    resetProduct () {
      this.getProduct(1)
      this.page = 1
      this.selected = []
    },
    searchProduct () {
      this.getProduct(1)
      this.page = 1
    },
    resetConditions () {
      this.searchBy.articleName = ''
      this.searchBy.articleId = ''
      this.options = {
        sortBy: [],
        sortDesc: []
      }
      this.selected = []
    },
    saveRequestConfig (config) {
      this.requestConfig = getRequestConfig(config)
    },
    exportArticleList () {
      if (this.products.length < 1) {
        EventBus.$emit('messageAlert', this.$t('No data to export.'))
        return
      }
      exportFiles(this.requestConfig, this.$refs.link, 'ProductList.xlsx')
    },
    getArticleSortKey (sortKey) {
      switch (sortKey) {
        case 'articleId':
          sortKey = 'articleId'
          break
        case 'articleName':
          sortKey = 'name'
          break
        case 'lastUpdated':
          sortKey = 'lastModified'
          break
        default:
          break
      }
      return sortKey
    },
    buildParmas () {
      const { sortBy, sortDesc, itemsPerPage } = this.options
      const params = { store: this.store.code }
      if (commons.isValidStr(this.searchBy.articleName)) {
        params.name = this.searchBy.articleName
      }
      if (commons.isValidStr(this.searchBy.articleId)) {
        params.id = this.searchBy.articleId
      }
      let sort = null
      if (commons.isSorting(sortBy, sortDesc)) {
        const sortKey = this.getArticleSortKey(sortBy[0])
        const sortOrder = sortDesc[0]
        sort = `${sortKey},${sortOrder ? 'desc' : 'asc'}`
      }
      if (sort !== null) params.sort = sort
      if (itemsPerPage > 0) params.size = itemsPerPage
      return params
    },
    convertProductsDate (articleList) {
      return articleList.map(product => {
        product.lastUpdated = commons.convertDate(product.lastUpdated)
        return product
      })
    },
    getProduct (page) {
      const params = this.buildParmas()
      if (commons.isNull(params.store)) return
      if (page !== null) params.page = page - 1
      const config = { params: params }
      if (this.productionType === codes.productionTypes.CLOUD) {
        params.company = this.$store.state.auth.user.company
      }
      this.$utils
        .callAxios(
          codes.requests.getArticles.method,
          codes.requests.getArticles.url,
          config
        )
        .then(res => {
          this.saveRequestConfig(res.config)
          this.products = this.convertProductsDate(res.data.articleList)
          this.totalProducts = this.products.length
          this.pageInfoText = commons.getPageInfoText(res.headers)
          this.totalPages = Number(res.headers['x-totalpages'])
          this.selected = []
        })
        .catch(error => {
          this.products = []
          this.totalProducts = this.products.length
          const headers = {}
          headers['x-totalelements'] = 0
          this.pageInfoText = commons.getPageInfoText(headers)
          this.totalPages = 0
          this.selected = []
          console.debug(`Could not find any products. error: ${error}`)
        })
    },
    deleteProduct () {
      const data = { articleDeleteList: [] }
      const params = { store: this.store.code }
      data.articleDeleteList = this.selected.map(article => article.articleId)
      const config = { data, params }
      if (this.productionType === 'cloud') {
        params.company = this.$store.state.auth.user.company
      }
      this.$utils
        .callAxios(
          codes.requests.deleteArticle.method,
          codes.requests.deleteArticle.url,
          config
        )
        .then(res => {
          const result = res.data
          EventBus.$emit('messageAlert', this.$t(result.responseMessage))
          this.resetProduct()
        })
        .catch(error => {
          console.debug(`Failed to delete products. error: ${error}`)
        })
    },
    // Product Detail 팝업의 좌측 메뉴를 채우는 데이터.
    // Server 버전의 경우 아직 선택한 1건의 Product 에 대해서만 데이터를 표출한다.
    getPdItems (item) {
      const pdItems = []
      const pdItem = {
        no: '1',
        date: item.lastUpdated
      }
      pdItems.push(pdItem)
      return pdItems
    },
    async showProductDetail (item) {
      if (this.btnShowProductDetail) return
      this.pdItems = this.getPdItems(item)
      EventBus.$emit('showCurrArticleDataValues', item.articleId)
      EventBus.$emit('showProductDetail')
    },
    getRowClass () {
      return codes.ROW_CLASS
    },
    setDiabledBtns () {
      // Product List : Detail Popup
      this.$store.dispatch('auth/getDisabledBtn', '3100').then(flag => {
        this.btnShowProductDetail = flag
      })
      // // Product List : File Upload
      this.$store.dispatch('auth/getDisabledBtn', '3101').then(flag => {
        this.btnDisabledFileUpload = flag
      })
      // // Product List : Add / Delete
      this.$store.dispatch('auth/getDisabledBtn', '3102').then(flag => {
        this.btnDisabledAddDelete = flag
      })
      // // Product List : LED Blinking
      this.$store.dispatch('auth/getDisabledBtn', '3103').then(flag => {
        this.btnDisabledBlinking = flag
      })
      // // Product List : Export
      this.$store.dispatch('auth/getDisabledBtn', '3104').then(flag => {
        this.btnDisabledExport = flag
      })
    }
  }
}
</script>

<style>
.form-add-btn {
  width: calc(100% - 110px);
  border: 1px solid rgba(0, 0, 0, 0.38);
  overflow: hidden;
}
.form-add-btn .v-list {
  width: 100%;
  max-height: 100px;
}
.form-add-btn .v-list .v-list-item {
  min-height: auto;
  padding: 0 5px;
}
.form-add-btn .v-list .v-list-item:before {
  background-color: #001e38;
}
.form-add-btn .v-list .v-list-item + .v-list-item {
  border-top: 1px solid rgba(0, 0, 0, 0.38);
}
</style>
