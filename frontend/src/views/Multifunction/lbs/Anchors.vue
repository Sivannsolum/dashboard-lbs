<template>
  <div>
    <!-- 검색창 -->
    <div class="searchArea w50">
      <v-select
        v-model="search.by"
        :items="searchByOptions"
        item-text="text"
        item-value="abbr"
        :label="Label_By"
        class="form-select"
        outlined
        dense
        hide-details
      ></v-select>
      <v-text-field
        v-model="search.value"
        @keyup.enter="searchAnchors"
        :placeholder="$t(searchValuePlaceholder)"
        outlined
        dense
        hide-details
        class="form-input in-btn ml-2"
        clearable
      >
        <template v-slot:append>
          <v-btn @click="searchAnchors" text>
            <img src="@/assets/img/btn-search.jpg" alt="" />
          </v-btn>
        </template>
      </v-text-field>
    </div>
    <!-- Anchor list -->
    <v-data-table
      v-model="selected"
      :headers="anchorHeaders"
      :items="anchors"
      item-key="anchorId"
      :options.sync="options"
      :server-items-length="totalAnchors"
      show-select
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
    <!-- Button Group -->
    <div class="table-options">
      <div>
        <add-anchor
          :user="user"
          :addBtnDisabled="addBtnDisabled"
          @fireResetAnchors="resetAnchors"
        />
        <v-btn
          @click="deleteAnchors"
          :disabled="deleteBtnDisabled"
          text
          class="btn ml-2"
          >{{ $t('Delete') }}
        </v-btn>
        <anchor-setting
          :user="user"
          :store="store"
          :settingBtnDisabled="settingBtnDisabled"
          @fireResetAnchors="resetAnchors"
          @fireConfirm="confirm"
        />
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
    <!-- Confirm Box -->
    <div>
      <v-dialog v-model="confirmBox.visible" persistent width="500">
        <v-card class="popup add_store_popup" align="center" justify="center">
          <v-row>
            <v-col>
              <span v-text="confirmBox.msg"></span>
            </v-col>
          </v-row>
          <v-card-actions class="d-flex justify-center">
            <v-btn @click="handleClickConfirm(true)" text icon class="btn">{{
              $t('Yes')
            }}</v-btn>
            <v-btn @click="handleClickConfirm(false)" text icon class="btn">{{
              $t('No')
            }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import EventBus from '@/plugins/eventBus'
import commons from '@/plugins/commons'
import codes from '@/plugins/codes'
import { setTempObj, getTempObj } from '@/plugins/sessionStorageManager'

import AddAnchor from './modal/AddAnchor.vue'
import AnchorSetting from './modal/AnchorSetting.vue'
// Mixins
import Pagenation from '@/mixins/Pagenation'

export default {
  mixins: [Pagenation],
  components: {
    AddAnchor,
    AnchorSetting
  },
  data () {
    return {
      productionType: process.env.VUE_APP_PRODUCTION_TYPE,
      confirmBox: {
        visible: false,
        msg: ''
      },
      lbsEnabled: true,
      user: null,
      page: 1,
      totalPages: 1,
      pageInfoText: '',
      anchorSearchType: '',
      totalVisiblePages: 5,
      options: {},
      totalAnchors: null,
      anchors: [],
      selected: [],
      search: {
        by: 'getByPosition',
        value: null
      },
      newDeleteSettingDisabled: false
    }
  },
  computed: {
    cloudMode () {
      return process.env.VUE_APP_PRODUCTION_TYPE === codes.productionTypes.CLOUD
    },
    Label_By () {
      return this.$t('Anchor Management')
    },
    anchorHeaders () {
      return [
        { text: '#', align: 'center', value: 'no', sortable: false },
        { text: this.$t('LOCATION ID'), value: 'positionId' },
        {
          text: this.$t('LABEL ID'),
          value: this.cloudMode ? 'labelCode' : 'labelId'
        },
        { text: this.$t('REQUEST DATE'), value: 'requestDate' },
        { text: this.$t('STATUS'), value: 'state' }
      ]
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
        }
      ]
    },
    ...mapGetters({ store: 'dataStore/GET_SELECTED_STORE' }),
    searchValuePlaceholder () {
      let searchBy = this.searchByOptions.find(
        option => option.abbr === this.search.by
      ).originalText
      searchBy = searchBy.toLowerCase().replace('id', 'ID')
      return `Input the ${searchBy}`
    },
    addBtnDisabled () {
      return (
        !this.store.code || this.newDeleteSettingDisabled || !this.lbsEnabled
      )
    },
    deleteBtnDisabled () {
      return this.selected.length !== 1 || this.newDeleteSettingDisabled
    },
    settingBtnDisabled () {
      return (
        !this.store.code || this.newDeleteSettingDisabled || !this.lbsEnabled
      )
    }
  },
  watch: {
    options: {
      handler () {
        if (commons.isValidStr(this.search.value)) {
          this.searchAnchors()
        } else if (this.store.code) {
          this.getAnchors(1)
          this.page = 1
        }
      },
      deep: true
    },
    store: {
      handler (store) {
        this.getAnchors(1)
        this.page = 1
        this.setLbsEnabled(store.code)
      }
    },
    search: {
      handler (newSearch) {
        const anchors = { search: newSearch }
        setTempObj('anchors', anchors)
      },
      deep: true
    }
  },
  created () {
    this.user = this.$store.state.auth.user
  },
  mounted () {
    const anchorsSessionData = getTempObj('anchors')
    if (
      !commons.isNull(anchorsSessionData) &&
      !commons.isNull(anchorsSessionData.search)
    ) {
      this.search = anchorsSessionData.search
    }
    if (!this.store.code) {
      EventBus.$emit('openSelectedStores')
    }
    this.$store.dispatch('auth/getDisabledBtn', '6100').then(flag => {
      this.newDeleteSettingDisabled = flag
    })
    const selectedStoreCode = this.$store.state.dataStore.selectedStore.code
    if (selectedStoreCode) this.setLbsEnabled(selectedStoreCode)
  },
  methods: {
    paging (page = this.page) {
      this.page = Number(page)
      this.goToPageInput = page
      this.getAnchors(this.page, this.anchorSearchType, this.store.code)
    },
    resetAnchors () {
      this.getAnchors(1)
      this.page = 1
      this.selected = []
    },
    searchAnchors () {
      const searchBy = this.search.by
      const searchValue = this.search.value
      if (!commons.isValidStr(searchValue)) {
        this.getAnchors(1)
        return
      }
      const getByCondition = `/${searchBy}/${searchValue}`
      this.getAnchors(1, getByCondition, this.store.code)
      this.page = 1
    },
    getAnchorSortKey (sortKey) {
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
    handleGetAnchorResponse (res) {
      if (res.data.length < 1) return
      this.anchors = commons.insertIndex(
        commons.convertNoLocalArrDate(res.data, 'requestDate'),
        res.headers
      )
      this.totalAnchors = this.anchors.length
      this.pageInfoText = commons.getPageInfoText(res.headers)
      this.totalPages = 1
      this.selected = []
    },
    handleGetAnchorsResponse (res) {
      this.anchors = commons.insertIndex(
        commons.convertNoLocalArrDate(
          res.data.anchorConfigResponse,
          'requestDate'
        ),
        res.headers
      )
      this.totalAnchors = this.anchors.length
      this.pageInfoText = commons.getPageInfoText(res.headers)
      this.totalPages = Number(res.headers['x-totalpages'])
      this.selected = []
    },
    handleGetAnchorsError (error) {
      this.anchors = []
      this.totalAnchors = this.anchors.length
      const headers = {}
      headers['x-totalelements'] = 0
      this.pageInfoText = commons.getPageInfoText(headers)
      this.totalPages = 0
      this.selected = []
      console.debug(`An error occured while fetching anchors. ${error}`)
    },
    buildParmas () {
      const { sortBy, sortDesc, itemsPerPage } = this.options
      const params = { company: this.user.company }
      let sort = null
      if (commons.isSorting(sortBy, sortDesc)) {
        const sortKey = this.getAnchorSortKey(sortBy[0])
        const sortOrder = sortDesc[0]
        sort = `${sortKey},${sortOrder ? 'desc' : 'asc'}`
      }
      if (sort !== null) params.sort = sort
      if (itemsPerPage > 0) params.size = itemsPerPage
      return params
    },
    getAnchors (
      page,
      anchorSearchType = `/${codes.lbsSearchType.getByStore}/${this.store.code}`,
      storeId = null
    ) {
      const params = this.buildParmas()
      if (storeId !== null) params.storeId = storeId
      if (page !== null) params.page = page - 1
      const config = { params }
      this.anchorSearchType = anchorSearchType
      this.$utils
        .callAxios(
          codes.requests.getAnchors.method,
          `${codes.requests.getAnchors.url}${anchorSearchType}`,
          config
        )
        .then(res => {
          if (commons.isNull(res.data) || res.data === '') {
            this.handleGetAnchorsError('Could not find any anchors.')
          } else if (!commons.isValidStr(res.data.anchorConfigResponse)) {
            // labelId 검색인 경우, 한 개의 anchor만 응답으로 받는다.
            this.handleGetAnchorResponse(res)
          } else {
            this.handleGetAnchorsResponse(res)
          }
        })
        .catch(error => this.handleGetAnchorsError(error))
    },
    deleteAnchors () {
      if (this.selected.length !== 1) return
      const params = { company: this.user.company }
      const config = { params }
      const labelId = this.cloudMode
        ? this.selected[0].labelCode
        : this.selected[0].labelId
      this.$utils
        .callAxios(
          codes.requests.deleteAnchors.method,
          `${codes.requests.deleteAnchors.url}/${labelId}`,
          config
        )
        .then(res => {
          const result = res.data
          EventBus.$emit('messageAlert', this.$t(result.responseMessage))
          if (result.responseCode === '200') {
            this.resetAnchors()
          }
        })
        .catch(error => {
          if (error.response !== undefined) {
            EventBus.$emit(
              'messageAlert',
              this.$t(error.response.data.responseMessage)
            )
          } else {
            EventBus.$emit(
              'messageAlert',
              this.$t('Failed to delete an anchor.')
            )
          }
          console.log(`Failed to delete anchors ${error}`)
        })
    },
    confirm (msg, callback) {
      this.confirmBox.msg = msg
      this.confirmBox.visible = true
      this.confirmBox.callback = callback
    },
    handleClickConfirm (response) {
      if (response) this.confirmBox.callback()
      this.confirmBox.visible = false
    },
    getStoreInfo (storeCode) {
      const params = { store: storeCode }
      const config = { params }
      if (this.productionType === 'cloud') {
        params.company = this.$store.state.auth.user.company
      }
      return this.$utils
        .callAxios(
          codes.requests.getStoreSummary.method,
          codes.requests.getStoreSummary.url,
          config
        )
        .then(res => {
          return res.data
        })
    },
    async setLbsEnabled (storeCode) {
      const storeInfo = await this.getStoreInfo(storeCode)
      this.lbsEnabled = storeInfo.lbsEnabled === true
    }
  }
}
</script>

<style></style>
