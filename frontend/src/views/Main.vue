<template>
  <div class="wrapper">
    <div class="navigation">
      <h1 class="logo">
        <img src="@/assets/img/logo.png" alt="solum esl dashboard" />
      </h1>
      <button type="button" class="btn-nav-fold">
        <img src="@/assets/img/expandMenu-small.png" alt="열기" />
      </button>
      <!-- 좌측 메뉴 -->
      <Navigator />
    </div>
    <!-- 우측 콘텐츠 -->
    <div class="contentsWarp">
      <!-- 콘텐츠 헤더: 공통 -->
      <header class="header">
        <!-- Store 검색창 -->
        <div ref="searchPublicBar" class="search">
          <v-form class="d-flex align-center">
            <!-- Store 선택팝업 -->
            <v-btn
              :disabled="searchPublicBarDisabled"
              class="btn-search"
              @click="openSearchStore()"
              text
            >
              <img
                v-show="true"
                ref="searchIconON"
                src="@/assets/img/ico-top-search.png"
                alt=""
              />
              <img
                v-show="false"
                ref="searchIconOFF"
                src="@/assets/img/ico-top-search-disabled.png"
                alt=""
              />
            </v-btn>
            <popupStore
              :search="searchStore"
              :dialog_store="dialog_store"
              @closeMainStoreModal="closeMainStoreModal"
            ></popupStore>
            <v-autocomplete
              v-model="searchStore"
              :items="computedStoreItems"
              :filter="searchStoreFilter"
              :loading="isLoading"
              item-text="description"
              item-value="stores"
              :search-input.sync="searchStoreLording"
              :placeholder="`${$t('Select the store')}`"
              :disabled="searchPublicBarDisabled"
              color="red"
              return-object
            >
            </v-autocomplete>
          </v-form>
        </div>
        <div class="d-flex align-center">
          <p key="selectedStore" class="h_storeInfo">{{ selectedStoreText }}</p>
          <!-- 언어선택 -->
          <div class="h_lang drop-down">
            <button type="button" @click="toggleDropdown" class="btn-dropdown">
              {{ currentLanguage }}
            </button>
            <ul class="drop-box">
              <li>
                <button type="button" @click="changLanguage('en')">
                  English
                </button>
              </li>
              <li>
                <button type="button" @click="changLanguage('ko')">
                  한국어
                </button>
              </li>
              <li>
                <button type="button" @click="changLanguage('de')">
                  Deutsche
                </button>
              </li>
              <li>
                <button type="button" @click="changLanguage('fr')">
                  Francais
                </button>
              </li>
              <li>
                <button type="button" @click="changLanguage('zh')">
                  中文
                </button>
              </li>
              <li>
                <button type="button" @click="changLanguage('es')">
                  Espanol
                </button>
              </li>
              <li>
                <button type="button" @click="changLanguage('it')">
                  Italiano
                </button>
              </li>
              <li>
                <button type="button" @click="changLanguage('por')">
                  Portugal
                </button>
              </li>
              <li>
                <button type="button" @click="changLanguage('jp')">
                  日本語
                </button>
              </li>
            </ul>
          </div>
          <!-- 사용자 정보 -->
          <div class="h_member drop-down">
            <button type="button" @click="toggleDropdown" class="btn-dropdown">
              {{ displayUserId }} <i>{{ user.accountGroup }}</i>
            </button>
            <div class="drop-box">
              <div class="_member">
                <p class="name">{{ user.firstName }}</p>
                <p class="id">(ID : {{ displayUserId }})</p>
              </div>
              <div class="myAccount">
                <router-link :to="{ path: MyAccountLink }">{{
                  $t('My Account')
                }}</router-link>
              </div>
              <div class="dashboard_ver">
                <p>SoftWare</p>
                <div
                  class="versionInfo"
                  v-bind:style="{
                    display: productionType === 'server' ? 'block' : 'none'
                  }"
                >
                  <p>Release Version : {{ user.releaseVersion }}</p>
                  <p>Dashboard : {{ DashBoard_Release }}</p>
                  <p>Core : {{ user.coreRevision }}</p>
                  <p>Portal : {{ user.portalRevision }}</p>
                </div>
                <div
                  class="versionInfo"
                  v-bind:style="{
                    display: productionType === 'cloud' ? 'block' : 'none'
                  }"
                >
                  <p>Release Version : {{ cloudVersion.baseVersion }}</p>
                  <p>
                    {{ cloudVersion.dashboard.name }} :
                    {{ cloudVersion.dashboard.version }}
                  </p>
                  <p>
                    {{ cloudVersion.apiService.name }} :
                    {{ cloudVersion.apiService.version }}
                  </p>
                  <p>
                    {{ cloudVersion.ig.name }} : {{ cloudVersion.ig.version }}
                  </p>
                  <p>
                    {{ cloudVersion.inbound.name }} :
                    {{ cloudVersion.inbound.version }}
                  </p>
                  <p>
                    {{ cloudVersion.outbound.name }} :
                    {{ cloudVersion.outbound.version }}
                  </p>
                </div>
              </div>
              <div>
                <v-btn class="btn-logout" @click="onLogout" text width="100%">
                  {{ $t('Log out') }}
                </v-btn>
              </div>
              <main-privacy-policy />
            </div>
          </div>
        </div>
      </header>
      <!-- 콘텐츠 -->
      <div class="contents">
        <router-view></router-view>
      </div>
    </div>
    <!--Message -->
    <div>
      <v-dialog v-model="messageDialog" width="300">
        <v-card class="popup add_store_popup" align="center" justify="center">
          <v-row>
            <v-col>
              <span v-text="messageText"></span>
            </v-col>
          </v-row>
          <v-card-actions class="d-flex justify-center">
            <v-btn text icon @click="messageDialog = false" class="btn"
              >OK</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <!-- Loading -->
    <div>
      <v-dialog v-model="loadingDialog" width="300" persistent>
        <v-card class="popup add_store_popup" align="center" justify="center">
          <v-row>
            <v-col>
              <span v-text="loadingText"></span>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-progress-linear value="15" indeterminate></v-progress-linear>
            </v-col>
          </v-row>
        </v-card>
      </v-dialog>
    </div>
    <!-- 로딩바 레이어 -->
    <div :class="{ loadingLayer: loadingApi, loadingLayerOff: !loadingApi }">
      <div class="loadingBar">
        <v-progress-circular
          indeterminate
          :size="50"
          :width="7"
          color="#ddd"
        ></v-progress-circular>
      </div>
    </div>
  </div>
</template>

<script>
// utils
import EventBus from '@/plugins/eventBus.js'
import commons from '@/plugins/commons'
import configs from '@/plugins/configs'
// components
import popupStore from './MainPopupStore'
import Navigator from '@/components/Navigator'
import { keepUserSignedIn, clearIntervals } from '@/plugins/healthCheck'
import MainPrivacyPolicy from '@/views/MainPrivacyPolicy'
// etc
import '@/assets/css/main.css'

// cloud
import { cloudLogout } from '@/adLogin/authPopup'

export default {
  name: 'Main',
  components: {
    Navigator,
    popupStore,
    MainPrivacyPolicy
  },
  data () {
    return {
      productionType: process.env.VUE_APP_PRODUCTION_TYPE,
      requests: {
        getCloudVersion: {
          method: 'get',
          url: '/api/common/version'
        },
        getUser: {
          method: 'get',
          url: '/api/common/account/detail'
        },
        logoutUser: {
          method: 'get',
          url: '/api/common/logout'
        }
      },
      searchPublicBarDisabled: false,
      currentLanguage: 'English',
      displayUserId: '',
      drawer: null,
      dialog_store: false,
      messageDialog: false,
      messageText: '',
      loadingApi: false,
      loadingDialog: false,
      loadingText: '',
      searchStore: {},
      searchStoreLording: null,
      isLoading: false,
      user: {},
      DashBoard_Release: '',
      MyAccountLink: '/User/MyAccount',
      cloudVersion: {
        baseVersion: null,
        dashboard: {
          name: null,
          version: null
        },
        apiService: {
          name: null,
          version: null
        },
        ig: {
          name: null,
          version: null
        },
        inbound: {
          name: null,
          version: null
        },
        outbound: {
          name: null,
          version: null
        }
      }
    }
  },
  computed: {
    selectedStore () {
      return this.$store.state.dataStore.selectedStore
    },
    searchStoreItems () {
      return this.$store.state.dataStore.managedStores
    },
    computedStoreItems () {
      return this.searchStoreItems.map(item => {
        let description = ''
        if (item.company !== null) {
          description += item.company
          if (item.country !== null) {
            description += ' > ' + item.country
            if (item.region !== null) {
              description += ' > ' + item.region
              if (item.city !== null) {
                description += ' > ' + item.city
                if (item.code !== null) {
                  description += ' > ' + item.name + '(' + item.code + ') '
                }
              }
            }
          }
        }
        return Object.assign({}, item, { description })
      })
    },
    selectedStoreText () {
      const selectedStore = this.selectedStore
      if (commons.notEmpty(selectedStore)) {
        const company = commons.isValue(selectedStore.company)
        const country = commons.isValue(selectedStore.country)
        const region = commons.isValue(selectedStore.region)
        const city = commons.isValue(selectedStore.city)
        const code = commons.isValue(selectedStore.code)
        const name = commons.isValue(selectedStore.name)
        const storeInfo = `${company} ${country} ${region} ${city} (${name}:${code})`
        return storeInfo.length > 45
          ? `${storeInfo.substring(0, 45)}...`
          : storeInfo
      } else {
        return ''
      }
    }
  },
  watch: {
    searchStore (store) {
      this.$store.dispatch('dataStore/UPDATE_SELECTED_STORE', store)
      if (this.productionType === 'cloud') {
        // this.searchStoreItems 갱신
        this.setManagedStores(store.company)
      }
    },
    searchPublicBarDisabled (disabled) {
      this.$refs.searchIconON.style.display = disabled ? 'none' : 'block'
      this.$refs.searchIconOFF.style.display = disabled ? 'block' : 'none'
    },
    searchStoreLording (val) {}
  },
  created () {
    EventBus.$on('setSearchStore', store => {
      this.searchStoreItems = [store, ...this.searchStoreItems]
      this.searchStore = this.searchStoreItems.shift()
    })
    // open Select Store Popup
    EventBus.$on('openSelectedStores', () => {
      this.openSearchStore()
    })
    // enable Select Store Popup
    EventBus.$on('enableSelectedStores', state => {
      this.searchPublicBarDisabled = !state
    })
    EventBus.$on('reFreshSelectedStores', store => {
      if (store && !commons.isNull(store.code)) this.searchStore = store
    })
    EventBus.$on('setManagedStores', () => {
      this.setManagedStores()
    })
    // open message Alert
    EventBus.$on('messageAlert', (text, type) => {
      if (!type) {
        this.messageText = text
        this.messageDialog = true
      } else if (type === 'YesNo') {
        this.messageText = text + type
        this.messageDialog = true
      }
    })
    // loading v-progress-circular on
    EventBus.$on('loadingOn', () => {
      if (!this.loadingApi) this.loadingApi = true
    })
    // loading v-progress-circular off
    EventBus.$on('loadingOff', () => {
      if (this.loadingApi) this.loadingApi = false
    })
    EventBus.$on('toggleLoadingModal', text => {
      this.loadingText = this.$t(text)
      this.loadingDialog = !this.loadingDialog
    })
    EventBus.$on('autoLogout', () => {
      this.onLogout()
    })
  },
  methods: {
    changLanguage (code) {
      if (code === undefined) {
        code = this.$store.getters['dataStore/GET_CURRENT_LANGUAGE']
      }
      let codeName = ''
      switch (code) {
        case 'en':
          codeName = 'English'
          break
        case 'ko':
          codeName = '한국어'
          break
        case 'de':
          codeName = 'Deutsche'
          break
        case 'fr':
          codeName = 'Francais'
          break
        case 'zh':
          codeName = '中文'
          break
        case 'es':
          codeName = 'Espanol'
          break
        case 'it':
          codeName = 'Italiano'
          break
        case 'por':
          codeName = 'Portugal'
          break
        case 'jp':
          codeName = '日本語'
          break
        default:
          codeName = 'English'
          code = 'en'
      }
      this.$i18n.locale = code
      this.currentLanguage = codeName
      this.$store.dispatch('dataStore/UPDATE_CURRENT_LANGUAGE', code)
      this.$forceUpdate()
    },
    processCloudLogout () {
      const uniqueId = this.$store.state.auth.tokenAPI.uniqueId
      this.$store
        .dispatch('auth/logout')
        .then(res => {
          this.$store.dispatch('dataStore/CLEAN')
          cloudLogout(uniqueId)
        })
        .catch(error => {
          this.$store.dispatch('dataStore/CLEAN')
          this.loading = false
          this.message = error.message
        })
    },
    onLogout () {
      if (this.productionType === 'cloud') {
        if (this.$store.state.auth.tokenAPI) {
          this.processCloudLogout()
        }
      }
      const params = { account: this.user.account }
      const config = { params: params }
      this.$utils
        .callAxios(
          this.requests.logoutUser.method,
          this.requests.logoutUser.url,
          config
        )
        .finally(() => {
          this.$store
            .dispatch('auth/logout')
            .catch(error => {
              this.loading = false
              this.message = error.message
            })
            .finally(() => {
              this.$store.dispatch('dataStore/CLEAN')
              this.$router.push('/login')
            })
        })
    },
    closeModal (state) {
      this.dialog_store = state
    },
    closeMainStoreModal (store, state) {
      this.dialog_store = state
      if (store && !commons.isNull(store.code)) this.searchStore = store
    },
    openSearchStore () {
      this.dialog_store = true
    },
    searchStoreFilter (item, queryText, itemText) {
      const itemStore = item.description.toLowerCase()
      const searchText = queryText.toLowerCase()
      return itemStore.indexOf(searchText) > -1
    },
    autoComplateSearch (val) {},
    toggleDropdown (event) {
      event.target.classList.toggle('isOpenend')
      // 09.27 버튼 외 화면 클릭시 메뉴 안보이게 처리
      document.addEventListener('click', function (e) {
        if (e.target !== event.target) {
          event.target.classList.remove('isOpenend')
        }
      })
    },
    getUserInfo () {
      this.user = this.$store.state.auth.user
      if (this.productionType === 'cloud') {
        this.displayUserId = this.$store.state.auth.user.tokenEmail
      } else {
        this.displayUserId = this.$store.state.auth.user.account
      }
    },
    setManagedStores (company) {
      if (!company) company = this.$store.state.auth.user.company
      const config = {
        params: {
          account: this.$store.state.auth.user.account,
          company: company
        }
      }
      this.$utils
        .callAxios(
          this.requests.getUser.method,
          this.requests.getUser.url,
          config
        )
        .then(res => {
          const data = res.data
          this.$store.dispatch('dataStore/UPDATE_MANAGED_STORE', data)
          EventBus.$emit('setMainPopupCompany')
        })
    },
    setCloudVersion () {
      const config = {
        params: {}
      }
      this.$utils
        .callAxios(
          this.requests.getCloudVersion.method,
          this.requests.getCloudVersion.url,
          config
        )
        .then(res => {
          this.cloudVersion = res.data
        })
    }
  },
  mounted () {
    if (this.$store.state.dataStore.staySignedIn) keepUserSignedIn()
    this.DashBoard_Release = configs.Release
    this.changLanguage()
    this.searchStore = this.$store.getters['dataStore/GET_SELECTED_STORE']
    this.getUserInfo()

    if (this.productionType === 'cloud') {
      this.MyAccountLink = '/User/MyAccountCloud'
      this.setCloudVersion()
    }
  },
  beforeDestroy () {
    EventBus.$off('setSearchStore')
    EventBus.$off('openSelectedStores')
    EventBus.$off('reFreshSelectedStores')
    EventBus.$off('enableSelectedStores')
    EventBus.$off('setManagedStores')
    EventBus.$off('messageAlert')
    EventBus.$off('loadingOn')
    EventBus.$off('loadingOff')
    commons.clearVuex()
  },
  destroyed () {
    clearIntervals()
  }
}
</script>
