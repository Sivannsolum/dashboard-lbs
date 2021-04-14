<template>
  <div>
    <h2 class="page-title-bar">
      <i class="ico ico-template"></i>{{ $t('Template Info') }}
    </h2>
    <!-- 검색 -->
    <div class="searchArea w50">
      <v-text-field
        v-model="searchBy.templateName"
        @keyup.enter="handleSearch()"
        outlined
        dense
        hide-details
        :label="Label_TemplateName"
        :placeholder="`${$t('Input the template name')}`"
        class="form-input"
        clearable
      ></v-text-field>

      <v-btn @click="handleSearch()" text class="btn type-search ml-3">{{
        $t('Search')
      }}</v-btn>
    </div>
    <v-data-table
      v-model="selected"
      :headers="templateHeaders"
      :items="templates"
      item-key="templateName"
      :options.sync="options"
      :server-items-length="totalTemplates"
      show-select
      :hide-default-footer="true"
      class="tbl-type01 mt-10"
    >
      <template slot="no-data">
        <p>
          {{ $t('No data available') }}
        </p>
      </template>
    </v-data-table>
    <!-- button group -->
    <div class="table-options">
      <div>
        <add-template
          :addBtnDisabled="addBtnDisabled"
          :user="user"
          @refreshTemplates="resetTemplates"
        />
        <v-btn
          :disabled="deleteBtnDisabled"
          @click="deleteTemplates()"
          text
          class="btn ml-2"
          >{{ $t('Delete') }}</v-btn
        >
        <v-btn
          :disabled="exportBtnDisabled"
          @click="exportTemplateList()"
          text
          class="btn ml-2"
          >{{ $t('Export') }}</v-btn
        >
      </div>
      <!-- paging -->
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
import { exportFiles } from '@/plugins/exporter'
import commons from '@/plugins/commons'
import codes from '@/plugins/codes'
import { setTempObj, getTempObj } from '@/plugins/sessionStorageManager'
// Mixins
import Pagenation from '@/mixins/Pagenation'

import AddTemplate from './modal/AddTemplate.vue'

const requests = {
  getTemplates: {
    method: 'get',
    url: '/api/common/templates'
  },
  searchTemplates: {
    method: 'get',
    url: '/api/common/templates/name'
  },
  addTemplate: {
    method: 'post',
    url: '/api/common/templates'
  },
  deleteTemplates: {
    method: 'delete',
    url: '/api/common/templates'
  }
}

export default {
  name: 'TemplateInfo',
  mixins: [Pagenation],
  components: {
    AddTemplate
  },
  data () {
    return {
      productionType: process.env.VUE_APP_PRODUCTION_TYPE,
      Label_TemplateName: this.$t('TEMPLATE NAME'),
      user: null,
      requestConfig: {},
      selected: [],
      page: 1,
      totalPages: 10,
      pageInfoText: '',
      totalVisiblePages: 5,
      goToPageInput: null,
      options: {},
      totalTemplates: null,
      templates: [],
      searchBy: { templateName: '' },
      addDeleteDisabled: false,
      exportDisabled: false
    }
  },
  computed: {
    templateHeaders () {
      return [
        {
          text: '#',
          sortable: false,
          align: 'center',
          value: 'no',
          width: '10%'
        },
        { text: this.$t('NAME'), sortable: true, value: 'templateName' },
        {
          text: this.$t('WIDTH(PX)'),
          sortable: true,
          value: 'width',
          width: '20%'
        },
        {
          text: this.$t('HEIGHT(PX)'),
          sortable: true,
          value: 'height',
          width: '20%'
        }
      ]
    },
    ...mapGetters({
      store: 'dataStore/GET_SELECTED_STORE'
    }),
    addBtnDisabled () {
      return this.addDeleteDisabled
    },
    deleteBtnDisabled () {
      return this.selected.length < 1 || this.addDeleteDisabled
    },
    exportBtnDisabled () {
      return this.templates.length < 1 || this.exportDisabled
    },
    isSearching () {
      return (
        this.searchBy.templateName !== null &&
        this.searchBy.templateName.length > 0
      )
    }
  },
  watch: {
    options: {
      handler () {
        if (this.isSearching) {
          this.searchTemplates(this.page)
        } else {
          this.getTemplates(1)
          this.page = 1
        }
      },
      deep: true
    },
    store: {
      handler () {
        this.getTemplates(1)
        this.page = 1
      }
    },
    searchBy: {
      handler (newSearchBy) {
        const templateInfo = {
          searchBy: newSearchBy
        }
        setTempObj('templateInfo', templateInfo)
      },
      deep: true
    }
  },
  created () {
    this.user = this.$store.state.auth.user
  },
  mounted () {
    const templateInfoSessionData = getTempObj('templateInfo')
    if (
      !commons.isNull(templateInfoSessionData) &&
      !commons.isNull(templateInfoSessionData.searchBy)
    ) {
      this.searchBy = templateInfoSessionData.searchBy
    }
    this.getTemplates(1)
    this.$store.dispatch('auth/getDisabledBtn', '5100').then(flag => {
      this.addDeleteDisabled = flag
    })
    this.$store.dispatch('auth/getDisabledBtn', '5101').then(flag => {
      this.exportDisabled = flag
    })
    EventBus.$emit('enableSelectedStores', false)
  },
  methods: {
    paging (page = this.page) {
      this.page = Number(page)
      this.goToPageInput = page
      if (this.isSearching) {
        this.searchTemplates(this.page)
      } else {
        this.getTemplates(this.page)
      }
    },
    getPageInfoText: function (headers) {
      if (headers['x-totalelements'] === 0) return '0 to 0, 0 in total'
      return `${headers['x-number'] * 1 * headers['x-size'] + 1} 
      to ${headers['x-number'] * 1 * headers['x-size'] +
        headers['x-total-count'] * 1},
       ${headers['x-totalelements'] * 1} in total`
    },
    resetTemplates () {
      this.getTemplates(1)
      this.page = 1
      this.selected = []
    },
    saveRequestConfig: function (config) {
      const requestConfig = {
        url: config.url,
        method: config.method,
        params: config.params
      }
      this.requestConfig = requestConfig
    },
    exportTemplateList () {
      if (this.templates.length < 1) {
        EventBus.$emit('messageAlert', this.$t('No data to export.'))
        return
      }
      exportFiles(this.requestConfig, this.$refs.link, 'TemplateList.xlsx')
    },
    insertIndex (templates, headers) {
      let idx = Number(headers['x-number'] * headers['x-size']) + 1
      templates = templates.map(template => {
        template.no = idx
        idx++
        return template
      })
      return templates
    },
    handleGetTempaltesResponse (res) {
      if (res.status === 204) {
        this.handleGetTempaltesError('No content')
        return
      }
      this.saveRequestConfig(res.config)
      // Refresh articels
      this.templates = this.insertIndex(res.data.templateList, res.headers)
      this.totalTemplates = this.templates.length
      // Pagination
      this.pageInfoText = this.getPageInfoText(res.headers)
      this.totalPages = res.headers['x-totalpages']
      this.selected = []
    },
    handleGetTempaltesError (error) {
      this.templates = []
      this.totalTemplates = this.templates.length
      const headers = {}
      headers['x-totalelements'] = 0
      this.pageInfoText = this.getPageInfoText(headers)
      this.totalPages = 0
      this.selected = []
      console.debug(error)
    },
    getTemplateSortKey (sortKey) {
      if (this.productionType === codes.productionTypes.CLOUD) {
        switch (sortKey) {
          case 'lastUpdateTime':
            sortKey = 'lastModified'
            break
          default:
            break
        }
        return sortKey
      } else {
        switch (sortKey) {
          case 'templateName':
            sortKey = 'id.name'
            break
          case 'lastUpdateTime':
            sortKey = 'lastModified'
            break
          default:
            break
        }
        return sortKey
      }
    },
    buildParmas: function () {
      const { sortBy, sortDesc, itemsPerPage } = this.options
      const params = { company: this.user.company }
      let sort = null
      if (sortBy.length === 1 && sortDesc.length === 1) {
        const sortKey = this.getTemplateSortKey(sortBy[0])
        const sortOrder = sortDesc[0]
        sort = `${sortKey},${sortOrder ? 'desc' : 'asc'}`
      }
      if (sort !== null) params.sort = sort
      if (itemsPerPage > 0) params.size = itemsPerPage
      return params
    },
    buildSearchParmas: function () {
      const { sortBy, sortDesc, itemsPerPage } = this.options
      const params = { company: this.user.company }
      let sort = null
      if (sortBy.length === 1 && sortDesc.length === 1) {
        const sortKey = this.getTemplateSortKey(sortBy[0])
        const sortOrder = sortDesc[0]
        sort = `${sortKey},${sortOrder ? 'desc' : 'asc'}`
      }
      if (this.isSearching) params.name = this.searchBy.templateName
      if (sort !== null) params.sort = sort
      if (itemsPerPage > 0) params.size = itemsPerPage
      return params
    },
    getTemplates (page) {
      const params = this.buildParmas()
      if (page !== null) params.page = page - 1
      const config = { params: params }
      this.$utils
        .callAxios(
          requests.getTemplates.method,
          requests.getTemplates.url,
          config
        )
        .then(res => {
          this.handleGetTempaltesResponse(res)
        })
        .catch(error => {
          this.handleGetTempaltesError(error)
        })
    },
    handleSearch () {
      this.page = 1
      this.searchTemplates(1)
    },
    searchTemplates (page) {
      if (!this.isSearching) {
        this.getTemplates(1)
        return
      }
      const params = this.buildSearchParmas()
      if (page !== null) params.page = page - 1
      const config = { params: params }
      this.$utils
        .callAxios(
          requests.searchTemplates.method,
          requests.searchTemplates.url,
          config
        )
        .then(res => {
          this.handleGetTempaltesResponse(res)
        })
        .catch(error => {
          this.handleGetTempaltesError(error)
        })
    },
    deleteTemplates: function () {
      if (this.selected.length < 1) return
      const data = { templateDeleteList: [] }
      const params = { company: this.user.company }
      for (const template of this.selected) {
        data.templateDeleteList.push(template.templateName)
      }
      if (this.selected.length < 1) return
      const config = {
        data: data,
        params: params
      }
      this.$utils
        .callAxios(
          requests.deleteTemplates.method,
          requests.deleteTemplates.url,
          config
        )
        .then(res => {
          const result = res.data
          EventBus.$emit('messageAlert', this.$t(result.responseMessage))
          if (this.isSearching) {
            this.searchTemplates(1)
          } else {
            this.getTemplates(1)
            this.page = 1
          }
          this.selected = []
        })
    }
  }
}
</script>
