<template>
  <div class="home">
    <h2 class="page-title-bar">
      <i class="ico ico-overview"></i>{{ $t('Overview') }}
    </h2>
    <div>
      <div class="state-info">
        <ul>
          <li class="state-danger">{{ $t('DANGER') }}</li>
          <li class="state-caution">{{ $t('CAUTION') }}</li>
          <li class="state-stable">{{ $t('STABLE') }}</li>
        </ul>
      </div>
      <!-- Label Status: 2020.09.24버튼추가 -->
      <div class="main-layout layout01">
        <div class="main-section">
          <h3 class="tit-section">{{ $t('Label Status') }}</h3>
          <div class="group">
            <v-btn class="stateBox">
              <router-link
                :to="{}"
                @click.native.prevent="
                  goDirectPage(
                    '2100',
                    { name: 'Label Info', params: { status: 'SUCCESS' } },
                    updatedLabelCount
                  )
                "
              >
                <dl>
                  <dt>{{ $t('Update Success') }}</dt>
                  <dd>
                    <p>
                      <strong>{{ percentUpdateSuccess }}%</strong>
                    </p>
                    <p>
                      {{ updatedLabelCount | currency }}ea /
                      {{ totalUpdatedLabelCount | currency }}ea
                    </p>
                  </dd>
                </dl>
              </router-link>
            </v-btn>
            <v-btn class="stateBox">
              <router-link
                :to="{}"
                @click.native.prevent="
                  goDirectPage(
                    '2100',
                    { name: 'Label Info', params: { status: 'PROCESSING' } },
                    inProgressLabelCount
                  )
                "
              >
                <dl>
                  <dt>{{ $t('Processing') }}</dt>
                  <dd>
                    <p>
                      <strong>{{ percentProcessing }}%</strong>
                    </p>
                    <p>
                      {{ inProgressLabelCount | currency }}ea /
                      {{ totalUpdatedLabelCount | currency }}ea
                    </p>
                  </dd>
                </dl>
              </router-link>
            </v-btn>
            <v-btn ref="UpdateFailure" class="stateBox">
              <router-link
                :to="{}"
                @click.native.prevent="
                  goDirectPage(
                    '2100',
                    { name: 'Label Info', params: { status: 'TIMEOUT' } },
                    notUpdatedLabelCount,
                    problemStoreVisible('updateFailure')
                  )
                "
              >
                <dl>
                  <dt>{{ $t('Update Failure') }}</dt>
                  <dd>
                    <p>
                      <strong>{{ percentUpdateFailure }}%</strong>
                    </p>
                    <p>
                      {{ notUpdatedLabelCount | currency }}ea /
                      {{ totalUpdatedLabelCount | currency }}ea
                    </p>
                  </dd>
                </dl>
              </router-link>
            </v-btn>
            <v-btn class="stateBox">
              <router-link
                :to="{}"
                @click.native.prevent="
                  goDirectPage(
                    '3100',
                    { name: 'Product Info' },
                    totalProductCount
                  )
                "
              >
                <dt>{{ $t('Total Product') }}</dt>
                <dd>
                  <p>
                    <strong>{{ totalProductCount | currency }}</strong>
                  </p>
                </dd>
              </router-link>
            </v-btn>
            <dl class="stateBox">
              <dt>{{ $t('Total Assigned Product') }}</dt>
              <dd>
                <p>
                  <strong>{{ totalAssignedProductCount | currency }}</strong>
                </p>
              </dd>
            </dl>
            <v-btn class="stateBox ml_10">
              <router-link
                :to="{}"
                @click.native.prevent="
                  goDirectPage(
                    '2100',
                    { name: 'Label Info', params: { status: null } },
                    totalLabelCount
                  )
                "
              >
                <dl>
                  <dt>{{ $t('Total Label') }}</dt>
                  <dd>
                    <p>
                      <strong>{{ totalLabelCount | currency }}</strong>
                    </p>
                  </dd>
                </dl>
              </router-link>
            </v-btn>
          </div>
        </div>
        <!-- Exception Status -->
        <div class="main-section">
          <h3 class="tit-section">{{ $t('Exception Status') }}</h3>
          <div class="group">
            <v-btn ref="LabelOffline" class="stateBox">
              <router-link
                :to="{}"
                @click.native.prevent="
                  goDirectPage(
                    '2100',
                    { name: 'Label Info', params: { network: 'false' } },
                    offlineLabelCount,
                    problemStoreVisible('labelOffline')
                  )
                "
              >
                <dt>{{ $t('Label Offline') }}</dt>
                <dd>
                  <p>
                    <strong>{{ offlineLabelCount | currency }}</strong>
                  </p>
                </dd>
              </router-link>
            </v-btn>
            <v-btn ref="LowBattery" class="stateBox">
              <router-link
                :to="{}"
                @click.native.prevent="
                  goDirectPage(
                    '2100',
                    { name: 'Label Info', params: { battery: 'BAD' } },
                    lowBatteryCount,
                    problemStoreVisible('lowBattery')
                  )
                "
              >
                <dt>{{ $t('Low Battery') }}</dt>
                <dd>
                  <p>
                    <strong>{{ lowBatteryCount | currency }}</strong>
                  </p>
                </dd>
              </router-link>
            </v-btn>
            <v-btn ref="BadSignal" class="stateBox">
              <router-link
                :to="{}"
                @click.native.prevent="
                  goDirectPage(
                    '2100',
                    { name: 'Label Info', params: { signal: 'BAD' } },
                    badSignalLabelCount,
                    problemStoreVisible('badSignal')
                  )
                "
              >
                <dt>{{ $t('Bad Signal') }}</dt>
                <dd>
                  <p>
                    <strong>{{ badSignalLabelCount | currency }}</strong>
                  </p>
                </dd>
              </router-link>
            </v-btn>
            <v-btn ref="Misused" class="stateBox">
              <router-link
                :to="{}"
                @click.native.prevent="
                  goDirectPage(
                    '2100',
                    { name: 'Label Info', params: { misusedLabelType: 'All' } },
                    misUsedLabelCount,
                    problemStoreVisible('misused')
                  )
                "
              >
                <dt>{{ $t('Misused') }}</dt>
                <dd>
                  <p>
                    <strong>{{ misUsedLabelCount | currency }}</strong>
                  </p>
                </dd>
              </router-link>
            </v-btn>
          </div>
        </div>
      </div>
      <!-- Gateway Status: 20.09.24 버튼 추가 -->
      <div class="main-layout layout02">
        <div class="main-section">
          <h3 class="tit-section">{{ $t('Gateway Status') }}</h3>
          <div class="group">
            <v-btn ref="GatewayStatus" class="stateBox">
              <dl>
                <router-link
                  :to="{}"
                  @click.native.prevent="
                    goDirectPage(
                      '4100',
                      { name: 'Gateway Info', params: { network: 'offline' } },
                      offlineGwCount,
                      problemStoreVisible('gatewayOffline')
                    )
                  "
                >
                  <dt>{{ $t('Gateway Offline') }}</dt>
                  <dd>
                    <p>
                      <strong>{{ offlineGwCount | currency }}</strong>
                    </p>
                  </dd>
                </router-link>
              </dl>
            </v-btn>
            <v-btn class="stateBox">
              <dl>
                <router-link
                  :to="{}"
                  @click.native.prevent="
                    goDirectPage(
                      '4100',
                      { name: 'Gateway Info', params: { network: 'all' } },
                      totalGwCount
                    )
                  "
                >
                  <dt>{{ $t('Total Gateway') }}</dt>
                  <dd>
                    <p>
                      <strong>{{ totalGwCount | currency }}</strong>
                    </p>
                  </dd>
                </router-link>
              </dl>
            </v-btn>
          </div>
        </div>
        <!-- Update Status -->
        <div class="main-section">
          <h3 class="tit-section">{{ $t('Update Status') }}</h3>
          <div
            id="progress-linear"
            class="graphBox"
            v-bind:style="{ display: progressBarShow }"
          >
            <h4 class="tit-sub">{{ $t('Latest Update Status') }}</h4>
            <div class="lineBar">
              <v-slider
                readonly
                dense
                hide-details
                track-color="#ffffff"
                v-model="percentProgress"
                class="linear-graph"
              ></v-slider>
              <div class="bar_data">
                <strong>{{ getPercent(lastUpdateInprogressCount, lastUpdatetotalCount) }}%</strong>
                <p>
                  {{ lastUpdateInprogressCount | currency }}ea /
                  {{ lastUpdatetotalCount | currency }}ea
                </p>
              </div>
            </div>
          </div>
          <div class="graphBox">
            <h4 class="tit-sub">{{ $t('Total Update Order') }}</h4>
            <mixChart
              v-show="progressBarShow === 'none'"
              :height="250"
              :updateStatus="updateStatus"
            ></mixChart>
            <mixChart
              v-show="progressBarShow === 'block'"
              :height="160"
              :updateStatus="updateStatus"
            ></mixChart>
          </div>
        </div>
      </div>
    </div>
    <!-- 문제발생 Store 리스트 팝업 -->
    <v-dialog
      v-model="problemDialog"
      @click:outside="problemDialog = false"
      width="800"
    >
      <v-card class="popup add_store_popup">
        <h3 class="page-title-bar">
          <i class="ico ico-overview"></i>{{ $t('Abnormal Store') }}
        </h3>

        <v-data-table
          :headers="translateHeaders(ProblemHeaders)"
          :items="ProblemItems"
          :hide-default-footer="true"
          item-key="id"
          class="tbl-type01 mt-10"
          @page-count="pageCount = $event"
        >
          <template v-slot:[`item.link`]="{ item }">
            <v-btn text @click="goProblemLink(item)"
              ><img src="@/assets/img/ico_link.png" alt="aaa"
            /></v-btn>
          </template>
        </v-data-table>
        <v-card-actions class="d-flex justify-center">
          <v-btn text icon @click="problemDialog = false" class="btn">{{
            $t('Close')
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import mixChart from '@/components/modal/HomeMixChart'
import EventBus from '@/plugins/eventBus'
import commons from '@/plugins/commons'
import codes from '@/plugins/codes'

export default {
  name: 'Summary',
  components: {
    mixChart
  },
  data () {
    return {
      serverType: process.env.VUE_APP_PRODUCTION_TYPE,
      ProblemHeaders: [
        {
          text: '#',
          value: 'no',
          width: '10%',
          sortable: false,
          align: 'center'
        },
        { text: 'STORE NAME', value: 'storeName', sortable: false },
        {
          text: 'STORE CODE',
          width: '30%',
          value: 'storeCode',
          sortable: false
        },
        {
          text: 'Abnormal Label',
          width: '20%',
          value: 'count',
          sortable: false
        },
        { text: '', value: 'link', width: '10%', sortable: false }
      ],
      company: 'company',
      account: 'account',
      progressBarShow: 'block',
      mixChartActive: true,
      updatedLabelCount: 0,
      percentUpdateSuccess: 0,
      inProgressLabelCount: 0,
      totalUpdatedLabelCount: 0,
      percentProcessing: 0,
      notUpdatedLabelCount: 0,
      percentUpdateFailure: 0,
      totalProductCount: 0,
      totalAssignedProductCount: 0,
      totalLabelCount: 0,

      offlineLabelCount: 0,
      lowBatteryCount: 0,
      badSignalLabelCount: 0,
      misUsedLabelCount: 0,

      offlineGwCount: 0,
      totalGwCount: 0,

      percentProgress: 0,
      lastUpdateInprogressCount: 0,
      lastUpdatetotalCount: 0,

      updateStatus: [],
      problemDialog: false,
      problemType: '',
      problemLink: {},
      ProblemItems: []
    }
  },
  computed: {
    selectedStore () {
      return this.$store.getters['dataStore/GET_SELECTED_STORE']
    }
  },
  watch: {
    selectedStore (store) {
      this.getSummarySearch(store)
    }
  },
  mounted () {
    // Set the overview page's initial data.
    if (commons.isValidData(this.selectedStore).result) {
      this.getSummarySearch(this.selectedStore)
    } else {
      this.getSummarySearch({
        company: this.$store.state.auth.user.company,
        country: '',
        region: '',
        city: '',
        code: ''
      })
    }
    // 상단 공통 팝업 & 자동완성기능 사용유무
    EventBus.$emit('enableSelectedStores', true)
  },
  methods: {
    pushRoute (route) {
      this.$router.push(route).catch(error => {
        console.warn(
          `Failed to send user to original target page. error: ${error}`
        )
      })
    },
    translateHeaders (headers) {
      return headers.map(header => {
        header.text = this.$t(header.text)
        return header
      })
    },
    problemStoreVisible (problemType, val = 1) {
      const problem = {
        visible: Number(val) > 0,
        problemType: problemType
      }
      return problem
    },
    setProblemHeaderData (problemType) {
      if (problemType === 'gatewayOffline') {
        this.ProblemHeaders = [
          {
            text: '#',
            value: 'no',
            width: '10%',
            sortable: false,
            align: 'center'
          },
          { text: 'STORE NAME', value: 'storeName', sortable: false },
          {
            text: 'STORE CODE',
            width: '30%',
            value: 'storeCode',
            sortable: false
          },
          {
            text: 'Abnormal Gateway',
            width: '20%',
            value: 'count',
            sortable: false
          },
          { text: '', value: 'link', width: '10%', sortable: false }
        ]
      } else {
        this.ProblemHeaders = [
          {
            text: '#',
            value: 'no',
            width: '10%',
            sortable: false,
            align: 'center'
          },
          { text: 'STORE NAME', value: 'storeName', sortable: false },
          {
            text: 'STORE CODE',
            width: '30%',
            value: 'storeCode',
            sortable: false
          },
          {
            text: 'Abnormal Label',
            width: '20%',
            value: 'count',
            sortable: false
          },
          { text: '', value: 'link', width: '10%', sortable: false }
        ]
      }
    },
    showProblemPopup (problemType, route) {
      this.getProblemList(
        {
          company: this.$store.state.auth.user.company,
          country: '',
          region: '',
          city: '',
          code: ''
        },
        problemType
      )
      this.problemLink = route
    },
    goDirectPage (menuCode, route, value, problem = { visible: false }) {
      if (value === 0) return // 0이상인 경우만 실행, 그 외에는 중지.
      if (
        commons.notEmpty(this.$store.state.dataStore.selectedStore) && // Store 선택이 되어있고,
        this.$store.state.dataStore.selectedStore.code !== '' // Store 값이 비어있지 않다면.
      ) {
        this.$store.dispatch('auth/isAccessMenu', menuCode).then(flag => {
          if (flag && value > 0) this.pushRoute(route) // 선택되어있는 Store로 이동.
        })
      } else {
        // Store가 선택되어 있지 않은 경우.
        if (problem.visible === true) {
          // Problem popup을 띄우는 항목이라면 Problem popup data 설정하고 띄움.
          this.setProblemHeaderData(problem.problemType)
          this.showProblemPopup(problem.problemType, route)
        } else {
          // Problem popup을 띄우는 항목이 아니라면 지정된 링크로 이동해서 Store 선택.
          this.$store.dispatch('auth/isAccessMenu', menuCode).then(flag => {
            if (flag && value > 0) this.pushRoute(route)
          })
        }
      }
    },
    getPercent (a, b) {
      if (b < 1) return 0
      let percentage = 0
      percentage = ((a / b) * 100).toFixed(2).toString().split('.')
      const left = percentage[0]
      const right = percentage[0].substring(0, 1)
      return `${left}.${right}`
    },
    buildParams (selectedStore) {
      const params = {
        account: this.$store.state.auth.user.account,
        aliveStatusEnabled: true,
        aliveInterval: this.$store.getters['auth/GET_INTERVAL'],
        company: commons.isValue(selectedStore.company),
        country: commons.isValue(selectedStore.country),
        region: commons.isValue(selectedStore.region),
        city: commons.isValue(selectedStore.city),
        store: commons.isValue(selectedStore.code)
      }
      return params
    },
    getColorState (value, caution, danger) {
      let state = 'stable'
      if (Number(value) >= Number(caution)) state = 'caution'
      if (Number(value) >= Number(danger)) state = 'danger'
      return state
    },
    setAlertSetting (alertSetting) {
      // Label Status / Update Failure
      this.$refs.UpdateFailure.$el.classList.add(
        this.getColorState(
          this.percentUpdateFailure,
          alertSetting.labelUpdatedCaution,
          alertSetting.labelUpdatedDanger
        )
      )
      // Gateway Status / Gateway offline
      this.$refs.GatewayStatus.$el.classList.add(
        this.getColorState(
          this.getPercent(this.offlineGwCount, this.totalGwCount),
          alertSetting.gwOfflineCaution,
          alertSetting.gwOfflineDanger
        )
      )
      // Exception Status / Label Offline
      this.$refs.LabelOffline.$el.classList.add(
        this.getColorState(
          this.getPercent(this.offlineLabelCount, this.totalLabelCount),
          alertSetting.labelOfflineCaution,
          alertSetting.labelOfflineDanger
        )
      )
      // Exception Status / Low Battery
      this.$refs.LowBattery.$el.classList.add(
        this.getColorState(
          this.getPercent(this.lowBatteryCount, this.totalLabelCount),
          alertSetting.labelLowBatteryCaution,
          alertSetting.labelLowBatteryDanger
        )
      )
      // Exception Status / Bad Signal
      this.$refs.BadSignal.$el.classList.add(
        this.getColorState(
          this.getPercent(this.badSignalLabelCount, this.totalLabelCount),
          alertSetting.labelSignalCaution,
          alertSetting.labelSignalDanger
        )
      )
      // Exception Status / Misused
      this.$refs.Misused.$el.classList.add(
        this.getColorState(
          this.misUsedLabelCount,
          alertSetting.labelMisusedCaution,
          alertSetting.labelMisusedDanger
        )
      )
    },
    getAlertSetting () {
      const config = {}
      if (this.serverType === 'cloud') {
        if (commons.notEmpty(this.selectedStore.company)) {
          config.params = { company: this.selectedStore.company }
        } else {
          config.params = { company: this.$store.state.auth.user.company }
        }
      }
      this.$utils
        .callAxios(
          codes.requests.getAlertSetting.method,
          codes.requests.getAlertSetting.url,
          config
        )
        .then(res => {
          if (res.data) this.setAlertSetting(res.data)
        })
    },
    goProblemLink (problemStore) {
      problemStore = this.$store.state.dataStore.managedStores.find(store => store.code === problemStore.storeCode)
      const selectedStore = {
        company: problemStore.company,
        country: problemStore.country,
        region: problemStore.region,
        city: problemStore.city,
        code: problemStore.code,
        name: problemStore.name
      }
      if (this.productionType === codes.productionTypes.CLOUD) {
        this.$store.dispatch('auth/UPDATE_COMPANY', problemStore.company)
      }
      this.$store.dispatch('dataStore/UPDATE_SELECTED_STORE', selectedStore)
      this.pushRoute(this.problemLink)
    },
    getProblemList (selectedStore, problemType) {
      if (selectedStore === undefined) {
        selectedStore = this.$store.state.dataStore.selectedStore
      }
      const params = this.buildParams(selectedStore)
      params.problemType = problemType
      const config = { params }
      this.$utils
        .callAxios(
          codes.requests.getProblemAction.method,
          codes.requests.getProblemAction.url,
          config
        )
        .then(res => {
          if (res.data.problemStoreList === undefined) {
            throw new TypeError('Count not find any problem list.')
          }
          if (res.data.responseCode === '200') {
            this.ProblemItems = res.data.problemStoreList.map(
              (problemStore, index) => {
                problemStore.no = index + 1
                return problemStore
              }
            )
            this.problemDialog = true
          } else {
            EventBus.$emit('messageAlert', this.$t(res.data.responseMessage))
          }
        })
        .catch(error => {
          console.debug(`Failed to get problematic store list. Error: ${error}`)
        })
    },
    getSummarySearch (selectedStore) {
      this.initSummary()
      const params = this.buildParams(selectedStore)
      const config = { params }
      this.$utils
        .callAxios(
          codes.requests.getSummaryAction.method,
          codes.requests.getSummaryAction.url,
          config
        )
        .then(res => {
          if (res.data.responseCode === '200') {
            this.setSummary(res.data)
          } else {
            if (res.status === 204) return
            EventBus.$emit('messageAlert', this.$t(res.data.responseMessage))
          }
        })
        .catch(error => {
          console.debug(`Failed to load store summary. error: ${error}`)
        })
    },
    initSummary () {
      this.lastUpdateTime = 0
      // ##### Label Status #####
      this.updatedLabelCount = 0
      this.totalUpdatedLabelCount = 0
      this.percentUpdateSuccess = 0
      this.inProgressLabelCount = 0
      this.percentProcessing = 0
      this.notUpdatedLabelCount = 0
      this.percentUpdateFailure = 0
      this.totalProductCount = 0
      this.totalAssignedProductCount = 0
      this.totalLabelCount = 0
      // ##### Exception Status #####
      this.offlineLabelCount = 0
      this.lowBatteryCount = 0
      this.badSignalLabelCount = 0
      this.misUsedLabelCount = 0
      // ##### GateWay #####
      this.offlineGwCount = 0
      this.totalGwCount = 0
      // ##### Progress bar #####
      this.progressBarShow = 'none'
      this.lastUpdateInprogressCount = 0
      this.lastUpdatetotalCount = 0
      this.percentProgress = 0
      // ##### Chart #####
      this.mixChartActive = true
      this.updateStatus = []
      // color setting
    },
    setSummary (data) {
      this.lastUpdateTime = data.lastUpdateTime
      // ##### Label Status #####
      this.updatedLabelCount = data.updatedLabelCount
      this.totalUpdatedLabelCount = data.totalUpdatedLabelCount
      this.percentUpdateSuccess = this.getPercent(
        data.updatedLabelCount,
        data.totalUpdatedLabelCount
      )
      this.inProgressLabelCount = data.inProgressLabelCount
      this.percentProcessing = this.getPercent(
        data.inProgressLabelCount,
        data.totalUpdatedLabelCount
      )
      this.notUpdatedLabelCount = data.notUpdatedLabelCount
      this.percentUpdateFailure = this.getPercent(
        data.notUpdatedLabelCount,
        data.totalUpdatedLabelCount
      )
      this.totalProductCount = data.totalProductCount
      this.totalAssignedProductCount = data.totalAssignedProductCount
      this.totalLabelCount = data.totalLabelCount
      // ##### Exception Status #####
      this.offlineLabelCount = data.offlineLabelCount
      this.lowBatteryCount = data.lowBatteryCount
      this.badSignalLabelCount = data.badSignalLabelCount
      this.misUsedLabelCount = data.misUsedLabelCount
      // ##### GateWay #####
      this.offlineGwCount = data.offlineGwCount
      this.totalGwCount =
        data.offlineGwCount + data.notReadyGwCount + data.onlineGwCount
      // ##### Progress bar #####
      if (
        data.lastUpdateInprogressCount === 0 &&
        this.serverType === 'server'
      ) {
        this.progressBarShow = 'none'
      } else {
        this.progressBarShow = 'block'
      }
      this.lastUpdateInprogressCount = data.lastUpdateInprogressCount
      this.lastUpdatetotalCount = data.lastUpdatetotalCount
      this.percentProgress = this.getPercent(
        this.lastUpdateInprogressCount,
        this.lastUpdatetotalCount
      )

      this.percentProgress = Math.floor(this.percentProgress)

      // ##### Chart #####
      this.mixChartActive = true
      this.updateStatus = data.updateStatus
      // color setting
      this.getAlertSetting()
    }
  }
}
</script>
