<template>
  <div>
    <h2 class="page-title-bar"><i class="ico ico-user"></i>{{$t('User Mapping')}}</h2>
    <v-row class="mt-10">
      <v-col cols="4">
        <h3 class="page-sub-title-bar">{{$t('Select the store for mapping')}}</h3>
        <!--
        <v-text-field outlined dense hide-details solo
        placeholder="Input the store code"
        prepend-inner-icon="fa-search"
        class="form-input ico-search mt-5"
        >
        </v-text-field>
        -->
        <div class="select_store_box mt-5">
          <h4 class="select_article is-complete">{{$t('Company')}}</h4>
          <div class="forms-area">
            <v-select
              v-model="selectedCompany"
              :items="companyItems"
              :label="`${$t('Select the company')}`"
              item-text="companyItems.company"
              item-value="companyItems.company"
              @change="changeedCompany()"
              :disabled="disabledCompany"
              clearable:false
              dense
              flat
              hide-details
              solo
            ></v-select>
          </div>
        </div>
        <div class="select_store_box">
          <h4 ref="country" class="select_article">{{$t('Country')}}</h4>
          <div class="forms-area">
            <v-select
              v-model="selectedCountry"
              :items="countryItems"
              :label="`${$t('Select the country')}`"
              @change="changeedCountry()"
              clearable:false
              dense
              flat
              hide-details
              solo
              clearable
            ></v-select>
          </div>
        </div>
        <div class="select_store_box">
          <h4 ref="region" class="select_article">{{$t('Region')}}</h4>
          <div class="forms-area">
            <v-select
              v-model="selectedRegion"
              :items="regionItems"
              :label="`${$t('Select the region')}`"
              @change="changeedRegion()"
              clearable:false
              dense
              flat
              hide-details
              solo
              clearable
            ></v-select>
          </div>
        </div>
        <div class="select_store_box">
          <h4 ref="city" class="select_article">{{$t('City')}}</h4>
          <div class="forms-area">
            <v-select
              v-model="selectedCity"
              :items="cityItems"
              :label="`${$t('Select the city')}`"
              @change="changeedCity()"
              clearable:false
              dense
              flat
              hide-details
              solo
              clearable
            ></v-select>
          </div>
        </div>
        <div class="select_store_box">
          <h4 ref="store" class="select_article">{{$t('Store')}}</h4>
          <div class="forms-area list">
            <v-list>
              <v-list-item-group
              v-model="selectedStore"
              active-class="list-select">
                <v-list-item
                  v-for="(item, i) in storeItems"
                  :key="i"
                  :value="item.code+','+item.name"
                >
                  <v-list-item-content>
                    <v-list-item-title v-text="item.name+'('+item.code+')'"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </div>
        </div>
      </v-col>
      <v-col cols="1" class="d-flex justify-center align-center">
          <img src="@/assets/img/ico-next-step.png" alt="">
      </v-col>
      <v-col cols="7">
        <h3 class="page-sub-title-bar">{{$t('User-Store Mapping')}}</h3>
        <v-data-table
          v-model="selectedSaveUsers"
          :headers="tableHeaders"
          :items="tableItems"
          :page.sync="page"
          :hide-default-footer="true"
          item-key="account"
          show-select
          height="590"
          :single-select="false"
          class="tbl-type02 mt-5 rounded-bl-0"
        >
          <template slot="no-data">
            <p>
              {{ $t('No data available') }}
            </p>
          </template>
        </v-data-table>
        <div>
          <UserPopup :rtnStore="rtnStore" :dialog_UserPopup="dialog_UserPopup" @closeUserPopup="closeUserPopup"></UserPopup>
          <v-btn text class="btn t-bottom" :disabled="buttonDisabled" @click="openUserPopup">{{$t('Add')}}</v-btn>
          <v-btn text class="btn t-bottom ml-2" :disabled="buttonDisabled" @click="deleteUserList">{{$t('Delete')}}</v-btn>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import UserPopup from './modal/AddUserPopup.vue'
import EventBus from '@/plugins/eventBus.js'
import commons from '@/plugins/commons'

export default {
  name: 'UserMapping',
  components: {
    UserPopup
  },
  watch: {
    selectedCountry (value) {
      if (this.$refs.country) {
        if (value === '' || value === undefined) {
          this.$refs.country.classList.remove('is-complete')
        } else {
          this.$refs.country.classList.add('is-complete')
        }
      }
    },
    selectedRegion (value) {
      if (this.$refs.region) {
        if (value === '' || value === undefined) {
          this.$refs.region.classList.remove('is-complete')
        } else {
          this.$refs.region.classList.add('is-complete')
        }
      }
    },
    selectedCity (value) {
      if (this.$refs.city) {
        if (value === '' || value === undefined) {
          this.$refs.city.classList.remove('is-complete')
        } else {
          this.$refs.city.classList.add('is-complete')
        }
      }
    },
    selectedStore (value) {
      if (this.$refs.store) {
        if (value === '') {
          this.$refs.store.classList.remove('is-complete')
        } else {
          this.$refs.store.classList.add('is-complete')
        }
      }
      if (this.selectedStore) {
        const store = this.selectedStore.split(',')
        if (store.length > 0) {
          this.selectedStoreCode = store[0]
          this.selectedStoreName = store[1]
        }
      }
      this.getUserList()
    }
  },
  data () {
    return {
      productionType: process.env.VUE_APP_PRODUCTION_TYPE,
      dialog_UserPopup: false,
      buttonDisabled: false,
      page: 1,
      pageCount: 0,
      selectedSaveUsers: [],
      disabledCompany: true,
      selectedCompany: '',
      selectedCountry: '',
      selectedRegion: '',
      selectedCity: '',
      selectedStoreCode: '',
      selectedStoreName: '',
      searchStoreItems: [],
      rtnStore: {},
      selectedStore: {},
      companyItems: [],
      countryItems: [],
      regionItems: [],
      cityItems: [],
      storeItems: [],
      requests: {
        searchActon: {
          method: 'get',
          url: '/api/common/account/mapping'
        },
        deleteAction: {
          method: 'delete',
          url: '/api/common/account/mapping'
        }
      },
      tableItems: []
    }
  },
  computed: {
    tableHeaders () {
      return [
        { text: this.$t('User ID'), sortable: false, align: 'center', value: 'account' },
        { text: this.$t('Level'), sortable: false, align: 'center', value: 'accessLevel' }
      ]
    }
  },
  methods: {
    changeedCompany () {
      this.selectedCountry = ''
      this.selectedRegion = ''
      this.selectedCity = ''
      this.selectedStore = ''
      this.regionItems = []
      this.cityItems = []
      this.storeItems = []
      this.setCountry()
      this.getUserList()
    },
    changeedCountry () {
      this.selectedRegion = ''
      this.selectedCity = ''
      this.selectedStore = ''
      this.regionItems = []
      this.cityItems = []
      this.storeItems = []
      this.setRegion()
      this.getUserList()
    },
    changeedRegion () {
      this.selectedCity = ''
      this.selectedStore = ''
      this.cityItems = []
      this.storeItems = []
      this.setCity()
      this.getUserList()
    },
    changeedCity () {
      this.selectedStore = ''
      this.storeItems = []
      this.setStore()
      this.getUserList()
    },
    changeedStore () {

    },
    saveRequestConfig: function (config) {
      const requestConfig = {
        url: config.url,
        method: config.method,
        params: config.params
      }
      this.requestConfig = requestConfig
    },
    buildParmas: function () {
      const params = {
        account: this.$store.state.auth.user.account,
        company: this.$store.state.auth.user.company,
        country: commons.isValue(this.selectedCountry),
        region: commons.isValue(this.selectedRegion),
        city: commons.isValue(this.selectedCity),
        store: this.selectedStoreCode
      }
      return params
    },
    async getUserList () {
      const params = this.buildParmas()
      const config = { params }
      config.params.company = await this.$utils.getCompany()
      this.$utils
        .callAxios(
          this.requests.searchActon.method,
          this.requests.searchActon.url,
          config
        )
        .then(res => {
          this.saveRequestConfig(res.config)
          this.tableItems = res.data.accountList
          this.totalRecords = res.data.accountList.length
        })
        .catch(error => {
          console.debug(`Could not find a user list. erorr: ${error}`)
        })
    },
    deleteUserList: function () {
      const data = { accountList: [] }
      // TODO: Replace below 'store' value with the real one.
      const params = { }
      // if (this.productionType === 'cloud') {
      //   params.company = this.$store.state.auth.user.company
      // }
      for (const list of this.selectedSaveUsers) {
        data.accountList.push({ account: list.account })
      }
      data.company = this.selectedCompany
      data.country = this.selectedCountry
      data.region = this.selectedRegion
      data.city = this.selectedCity
      data.store = this.selectedStoreCode

      if (this.selectedSaveUsers.length < 1) return
      const config = {
        data: data,
        params: params
      }
      this.$utils
        .callAxios(
          this.requests.deleteAction.method,
          this.requests.deleteAction.url,
          config
        )
        .then((res) => {
          const result = res.data
          this.selectedSaveUsers = []
          EventBus.$emit('messageAlert', this.$t('Deleted successfully'))

          if (result.responseCode === '200') {
            this.getUserList()
          }
        })
        .catch(error => {
          if (error.response.data.responseCode === '405' &&
          error.response.data.responseMessage.startsWith('Users above their own level cannot be deleted')) {
            EventBus.$emit('messageAlert', this.$t(error.response.data.responseMessage))
          }
        })
    },
    openUserPopup () {
      this.rtnStore = {
        company: this.selectedCompany,
        country: this.selectedCountry,
        region: this.selectedRegion,
        city: this.selectedCity,
        store: this.selectedStoreCode
      }
      this.dialog_UserPopup = true
    },
    closeUserPopup () {
      this.dialog_UserPopup = false
      this.getUserList()
    },
    async setCompany () {
      this.searchStoreItems = this.$store.state.dataStore.managedStores
      this.searchStoreItems.forEach(store => {
        if (this.companyItems.indexOf(store.company) === -1) {
          this.companyItems.push(store.company)
        }
      })
      if (
        !commons.isNull(this.companyItems) &&
        this.companyItems.length > 0
      ) {
        this.selectedCompany = this.companyItems.filter((comp) => !commons.isNull(comp))[0]
      } else {
        let fallBackCompany = this.$store.state.auth.user.company
        this.companyItems.push(fallBackCompany)
        this.selectedCompany = fallBackCompany
        if (commons.isNull(fallBackCompany)) {
          fallBackCompany = await this.$utils.getCompany(
            this.$store.state.auth.user.company
          )
        }
        this.companyItems.push(fallBackCompany)
        this.selectedCompany = fallBackCompany
      }
    },
    setCountry () {
      // this.searchStoreItems = this.$store.getters['dataStore/GET_STORE_ITEMS']
      this.countryItems = []
      this.searchStoreItems.forEach(row => {
        // if (this.selectedCompany === '') this.selectedCompany = row.company

        if (this.countryItems.indexOf(row.country) === -1) {
          if (this.selectedCompany === row.company) {
            this.countryItems.push(row.country)
          }
        }
      })
    },
    setRegion () {
      this.searchStoreItems.forEach(row => {
        if (this.regionItems.indexOf(row.region) === -1) {
          if (this.selectedCountry === row.country) {
            this.regionItems.push(row.region)
          }
        }
      })
    },
    setCity () {
      this.searchStoreItems.forEach(row => {
        if (this.cityItems.indexOf(row.city) === -1) {
          if (this.selectedRegion === row.region) {
            this.cityItems.push(row.city)
          }
        }
      })
    },
    setStore () {
      this.searchStoreItems.forEach(row => {
        if (this.selectedCity.indexOf(row.city) !== -1) {
          this.storeItems.push({ code: row.code, name: row.name })
        }
      })
    },
    clearModal () {
      this.selectedCountry = ''
      this.selectedRegion = ''
      this.selectedCity = ''
      this.selectedStore = ''
      this.regionItems = []
      this.cityItems = []
      this.storeItems = []
    },
    saveMainStoreModal () {
      const StoreSlit = this.selectedStore.split(',')
      let code = ''
      let name = ''
      if (StoreSlit.length > 0) {
        code = StoreSlit[0]
        name = StoreSlit[1]
      }
      this.rtnStore = {
        company: this.selectedCompany,
        country: this.selectedCountry,
        region: this.selectedRegion,
        city: this.selectedCity,
        code: code,
        name: name
      }
      this.clearModal()
      // this.$emit('closeMainStoreModal', rtnStore, false)
    }
  },
  mounted () { // init
    if (this.productionType === 'cloud') {
      this.disabledCompany = false
    }
    //  User Mapping : Add / Delete
    this.$store.dispatch('auth/getDisabledBtn', '8200').then(flag => {
      this.buttonDisabled = flag
    })

    // 상단 공통 팝업 & 자동완성기능 사용유무
    EventBus.$emit('enableSelectedStores', false)

    // seleted Store 값이 없으면 Popup
    // if (!this.$store.getters['dataStore/IS_SELECTED_STORE']) {
    //   EventBus.$emit('openSelectedStores')
    // }

    // this.setCountry()
    this.setCompany()
    this.setCountry()
    if (this.selectedCity !== '') this.$refs.city.classList.add('is-complete')

    this.getUserList()
  }
}
</script>
