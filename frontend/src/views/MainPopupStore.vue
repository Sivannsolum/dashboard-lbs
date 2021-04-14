<template>
  <v-dialog v-model="dialog_store" @click:outside="clickOutside()" width="550">
    <v-card class="popup add_store_popup">
      <h3 class="page-title-bar">
        <i class="ico ico-overview"></i>{{ $t("Select the store") }}
      </h3>
      <div>
        <div class="select_store_box">
          <h4 ref="company" class="select_article is-complete">
            {{ $t("Company") }}
          </h4>
          <div class="forms-area">
            <v-select
              v-model="selectedCompany"
              :items="companyItems"
              :label="`${$t('Select the company')}`"
              item-text="companyItems.company"
              item-value="companyItems.company"
              @change="handleCompanyChange()"
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
          <h4 ref="country" :class="getAreaClass('Country')">
            {{ $t("Country") }}
          </h4>
          <div class="forms-area">
            <v-select
              v-model="selectedCountry"
              :items="countryItems"
              :label="`${$t('Select the country')}`"
              item-text="countryItems.country"
              item-value="countryItems.country"
              @change="handleCountryChange()"
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
          <h4 ref="region" :class="getAreaClass('Region')">
            {{ $t("Region") }}
          </h4>
          <div class="forms-area">
            <v-select
              v-model="selectedRegion"
              :items="regionItems"
              :label="`${$t('Select the region')}`"
              @change="handleRegionChange()"
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
          <h4 ref="city" :class="getAreaClass('City')">{{ $t("City") }}</h4>
          <div class="forms-area">
            <v-select
              v-model="selectedCity"
              :items="cityItems"
              :label="`${$t('Select the city')}`"
              @change="handleCityChange()"
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
          <h4 ref="store" :class="getAreaClass('Store')">{{ $t("Store") }}</h4>
          <div class="forms-area list">
            <v-list>
              <v-list-item-group
                v-model="selectedStore"
                active-class="list-select"
              >
                <v-list-item
                  v-for="(item, i) in storeItems"
                  :key="i"
                  :value="item"
                >
                  <v-list-item-content @dblclick="saveMainStoreModal(item)">
                    <v-list-item-title
                      v-text="item.name + '(' + item.code + ')'"
                    ></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </div>
        </div>
      </div>
      <v-card-actions class="d-flex justify-center">
        <v-btn
          @click="saveMainStoreModal()"
          class="btn"
          text
          icon
          >{{ $t("Select") }}</v-btn
        >
        <v-btn @click="closeModal()" class="btn" text icon>{{
          $t("Cancel")
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import EventBus from '@/plugins/eventBus.js'
import commons from '@/plugins/commons'
import codes from '@/plugins/codes'

export default {
  props: {
    dialog_store: Boolean
  },
  data () {
    return {
      user: '',
      productionType: process.env.VUE_APP_PRODUCTION_TYPE,
      selected: [],
      page: 1,
      pageCount: 0,
      templateGroupEnable: null,
      disabledCompany: true,
      selectedCompany: '',
      selectedCountry: '',
      selectedRegion: '',
      selectedCity: '',
      selectedStore: {},
      searchStoreItems: [],
      companyItems: [],
      countryItems: [],
      regionItems: [],
      cityItems: [],
      storeItems: [],
      store: {
        company: '',
        country: [],
        city: []
      }
    }
  },
  computed: {
    cloudMode () {
      return this.productionType === codes.productionTypes.CLOUD
    }
  },
  watch: {
    dialog_store () {
      if (this.dialog_store) {
        this.setPopupData()
      }
    }
  },
  created () {
    this.user = this.$store.state.auth.user
  },
  mounted () {
    this.initiateMainPopupStore()
  },
  methods: {
    async initiateMainPopupStore () {
      await this.setPopupData()
      if (this.productionType === 'cloud') this.disabledCompany = false
      EventBus.$on('setMainPopupCompany', () => this.setCompany())
    },
    getCloudStores () {
      let company = ''
      if (this.selectedCompany) {
        company = this.selectedCompany
      } else {
        company = this.user.company
      }
      const config = {
        params: { company: company, account: this.user.account, isLoginResponse: true }
      }
      return this.$utils
        .callAxios(
          codes.requests.getCloudStores.method,
          codes.requests.getCloudStores.url,
          config
        )
        .then((res) => {
          this.templateGroupEnable = res.data.templateGroupEnable
          return res.data.managedStores
        })
    },
    async setPopupData () {
      this.searchStoreItems = this.$store.state.dataStore.managedStores
      if (this.productionType === codes.productionTypes.CLOUD) this.searchStoreItems = await this.getCloudStores()
      this.selectedStore = this.getSelectedStore()
      await this.setCompany()
      if (this.selectedStore && this.selectedStore.company) this.selectedCompany = this.selectedStore.company
      this.setCountry()
      this.selectedCountry = this.selectedStore.country
      this.setRegion()
      this.selectedRegion = this.selectedStore.region
      this.setCity()
      this.selectedCity = this.selectedStore.city
      this.setStore()
    },
    getSelectedStore () {
      const store = this.$store.state.dataStore.selectedStore
      if (store.company === undefined) store.company = ''
      if (store.country === undefined) store.country = ''
      if (store.region === undefined) store.region = ''
      if (store.city === undefined) store.city = ''
      if (store.code === undefined) store.code = ''
      if (store.name === undefined) store.name = ''
      return store
    },
    getAreaClass: function (target) {
      let complete = false
      switch (target) {
        case 'Country':
          complete = commons.isValidStr(this.selectedCountry)
          break
        case 'Region':
          complete = commons.isValidStr(this.selectedRegion)
          break
        case 'City':
          complete = commons.isValidStr(this.selectedCity)
          break
        case 'Store':
          complete = this.selectedCity && commons.isValidStr(this.selectedCity)
          break
        default:
          break
      }
      return complete ? 'select_article is-complete' : 'select_article'
    },
    async handleCompanyChange () {
      this.selectedCountry = null
      this.selectedRegion = null
      this.selectedCity = null
      this.selectedStore = null
      this.regionItems = []
      this.cityItems = []
      this.storeItems = []
      if (this.cloudMode) {
        this.searchStoreItems = await this.getCloudStores()
        this.setCountry()
      }
      this.handleCountryChange()
    },
    handleCountryChange () {
      this.selectedRegion = null
      this.selectedCity = null
      this.selectedStore = null
      this.regionItems = []
      this.cityItems = []
      this.storeItems = []
      this.setRegion()
    },
    handleRegionChange () {
      this.selectedCity = null
      this.selectedStore = null
      this.cityItems = []
      this.storeItems = []
      this.setCity()
    },
    handleCityChange () {
      this.selectedStore = null
      this.storeItems = []
      this.setStore()
    },
    async setCompany () {
      this.selectedCompany = null
      if (this.productionType === codes.productionTypes.CLOUD) {
        this.companyItems = this.$store.state.auth.user.companyList
        this.searchStoreItems = await this.getCloudStores()
        this.selectedCompany = this.$store.state.auth.user.company
      } else {
        this.searchStoreItems = this.$store.state.dataStore.managedStores
        this.companyItems = []
        this.searchStoreItems.forEach((store) => {
          // user.managedStore에서 company 추출, companyItems에 담음.
          this.companyItems.push(store.company)
        })
        if (
          !commons.isNull(this.companyItems) &&
          this.companyItems.length > 0
        ) {
          // companyItems에서 첫 번째 company를 설정.
          this.selectedCompany = this.companyItems.filter((comp) => !commons.isNull(comp)).pop()
        }
        if (!commons.isValidStr(this.selectedCompany)) {
          // store없이 등록한 company인 경우
          this.selectedCompany = await this.$utils.getCompany()
          if (!commons.isNull(this.selectedCompany)) this.companyItems.push(this.selectedCompany)
        }
      }
      this.setCountry()
    },
    setCountry () {
      this.countryItems = []
      this.searchStoreItems.forEach((row) => {
        if (!commons.isNull(row.country) && !this.countryItems.includes(row.country)) {
          if (this.selectedCompany === row.company && row.company !== null) {
            this.countryItems.push(row.country)
          }
        }
      })
    },
    setRegion () {
      this.regionItems = []
      this.searchStoreItems.forEach((row) => {
        if (!commons.isNull(row.region) && !this.regionItems.includes(row.region)) {
          if (this.selectedCountry === row.country && row.country !== null) {
            this.regionItems.push(row.region)
          }
        }
      })
    },
    setCity () {
      this.cityItems = []
      this.searchStoreItems.forEach((row) => {
        if (!commons.isNull(row.city) && !this.cityItems.includes(row.city)) {
          if (this.selectedRegion === row.region && row.region !== null) {
            this.cityItems.push(row.city)
          }
        }
      })
    },
    setStore () {
      this.storeItems = []
      if (this.selectedCity === undefined) this.selectedCity = null
      this.searchStoreItems.forEach((row) => {
        if (
          this.selectedCity !== null &&
          this.selectedCity.startsWith(row.city) &&
          row.city !== null
        ) {
          this.storeItems.push({ code: row.code, name: row.name })
        }
      })
    },
    clickOutside () {
      this.closeModal()
    },
    closeModal () {
      this.$emit('closeMainStoreModal', null, false)
    },
    clearModal () {
      this.selectedCountry = null
      this.selectedRegion = null
      this.selectedCity = null
      this.selectedStore = null
      this.regionItems = []
      this.cityItems = []
      this.storeItems = []
    },
    saveMainStoreModal (selectedItem = this.selectedStore) {
      const selectedStore = {
        company: this.selectedCompany,
        country: this.selectedCountry,
        region: this.selectedRegion,
        city: this.selectedCity,
        code: selectedItem ? selectedItem.code : '',
        name: selectedItem ? selectedItem.name : ''
      }

      if (this.productionType === codes.productionTypes.CLOUD) {
        this.$store.dispatch('auth/UPDATE_COMPANY', this.selectedCompany)
        if (this.templateGroupEnable) {
          this.$store.dispatch('auth/UPDATE_TEMPLATEGROUP', this.templateGroupEnable)
        }
      }
      this.clearModal()
      this.$emit('closeMainStoreModal', selectedStore, false)
      this.$store.dispatch('dataStore/UPDATE_SELECTED_STORE', selectedStore)
    }
  }
}
</script>
