<template>
  <div>
    <h2 class="page-title-bar"><i class="ico ico-user"></i>{{ $t('User Info')}}</h2>
    <div class="searchArea">
      <v-text-field
        v-model="searchCondition.account"
        @keyup.enter="clickSearch"
        outlined dense hide-details
        :label="$t('ID')"
        :placeholder="$t('Input the ID')"
        class="form-input"
        clearable
      ></v-text-field>
      <v-text-field
        v-model="searchCondition.firstName"
        @keyup.enter="clickSearch()"
        :label="$t('Name')"
        :placeholder="`${$t('Input the user name')}`"
        class="form-input ml-3"
        clearable
        outlined dense hide-details
      ></v-text-field>
      <v-select
        v-model="searchCondition.accessLevel"
        :label="$t('User Level')"
        :placeholder="$t('Select the user level')"
        :items="accessLevelItems"
        class="form-select ml-3"
        item-text="name"
        item-value="level"
        outlined dense hide-details
        clearable
      ></v-select>
      <v-btn
        @click="clickSearch"
        text
        class="btn type-search ml-3"
      >{{ $t('Search') }}
      </v-btn>
    </div>
    <v-data-table
      v-model="selected"
      @click:row="openUserEditModal"
      :headers="tableHeaders"
      :items="tableItems"
      :item-class="getRowClass"
      :hide-default-footer="true"
      :options.sync="options"
      item-key="account"
      :items-per-page="10"
      :show-select="true"
      class="tbl-type01 mt-10"
    >
      <template slot="no-data">
        <p> {{ $t('No data available') }} </p>
      </template>
    </v-data-table>
    <userEditPopup
      :dialogUserEdit="dialogUserEdit && !btnDisabledDetail"
      :item="userEditItem"
      :accessLevelItems="accessLevelItems"
      :userAccessLevel="userAccessLevel"
      @closeModal="closeUserEditModal"
      @updateUserInfo="paging"
    ></userEditPopup>
    <div class="table-options">
      <div>
        <userNewPopup
          :accessLevelItems="accessLevelItems"
          :userAccessLevel="userAccessLevel"
          :btnDisabledNewDelete="!btnDisabledNewDelete"
          @updateUserInfo="paging"
        ></userNewPopup>
        <v-btn
          :disabled="btnDisabledNewDelete || checkSelected"
          @click="clickDelete"
          class="btn ml-2"
          text
        >{{ $t('Delete') }}
        </v-btn>
        <v-btn
          :disabled="btnDisabledExport || btnDisabledExportCheckList"
          @click="exportUserInfoList"
          class="btn ml-2"
          text
        >
        {{ $t('Export') }}
        </v-btn>
      </div>
      <div>
        <div class="pageInfo">{{ pageInfoText }}</div>
        <v-pagination
          v-model="page"
          @input="paging"
          :length="pageCount"
          :total-visible="7"
          color="#2f3b4c"
        ></v-pagination>
      </div>
    </div>
    <a ref="link" :style="{ display:'none' }" />
  </div>
</template>

<script>
import EventBus from '@/plugins/eventBus'
import commons from '@/plugins/commons'
import codes from '@/plugins/codes'
import { exportFiles } from '@/plugins/exporter'
import { setTempObj, getTempObj } from '@/plugins/sessionStorageManager'

import userEditPopup from './modal/UserInfoEditPopup'
import userNewPopup from './modal/UserInfoNewPopup'

export default {
  name: 'UserInfo',
  components: {
    userEditPopup,
    userNewPopup
  },
  data () {
    return {
      myAccessLevel: Number(this.$store.state.auth.user.accountInfo.accessLevel),
      productionType: process.env.VUE_APP_PRODUCTION_TYPE,
      userAccessLevel: null,
      btnDisabledNewDelete: null,
      btnDisabledDetail: null,
      btnDisabledExport: null,
      accessLevelItems: [],
      page: 0,
      pageCount: 0,
      pageInfoText: null,
      tableItems: [],
      selected: [],
      options: {},
      ROW_CLASS: 'row-class',
      searchParam: {
        company: '',
        account: '',
        firstName: '',
        accessLevel: '',
        size: '10',
        page: '',
        sort: ''
      },
      searchCondition: {
        account: '',
        firstName: '',
        accessLevel: ''
      },
      dialogUserEdit: false,
      userEditItem: {},

      requestConfig: {}
    }
  },
  computed: {
    tableHeaders () {
      return [
        { text: this.$t('ID'), sortable: true, value: 'account', width: '20%' },
        { text: this.$t('NAME'), sortable: true, value: 'firstName', width: '20%' },
        { text: this.$t('User Level'), sortable: true, value: 'accessLevel', width: '15%' },
        { text: this.$t('STORE MAPPING'), sortable: false, value: 'managedStoreCount', width: '15%' },
        { text: this.$t('LAST MODIFIED DATE'), sortable: true, value: 'lastModifiedDate' }
      ]
    },
    btnDisabledExportCheckList () {
      var flag = true
      if (this.tableItems.length) flag = false
      return flag
    },
    checkSelected () {
      var flag = true
      if (this.selected.length) flag = false
      return flag
    }
  },
  watch: {
    options: function (val) {
      let sortParam = ''
      if (val.sortBy.length && val.sortDesc[0]) {
        sortParam += (val.sortBy[0] + ',DESC')
      } else if (val.sortBy.length && !val.sortDesc[0]) {
        sortParam += (val.sortBy[0] + ',ASC')
      }
      this.searchParam.sort = sortParam
      this.page = 0
      this.searchAccountList()
    },
    searchCondition: {
      handler (newSearchCondition) {
        const userInfo = {
          searchCondition: newSearchCondition,
          searchParam: this.searchParam
        }
        setTempObj('userInfo', userInfo)
      },
      deep: true
    }
  },
  mounted () {
    // button 권한 체크
    // User Info : New / Delete
    this.$store.dispatch('auth/getDisabledBtn', '8100').then(flag => {
      if (this.productionType === 'cloud') {
        this.btnDisabledNewDelete = true
      } else {
        this.btnDisabledNewDelete = flag
      }
    })
    // // User Info : Detail Popup
    this.$store.dispatch('auth/getDisabledBtn', '8101').then(flag => {
      this.btnDisabledDetail = flag
    })
    // //  User Info : Export
    this.$store.dispatch('auth/getDisabledBtn', '8102').then(flag => {
      this.btnDisabledExport = flag
    })
    EventBus.$emit('enableSelectedStores', false)
    this.searchParam.company = this.$store.state.auth.user.company
    // 검색조건 설정
    const userInfoSessionData = getTempObj('userInfo')
    if (!commons.isNull(userInfoSessionData)) {
      if (!commons.isNull(userInfoSessionData.searchCondition)) this.searchCondition = userInfoSessionData.searchCondition
      Object.keys(this.searchCondition).forEach(key => {
        this.searchParam[key] = this.searchCondition[key]
      })
    }
    this.getUserAccessLevel()
    this.getUserLevel()
    this.searchAccountList()
  },
  methods: {
    getPageInfoText (headers, tabelItems) {
      return (headers['x-number'] * 1 * headers['x-size'] + 1) +
          ' to ' + (headers['x-number'] * 1 * headers['x-size'] + tabelItems.length) +
          ', ' + (headers['x-totalelements'] * 1) +
          ' in total'
    },
    convertResponseAccountList (accountList) {
      return accountList.map(responseAccount => {
        const convertedAccount = {}
        convertedAccount.account = responseAccount.account
        convertedAccount.firstName = responseAccount.firstName
        convertedAccount.accessLevel = responseAccount.accessLevel
        convertedAccount.managedStoreCount = responseAccount.managedStoreCount
        convertedAccount.lastModifiedDate = commons.convertDate(responseAccount.lastModifiedDate)
        return convertedAccount
      })
    },
    searchAccountList (page) {
      const config = { params: this.searchParam }
      config.params.page = page - 1
      this.$utils.callAxios(
        codes.requests.getUsers.method,
        codes.requests.getUsers.url,
        config
      )
        .then(res => {
          this.saveRequestConfig(res.config)
          const headers = res.headers
          if (res.data) {
            this.tableItems = this.convertResponseAccountList(res.data.accountList)
          } else this.tableItems = []
          this.pageInfoText = this.getPageInfoText(headers, this.tableItems)
          this.page = headers['x-number'] * 1 + 1
          this.pageCount = headers['x-totalpages'] * 1 || 1
          this.selected = []
        })
    },
    getUserAccessLevel () {
      const config = { params: {} }
      config.params = commons.copy(this.searchParam)
      config.params.account = this.$store.state.auth.user.account
      if (this.productionType === 'cloud') {
        config.params.company = this.$store.state.auth.user.company
      }
      this.$utils.callAxios(
        codes.requests.getUsers.method,
        codes.requests.getUsers.url,
        config
      )
        .then(res => {
          if (res.data) this.userAccessLevel = res.data.accountList.map(data => data.accessLevel)[0]
        })
    },
    getUserLevel () {
      const config = {
        params: {
          company: this.$store.state.auth.user.company
        }
      }
      this.$utils.callAxios(
        codes.requests.getUserAccessLevel.method,
        codes.requests.getUserAccessLevel.url,
        config
      )
        .then(res => {
          if (res.data) {
            this.accessLevelItems = res.data.accessLevelList.map(data => {
              const obj = {}
              obj.name = `${data.title} (${data.accessLevel})`
              obj.level = data.accessLevel
              return obj
            })
          }
        })
    },
    paging (page) { this.searchAccountList(page) },
    clickSearch () {
      Object.keys(this.searchCondition).forEach(key => {
        this.searchParam[key] = this.searchCondition[key]
      })
      this.searchAccountList(1)
    },
    openUserEditModal (item) {
      if (Number(item.accessLevel) <= this.myAccessLevel) return
      this.closeUserEditModal(false)
      this.userEditItem = item
      EventBus.$emit('openUserInfoEditPopup', this.userEditItem)
      this.dialogUserEdit = true
    },
    closeUserEditModal (state) {
      this.dialogUserEdit = state
    },
    saveRequestConfig (config) {
      const requestConfig = {
        url: config.url,
        method: config.method,
        params: config.params
      }
      this.requestConfig = requestConfig
    },
    exportUserInfoList () {
      exportFiles(this.requestConfig, this.$refs.link, 'UserInfoList.xlsx')
    },
    getRowClass () { return codes.ROW_CLASS },
    clickDelete () {
      this.selected.forEach(item => {
        const config = {
          params: {
            company: this.$store.state.auth.user.company,
            myAccessLevel: this.userAccessLevel,
            account: item.account
          }
        }
        this.$utils.callAxios(
          codes.requests.deleteUser.method,
          codes.requests.deleteUser.url,
          config
        )
          .then(res => {
            this.selected = []
            this.paging()
          })
          .catch(error => {
            if (error.response.status === 405) {
              EventBus.$emit('messageAlert', this.$t('Users above their own level cannot be deleted.'))
            }
            this.selected = []
            this.paging()
          })
      })
    }
  }
}
</script>
<style>
.row-class:hover { cursor: pointer; }
</style>
