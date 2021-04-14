<template>
  <v-dialog
    v-model="dialog_UserPopup"
    @click:outside="closeModal"
    width="700"
  >
    <v-card class="popup add_store_popup">
      <h3 class="page-title-bar">
        <i class="ico ico-user"></i>{{ $t("ADD ACCOUNT") }}
      </h3>
      <div class="searchArea">
        <v-text-field
          v-model="searchText"
          :placeholder="$t('Input the name')"
          outlined
          dense
          hide-details
          solo
          class="form-input"
          clearable
        ></v-text-field>
        <v-btn
          @click="searchUsers(true)"
          text
          class="btn type-search ml-3"
        >{{ $t("Search") }}
        </v-btn>
      </div>
      <v-data-table
        v-model="selectedUser"
        :headers="popupHeaders"
        :items="popupItems"
        :page.sync="page"
        :height="500"
        :hide-default-footer="true"
        item-key="account"
        show-select
        :single-select="false"
        class="tbl-type01 flat-type02 mt-7"
        :item-class="getRowClass"
        :options.sync="options"
        :server-items-length="totalRecords"
      >
      </v-data-table>
      <div class="table-options flat">
        <div>
          <v-btn text icon @click="saveUsers()" class="btn">{{
            $t("Save")
          }}</v-btn>
          <v-btn text icon @click="closeModal()" class="btn ml-2">{{
            $t("Cancel")
          }}</v-btn>
        </div>
        <!-- pagination -->
        <div>
          <div class="pageInfo">{{ pageInfoText }}</div>
          <v-pagination
            v-model="options.page"
            :length="totalPages * 1"
            :total-visible="totalVisiblePages"
            color="#2f3b4c"
          >
          </v-pagination>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
import EventBus from '@/plugins/eventBus.js'
import commons from '@/plugins/commons'

export default {
  props: {
    rtnStore: Object,
    dialog_UserPopup: Boolean
  },
  data () {
    return {
      selectedUser: [],
      page: 1,
      pageCount: 0,
      currentPage: 1,
      totalPages: 3,
      itemsPerPage: 10,
      totalVisiblePages: 5,
      pageInfoText: '',
      searchText: '',
      options: {},
      requests: {
        searchUsers: {
          method: 'get',
          url: '/api/common/account/mapping/available'
        },
        saveAction: {
          method: 'post',
          url: '/api/common/account/mapping'
        }
      },
      requestConfig: {},
      popupItems: [
        {
          account: 'lovely_c',
          firstName: 'Christina',
          accessLevel: 'Master'
        }
      ],
      totalRecords: null
    }
  },
  computed: {
    popupHeaders () {
      return [
        {
          text: this.$t('ID'),
          sortable: false,
          align: 'center',
          value: 'account'
        },
        {
          text: this.$t('Name'),
          sortable: false,
          align: 'center',
          value: 'firstName'
        },
        {
          text: this.$t('Level'),
          sortable: false,
          align: 'center',
          value: 'accessLevel'
        }
      ]
    }
  },
  watch: {
    dialog_UserPopup () {
      this.searchUsers()
    },
    options: {
      handler () {
        this.searchUsers()
      },
      deep: true
    }
  },
  methods: {
    buildParmas (searchBtn) {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options
      const params = {
        account: this.$store.state.auth.user.account,
        company: this.$store.state.auth.user.company,
        search: this.searchText
      }
      let sort = null
      if (commons.isSorting(sortBy, sortDesc)) {
        const sortKey = sortBy[0]
        const sortOrder = sortDesc[0]
        sort = `${sortKey},${sortOrder ? 'desc' : 'asc'}`
      }
      if (sort !== null) params.sort = sort
      if (page !== null) params.page = searchBtn ? 0 : page - 1
      if (itemsPerPage > 0) params.size = itemsPerPage
      return params
    },
    searchUsers (searchBtn) {
      const params = this.buildParmas(searchBtn)
      const config = { params }
      this.$utils
        .callAxios(
          this.requests.searchUsers.method,
          this.requests.searchUsers.url,
          config
        )
        .then(res => {
          this.popupItems = res.data.accountList
          this.totalRecords = res.data.accountList.length
          // Pagination
          this.pageInfoText = this.getPageInfoText(res.headers)
          this.totalPages = res.headers['x-totalpages']
        })
    },
    getRowClass () {
      return this.ROW_CLASS
    },
    getPageInfoText (headers) {
      return `${headers['x-number'] * 1 * headers['x-size'] + 1} 
      to ${
        headers['x-number'] * 1 * headers['x-size'] +
        headers['x-total-count'] * 1
      },
       ${headers['x-totalelements'] * 1} in total`
    },
    saveUsers () {
      const data = { accountList: [] }
      const params = {}
      for (const list of this.selectedUser) {
        data.accountList.push({ account: list.account })
      }
      data.company = commons.isValue(this.rtnStore.company)
      data.country = commons.isValue(this.rtnStore.country)
      data.region = commons.isValue(this.rtnStore.region)
      data.city = commons.isValue(this.rtnStore.city)
      data.store = commons.isValue(this.rtnStore.store)
      if (this.selectedUser.length < 1) return
      const config = { params }
      this.$utils
        .callAxiosWithBody(
          this.requests.saveAction.method,
          this.requests.saveAction.url,
          data,
          config
        )
        .then((res) => {
          const result = res.data
          EventBus.$emit('messageAlert', this.$t('Saved successfully'))
          if (result.responseCode === '200') {
            this.popupItems = []
            this.$emit('closeUserPopup', false)
          }
        })
    },
    closeModal () {
      this.$emit('closeUserPopup')
      this.initUserPopup()
    },
    initUserPopup () {
      this.searchText = ''
      this.selectedUser = []
      this.page = 1
      this.pageCount = 0
      this.popupItems = []
    }
  }
}
</script>
