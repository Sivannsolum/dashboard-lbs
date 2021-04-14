<template>
  <div>
    <h2 class="page-title-bar"><i class="ico ico-template"></i>{{ $t('Template Grouping') }}</h2>
    <!-- 검색창 -->
    <v-row>
      <v-col cols="8">
        <div class="searchArea">
          <v-text-field
            v-model="searchBy.groupName"
            @keyup.enter="searchGroups"
            :label="$t('Group List')"
            :placeholder="$t('Input the group name')"
            class="form-input"
            outlined dense hide-details
            clearable
          ></v-text-field>
          <v-btn @click="searchGroups" text class="btn type-search ml-3">{{ $t('Search') }}</v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row class="mt-5">
      <v-col cols="8">
        <!-- Template group list -->
        <v-data-table
          v-model="selectedGroups"
          @click:row="showGroupDetail"
          :item-class="getRowClass"
          :headers="groupHeaders"
          :items="groups"
          item-key="groupName"
          :options.sync="groupOptions"
          :server-items-length="totalGroups"
          show-select
          :hide-default-footer="true"
          class="tbl-type01"
        >
          <template slot="no-data">
            <p> {{ $t('No data available') }} </p>
          </template>
        </v-data-table>
        <!-- Button group -->
        <div class="table-options">
          <div>
            <new-template-group
              :newBtnDisabled="newBtnDisabled"
              :user="user"
              :tagTypes="tagTypes"
              @resetGroups="resetGroups"
              @fireConfirm="confirm"
            />
            <edit-template-group
              :editDisabled="editBtnDisabled"
              :user="user"
              :tagTypes="tagTypes"
              :group="selectedGroup"
              :templates="templates"
              @resetGroups="resetGroups"
              @refreshTemplates="refreshTemplates"
            />
            <v-btn
              @click="deleteGroups"
              :disabled="deleteBtnDisabled"
              class="btn-s ml-2"
              text
            >{{$t('Delete')}}</v-btn>
          </div>
          <!-- Pagination -->
          <div>
            <div class="pageInfo">{{ groupPageInfoText }}</div>
            <v-pagination
              v-model="groupPage"
              @input="groupPaging"
              :length="groupTotalPages*1"
              :total-visible="groupTotalVisiblePages"
              color="#2f3b4c"
            >
            </v-pagination>
          </div>
        </div>
      </v-col>
      <v-col cols="4">
        <div class="selected-group">
          <h3>{{ $t('TEMPLATES OF SELECTED GROUP') }}</h3>
          <v-row>
            <v-col cols="12">
              <h4>{{ $t('Template List') }}</h4>
              <v-data-table
                v-model="selectedTemplates"
                :headers="templateHeaders"
                :items="templates"
                item-key="templateName"
                :options.sync="templateOptions"
                :server-items-length="totalTemplates"
                :hide-default-footer="true"
                fixed-header
                height="500"
                class="tbl-type01 flat"
              >
                <template slot="no-data">
                  <div>{{ noDataMsg }}</div>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
    <!-- Confirm Box -->
    <div>
      <v-dialog
        v-model="confirmBox.visible"
        persistent
        width="500"
      >
        <v-card class="popup add_store_popup" align="center" justify="center">
          <v-row >
            <v-col>
              <span v-text="confirmBox.msg"></span>
            </v-col>
          </v-row>
          <v-card-actions class="d-flex justify-center">
            <v-btn @click="handleClickConfirm(true)" text icon class="btn">{{ $t('Yes') }}</v-btn>
            <v-btn @click="handleClickConfirm(false)" text icon class="btn">{{ $t('No') }}</v-btn>
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

import NewTemplateGroup from './modal/NewTemplateGroup.vue'
import EditTemplateGroup from './modal/EditTemplateGroup.vue'

export default {
  name: 'TemplateGrouping',
  components: {
    NewTemplateGroup,
    EditTemplateGroup
  },
  data () {
    return {
      productionType: process.env.VUE_APP_PRODUCTION_TYPE,
      confirmBox: {
        visible: false,
        msg: ''
      },
      user: null,
      selectedGroup: null,
      selectedGroups: [],
      groupPage: 1,
      groupTotalPages: 10,
      groupPageInfoText: '',
      groupTotalVisiblePages: 5,
      groupOptions: {},
      totalGroups: null,
      groups: [],
      searchBy: { groupName: '' },
      selectedTemplates: [],
      templatePage: 1,
      templateTotalPages: 10,
      templatePageInfoText: '',
      templateTotalVisiblePages: 5,
      templateOptions: {},
      totalTemplates: null,
      templates: [],
      tagTypes: [],
      newEditDeleteDisabled: false
    }
  },
  computed: {
    msg () {
      return {
        selectGroup: this.$t('Select the template group'),
        noData: this.$t('No data available')
      }
    },
    groupHeaders () {
      return [
        { text: this.$t('GROUP NAME'), value: 'groupName' },
        { text: this.$t('LAST MODIFIED DATE'), value: 'lastModifiedDate' }
      ]
    },
    templateHeaders () {
      return [
        { text: '#', sortable: false, align: 'center', value: 'no', width: '30%' },
        { text: this.$t('NAME'), sortable: false, value: 'name' }
      ]
    },
    ...mapGetters({ store: 'dataStore/GET_SELECTED_STORE' }),
    newBtnDisabled () { return this.newEditDeleteDisabled },
    editBtnDisabled () { return this.newEditDeleteDisabled },
    deleteBtnDisabled () { return (this.selectedGroups.length < 1 || this.newEditDeleteDisabled) },
    noDataMsg () {
      if (this.selectedGroup === null) return this.$t(this.msg.selectGroup)
      return this.$t(this.msg.noData)
    }
  },
  watch: {
    groupOptions: {
      handler () {
        this.getGroups(1)
        this.groupPage = 1
      },
      deep: true
    },
    templateOptions: {
      handler () {
        if (this.templates.length > 0) this.getTemplates(1, this.selectedGroup.groupName)
      },
      deep: true
    },
    store: {
      handler () {
        this.getGroups(1)
      }
    },
    searchBy: {
      handler (newSearchBy) {
        const templateGrouping = {
          searchBy: newSearchBy
        }
        setTempObj('templateGrouping', templateGrouping)
      },
      deep: true
    }
  },
  created () {
    this.user = this.$store.state.auth.user
  },
  mounted () {
    this.initiateTemplateGrouping()
    this.$store.dispatch('auth/getDisabledBtn', '5200').then(flag => {
      this.newEditDeleteDisabled = flag
    })
    EventBus.$emit('enableSelectedStores', false)
    const templateGroupingSessionData = getTempObj('templateGrouping')

    if (!commons.isNull(templateGroupingSessionData) && !commons.isNull(templateGroupingSessionData.searchBy)) {
      this.searchBy = templateGroupingSessionData.searchBy
    }
  },
  methods: {
    confirm (msg, callback) {
      this.confirmBox.msg = msg
      this.confirmBox.visible = true
      this.confirmBox.callback = callback
    },
    handleClickConfirm (response) {
      if (response) this.confirmBox.callback()
      this.confirmBox.visible = false
    },
    refreshTemplates () { this.getTemplates(1, this.selectedGroup.groupName) },
    initiateTemplateGrouping () {
      this.getGroups(1)
      this.getTagTypes()
    },
    groupPaging () { this.getGroups(this.groupPage) },
    templatePaging () { this.getTemplates(this.templatePage, this.selectedGroup) },
    getPageInfoText: function (headers) {
      if (headers['x-totalelements'] === 0) return '0 to 0, 0 in total'
      return `${headers['x-number'] * 1 * headers['x-size'] + 1} 
      to ${(headers['x-number'] * 1 * headers['x-size']) + headers['x-total-count'] * 1},
       ${headers['x-totalelements'] * 1} in total`
    },
    resetGroups () {
      this.getGroups(1)
      this.groupPage = 1
      this.selectedGroups = []
      this.templates = []
      this.selectedTemplates = []
    },
    insertIndex (templates) {
      let idx = 1 * this.templatePage
      templates = templates.map(template => {
        const templateObj = {}
        templateObj.no = idx
        templateObj.name = template
        templateObj.lastModifiedDate = commons.convertDate(template.lastModifiedDate)
        idx++
        return templateObj
      })
      return templates
    },
    handleGetGroupsResponse (res) {
      if (res.status === 204) {
        this.handleGetGroupsError('No content')
        return
      }
      // Refresh
      this.groups = res.data.groupList
      this.totalGroups = this.groups.length
      this.selectedGroup = null
      this.templates = []
      // Pagination
      this.groupPageInfoText = this.getPageInfoText(res.headers)
      this.groupTotalPages = res.headers['x-totalpages']
      this.selectedGroups = []
    },
    handleGetGroupsError (error) {
      this.groups = []
      this.totalGroups = this.groups.length
      const headers = {}
      headers['x-totalelements'] = 0
      this.groupPageInfoText = this.getPageInfoText(headers)
      this.groupTotalPages = 0
      this.selectedGroups = []
      this.selectedGroup = null
      this.templates = []
      console.debug(`Could not find any group ${error}`)
    },
    handleGetTempaltesResponse (res) {
      if (res.status === 204) {
        this.handleGetTempaltesError('No content')
        return
      }
      // Refresh
      this.templates = this.insertIndex(res.data.templateNameList)
      this.totalTemplates = this.templates.length
      // Pagination
      this.templatePageInfoText = this.getPageInfoText(res.headers)
      this.templateTotalPages = Math.floor(this.totalTemplates / this.templateOptions.itemsPerPage)
      this.selectedTemplates = []
    },
    handleGetTempaltesError (error) {
      this.templates = []
      this.totalTemplates = this.templates.length
      const headers = {}
      headers['x-totalelements'] = 0
      this.templatePageInfoText = this.getPageInfoText(headers)
      this.templateTotalPages = 0
      this.selectedTemplates = []
      console.debug(`Could not find any template ${error}`)
    },
    getGroupSortKey: function (sortKey) {
      switch (sortKey) {
        case 'groupName': sortKey = 'name'
          break
        case 'lastModifiedDate': sortKey = 'lastModified'
          break
        default: break
      }
      return sortKey
    },
    buildGetGroupsParmas () {
      const { sortBy, sortDesc, itemsPerPage } = this.groupOptions
      const params = { company: this.user.company }
      if (this.searchBy.groupName && this.searchBy.groupName.length > 0) params.name = this.searchBy.groupName
      let sort = null
      if (commons.isSorting(sortBy, sortDesc)) {
        let sortKey = sortBy[0]
        if (this.productionType === 'server') sortKey = this.getGroupSortKey(sortBy[0])
        const sortOrder = sortDesc[0]
        sort = `${sortKey},${sortOrder ? 'desc' : 'asc'}`
      }
      if (sort !== null) params.sort = sort
      if (itemsPerPage > 0) params.size = itemsPerPage
      return params
    },
    getGroups (page) {
      const params = this.buildGetGroupsParmas()
      if (page !== null) params.page = page - 1
      const config = { params: params }
      this.$utils
        .callAxios(
          codes.requests.getGroups.method,
          codes.requests.getGroups.url,
          config
        )
        .then(res => {
          this.handleGetGroupsResponse(res)
        })
        .catch(error => {
          this.handleGetGroupsError(error)
        })
    },
    buildGetTemplatesParams () {
      const { sortBy, sortDesc, itemsPerPage } = this.templateOptions
      const params = { company: this.user.company }
      if (this.searchBy.groupName && this.searchBy.groupName.length > 0) params.name = this.searchBy.groupName
      let sort = null
      if (commons.isSorting(sortBy, sortDesc)) {
        const sortKey = sortBy[0]
        const sortOrder = sortDesc[0]
        sort = `${sortKey},${sortOrder ? 'desc' : 'asc'}`
      }
      if (sort !== null) params.sort = sort
      if (itemsPerPage > 0) params.size = itemsPerPage
      return params
    },
    getTemplates (page, groupName) {
      const params = this.buildGetTemplatesParams()
      params.group = groupName
      if (page !== null) params.page = page - 1
      const config = { params: params }
      this.$utils
        .callAxios(
          codes.requests.getGroupDetail.method,
          codes.requests.getGroupDetail.url,
          config
        )
        .then(res => {
          this.handleGetTempaltesResponse(res)
        })
        .catch(error => {
          this.handleGetTempaltesError(error)
        })
    },
    getTagTypes () {
      const params = { company: this.user.company }
      const config = { params: params }
      this.$utils
        .callAxios(
          codes.requests.getTagTypes.method,
          codes.requests.getTagTypes.url,
          config
        )
        .then(res => {
          this.tagTypes = res.data.tagTypeList
        })
    },
    searchGroups () {
      this.getGroups(1)
      this.groupPage = 1
    },
    deleteGroups () {
      if (this.selectedGroups.length < 1) return
      const data = { templateGroupDeleteList: [] }
      const params = { company: this.user.company }
      for (const group of this.selectedGroups) {
        data.templateGroupDeleteList.push(group.groupName)
      }
      if (this.selectedGroups.length < 1) return
      const config = {
        data: data,
        params: params
      }
      this.$utils
        .callAxios(
          codes.requests.deleteGroups.method,
          codes.requests.deleteGroups.url,
          config
        )
        .then(res => {
          EventBus.$emit('messageAlert', this.$t(res.data.responseMessage))
          if (res.data.responseCode === '200') {
            this.resetGroups()
          }
        })
        .catch(error => {
          EventBus.$emit('messageAlert', this.$t(error.response.data.responseMessage))
        })
    },
    showGroupDetail (item) {
      this.groups.map(group => {
        group.selected = false
        return group
      })
      item.selected = true
      this.groups = [...this.groups]
      this.selectedGroup = item
      this.getTemplates(1, item.groupName)
    },
    getRowClass (item) {
      if (item.selected) return `${codes.ROW_CLASS} active`
      return codes.ROW_CLASS
    }
  }
}
</script>

<style scoped>
  .selected-group{min-height:100%; padding:30px; background:#fafafa;}
  .selected-group h3{font-size:var(--font14); color:#a3a6b4; font-weight:500;}
  .selected-group h4{margin-bottom:10px; font-size:var(--font13); color:#a3a6b4; font-weight:400;}
  .preview{height:100%; padding:0 10px; background:#fff;}

  .row-class:hover { cursor: pointer; }
</style>
