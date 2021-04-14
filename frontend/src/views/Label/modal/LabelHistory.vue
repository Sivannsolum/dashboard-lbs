<template>
    <v-dialog
          v-model="historyDialog"
          width="700"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="openHistory"><img src="@/assets/img/ico-history.png" alt=""></v-btn>
          </template>

          <v-card class="popup add_store_popup">
          <div class="popup-titbox">
            <h3 class="page-title-bar"><i class="ico ico-label"></i>{{ $t('Label History') }}</h3>
           <!--  <p class="txt-info">
              Last update : 01/01/20
              <v-btn icon><img src="@/assets/img/ico_refresh.png" alt=""></v-btn>
            </p> -->
          </div>

          <div class="historyScrollBox" v-for="(list, index) in labelHistory.timelineInfo" v-bind:key="list.labelCode">
            <div class="historyBox">
              <div class="topBar">
                <p class="txt">
                  <span class="num">#{{index+1}}</span>
                  <strong>txSeq : {{list.txSequence}}</strong>
                </p>
                <p class="date">BATCH DATE : <span>{{convertDate(list.created)}}</span></p>
              </div>
              <table class="historyInfo">
                <colgroup>
                  <col style="width:40%">
                  <col style="width:30%">
                  <col style="width:30%">
                </colgroup>
                <thead>
                  <tr>
                    <th>PAGE NUMBER</th>
                    <th>STATUS</th>
                    <th>STATUS TIME</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="childItem in list.pageInfo"  v-bind:key="childItem.pageNumber">
                    <td>{{childItem.pageNumber}}</td>
                    <td>{{childItem.status}}</td>
                    <td>{{convertDate(childItem.lastUpdated)}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <v-card-actions class="d-flex justify-center">
            <v-btn text icon @click="historyDialog = false" class="btn">Close</v-btn>
          </v-card-actions>
          </v-card>
        </v-dialog>
</template>
<script>
// import EventBus from '@/plugins/eventBus'
import commons from '@/plugins/commons'
import codes from '@/plugins/codes'

export default {
  props: {
    item: {
      type: Object
    }
  },
  data () {
    return {
      productionType: process.env.VUE_APP_PRODUCTION_TYPE,
      selectedStore: this.$store.getters['dataStore/GET_SELECTED_STORE'],
      historyDialog: false,
      countries: {},
      labelHistory: []
    }
  },
  methods: {
    openHistory () {
      this.getHistory()
    },
    convertDate: function (input) {
      return commons.convertDate(input)
    },
    getHistory () {
      const config = {
        params: {
          company: this.selectedStore.company,
          store: this.selectedStore.code,
          label: this.item.id
        }
      }
      this.$utils.callAxios(
        codes.requests.getLabelHistoryList.method,
        codes.requests.getLabelHistoryList.url,
        config).then(res => {
        this.labelHistory = res.data
      })
    }
  },
  mounted () {
  }
}
</script>
