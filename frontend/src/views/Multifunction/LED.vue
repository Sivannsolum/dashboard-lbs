<template>
  <section>
    <h2 class="page-title-bar"><i class="ico ico-multi"></i>{{$t('LED Info')}}</h2>
    <figure class="imgBox mt-10">
      <img src="@/assets/img/img-led-guide.jpg" alt="LED CONFIGURATION GUIDE">
    </figure>
    <!-- LED info Data table -->
    <v-data-table
      @click:row="openLedPopup"
      item-key="id"
      :headers="tableHeaders"
      :items="tableItems"
      :hide-default-footer="true"
      :item-class="getRowClass"
      class="tbl-type01 mt-10"
    >
      <template slot="no-data">
        <p>
          {{ $t('No data available') }}
        </p>
      </template>
    </v-data-table>
    <!-- 하단 버튼 삭제-->
    <LedPopup :selectedItem="selectedItem" :dialogPopup="dialogPopup" @reload="reload"></LedPopup>
  </section>
</template>

<script>
import LedPopup from './modal/LedPopup'

import EventBus from '@/plugins/eventBus'
import codes from '@/plugins/codes'

export default {
  name: 'LED',
  components: {
    LedPopup
  },
  data () {
    return {
      productionType: process.env.VUE_APP_PRODUCTION_TYPE,
      dialogPopup: false,
      buttonDisabled: false,
      selectedItem: null,
      tableItems: [],
      requests: {
        getLedList: {
          method: 'get',
          url: '/api/common/functions/led/pattern'
        }
      }
    }
  },
  computed: {
    tableHeaders () {
      return [
        { text: '#', sortable: false, align: 'center', value: 'id' },
        { text: this.$t('PATTERN NAME'), sortable: false, value: 'patternName' },
        { text: this.$t('A) ON TIME(MSEC)'), sortable: false, value: 'onTime' },
        { text: this.$t('B) OFF TIME(MSEC)'), sortable: false, value: 'offTime' },
        { text: this.$t('C) IDLE TIME(SEC)'), sortable: false, value: 'idleTime' },
        { text: this.$t('D) ACTIVE COUNT'), sortable: false, value: 'repeatCount' }
      ]
    }
  },
  mounted () {
    //  LED Info : New Pattern / Delete
    this.$store.dispatch('auth/getDisabledBtn', '6200').then(flag => {
      this.buttonDisabled = flag
    })

    // 상단 공통 팝업 & 자동완성기능 사용유무
    EventBus.$emit('enableSelectedStores', false)

    this.getLedList()
  },
  methods: {
    getLedList () {
      const data = {}
      const params = {}
      params.company = this.$store.state.auth.user.company
      const config = {
        data: data,
        params: params
      }
      this.$utils
        .callAxios(
          this.requests.getLedList.method,
          this.requests.getLedList.url,
          config
        )
        .then((res) => {
          const result = res.data

          if (result.responseCode === '200') {
            this.tableItems = result.ledConfigList
          }
        })
    },
    openLedPopup (item) {
      //  LED Info : New Pattern / Delete
      if (!this.buttonDisabled) {
        this.dialogPopup = false
        this.selectedItem = item
        this.dialogPopup = true
      }
    },
    reload (refresh) {
      this.dialogPopup = false
      if (refresh) this.getLedList()
    },
    getRowClass () { return codes.ROW_CLASS }
  }
}

</script>

<style>
</style>
