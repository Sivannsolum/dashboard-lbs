<template>
  <v-dialog
    v-model="summaryVisible"
    persistent
    :retain-focus="false"
    width="750"
    @click:outside="toggleSummary()"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" :disabled="buttonDisabled" text small>{{item.storeName}}</v-btn>
    </template>

    <v-card class="popup">
      <h3 class="page-title-bar"><i class="ico ico-store"></i>{{$t('Store Detail')}}</h3>

      <!-- Label Status monitoring -->
      <div class="main-section">
        <h3 class="tit-section">{{$t('Label Status Monitoring')}}</h3>
        <div class="group">
          <v-row>
              <v-col>
                <dl class="stateBox danger">
                  <dt>{{$t('Update Success')}}</dt>
                  <dd>
                    <p><strong> {{ getPercentage(storeSummary.updatedLabelCount, storeSummary.totalUpdatedLabelCount ) }}%</strong></p>
                    <p>{{ storeSummary.updatedLabelCount }}ea / {{ storeSummary.totalUpdatedLabelCount  }}ea</p>
                  </dd>
                </dl>
              </v-col>
              <v-col>
                <dl class="stateBox caution">
                  <dt>{{$t('Processing')}}</dt>
                  <dd>
                    <p><strong>{{ getPercentage(storeSummary.inProgressLabelCount, storeSummary.totalUpdatedLabelCount ) }}%</strong></p>
                    <p>{{ storeSummary.inProgressLabelCount }}ea / {{ storeSummary.totalUpdatedLabelCount  }}ea</p>
                  </dd>
                </dl>
              </v-col>
              <v-col>
                <dl class="stateBox stable">
                  <dt>{{$t('Update Failure')}}</dt>
                  <dd>
                    <p><strong>{{ getPercentage(storeSummary.notUpdatedLabelCount, storeSummary.totalUpdatedLabelCount ) }}%</strong></p>
                    <p>{{ storeSummary.notUpdatedLabelCount }}ea / {{ storeSummary.totalUpdatedLabelCount  }}ea</p>
                  </dd>
                </dl>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <dl class="stateBox">
                  <dt>{{$t('Total Product')}}</dt>
                  <dd>
                    <p><strong>{{ storeSummary.totalProductCount }}</strong></p>
                  </dd>
                </dl>
              </v-col>
              <v-col>
                <dl class="stateBox">
                  <dt>{{$t('Total Assigned Product')}}</dt>
                  <dd>
                    <p><strong>{{ storeSummary.totalAssignedProductCount }}</strong></p>
                  </dd>
                </dl>
              </v-col>
              <v-col>
                <dl class="stateBox">
                  <dt>{{$t('Total Label')}}</dt>
                  <dd>
                    <p><strong>{{ storeSummary.totalLabelCount }}</strong></p>
                  </dd>
                </dl>
              </v-col>
            </v-row>
        </div>
      </div>

      <!-- Exception State monitoring -->
      <div class="main-section mt-4">
        <h3 class="tit-section">{{$t('Exception Status Monitoring')}}</h3>
        <div class="group">
          <v-row>
            <v-col>
              <dl class="stateBox danger">
                <dt>{{$t('Offline ESL')}}</dt>
                <dd>
                  <p><strong>{{ storeSummary.offlineLabelCount }}</strong></p>
                </dd>
              </dl>
            </v-col>
            <v-col>
              <dl class="stateBox stable">
                <dt>{{$t('Bad Signal')}}</dt>
                <dd>
                  <p><strong>{{ storeSummary.badSignalLabelCount }}</strong></p>
                </dd>
              </dl>
            </v-col>
            <v-col>
              <dl class="stateBox caution">
                <dt>{{$t('Low Battery')}}</dt>
                <dd>
                  <p><strong>{{ storeSummary.lowBatteryCount }}</strong></p>
                </dd>
              </dl>
            </v-col>
            <v-col>
              <dl class="stateBox">
                <dt>{{$t('Misused')}}</dt><!-- 09.27 텍스트 수정 -->
                <dd>
                  <p><strong>{{ storeSummary.misUsedLabelCount }}</strong></p>
                </dd>
              </dl>
            </v-col>
          </v-row>
        </div>
      </div>

      <v-card-actions class="d-flex justify-center">
        <v-btn text icon @click="goToStore()" class="btn">{{$t('Go to the store')}}</v-btn>
        <v-btn text icon @click="toggleSummary()" class="btn">{{$t('Cancel')}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import EventBus from '@/plugins/eventBus.js'

export default {
  props: ['item', 'user', 'buttonDisabled'],
  data () {
    return {
      // cloud 용 임시
      productionType: process.env.VUE_APP_PRODUCTION_TYPE,
      summaryVisible: false,
      store: null,
      selected: [],
      page: 1,
      pageCount: 0,
      storeSummary: {
        updatedLabelCount: '',
        inProgressLabelCount: '',
        notUpdatedLabelCount: '',
        totalProductCount: '',
        totalAssignedProductCount: '',
        totalLabelCount: '',
        offlineLabelCount: '',
        badSignalLabelCount: '',
        lowBatteryCount: '',
        misUsedLabelCount: ''
      },
      requests: {
        getStoreSummary: {
          method: 'get',
          url: '/api/common/store/summary'
        }
      }
    }
  },
  methods: {
    toggleSummary () {
      this.summaryVisible = !this.summaryVisible
    },
    goToStore () {
      this.$store.dispatch('dataStore/UPDATE_SELECTED_STORE', this.store)
      EventBus.$emit('reFreshSelectedStores', this.store)
      this.$router.push('/')
    },
    makeDesc (storeInfo) {
      let desc = [storeInfo.company, storeInfo.country, storeInfo.region, storeInfo.city, storeInfo.storeName]
      desc = desc.filter(d => (d !== undefined && d !== null))
      desc = desc.join('>')
      if (storeInfo.store !== null && storeInfo.store !== undefined) desc += `(${storeInfo.store})`
      return desc
    },
    buildStore (storeInfo) {
      const store = {
        code: storeInfo.store,
        name: storeInfo.storeName,
        company: storeInfo.company,
        country: storeInfo.country,
        region: storeInfo.region,
        city: storeInfo.city,
        description: this.makeDesc(storeInfo)
      }
      return store
    },
    getStoreSummary: function (storeCode) {
      const params = { store: storeCode }
      const config = { params }
      // cloud 용 임시
      if (this.productionType === 'cloud') {
        // params.company = this.$store.state.auth.user.company
        params.company = this.item.company
      }

      this.$utils
        .callAxios(
          this.requests.getStoreSummary.method,
          this.requests.getStoreSummary.url,
          config
        )
        .then(res => {
          this.store = this.buildStore(res.data)

          if (this.productionType === 'cloud') this.store.company = this.item.company

          this.storeSummary = res.data
        })
    },
    getPercentage: function (subValue, momValue) {
      let per = 0
      if (momValue > 0) {
        per = ((subValue / momValue) * 100).toFixed(1) // 소수점 1, 정수 반환subValue / momValue
      } else {
        per = 0
      }
      const fl = Math.floor(per)
      if ((per - fl) * 10 === 0) {
        per = fl
      }
      return per
    }
  },
  mounted () {
    this.getStoreSummary(this.item.store)
  }
}
</script>
