<template>
  <div>
    <h2 class="page-title-bar"><i class="ico ico-system"></i>{{$t('App Config')}}</h2>

    <h3 class="tit-group mt-10">{{$t('Assign Barcode')}}</h3>

    <!-- data table -->
    <table class="tbl-custom-type01 max-80 center-1">
      <colgroup>
        <col style="width:20%">
        <col style="width:30%">
        <col>
      </colgroup>
      <thead>
        <tr>
          <th>#</th>
          <th>{{$t('Enable/Disable')}}</th>
          <th>{{$t('Custom Field')}}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Default</td>
          <td>{{mappedArticleId}}</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Enabled</td>
          <td>
            {{mappedReservedOne}}
             <!--
            <v-dialog
              v-model="dialog"
              width="400"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn text v-bind="attrs" v-on="on" class="btn-app">
                  Product ID
                   <img width="24" height="24" src="@/assets/img/ico-upload-file.gif" >
                </v-btn>
              </template>

              <v-card class="popup add_store_popup">
                <h3 class="page-title-bar"><i class="ico ico-system"></i>Select the article</h3>

                <v-text-field outlined dense hide-details solo
                  placeholder="Input the field"
                  prepend-inner-icon="fa-search"
                  class="form-input ico-search"
                >
                </v-text-field>

                <p class="field-head mt-5">Field</p>
                <v-list dense
                  height="250"
                  class="list-selector custom-scroll"
                >
                  <v-list-item-group>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>Description</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>Product ID</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>PLU</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>Retail Price</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>Description</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>Product ID</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>PLU</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>Retail Price</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>

                <v-card-actions class="d-flex justify-center">
                  <v-btn text icon @click="dialog = false" class="btn">Select</v-btn>
                  <v-btn text icon @click="dialog = false" class="btn">Cancel</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            -->
          </td>
        </tr>
        <tr>
          <td>3</td>
          <td>{{$t('')}}Enabled</td>
          <td>
            {{mappedReservedTwo}}
            <!--
            <v-btn text class="btn-app">
              Self ID
              <img width="24" height="24" src="@/assets/img/ico-upload-file.gif" >
            </v-btn>
            -->
          </td>
        </tr>
        <tr>
          <td>4</td>
          <td>{{$t('')}}Enabled</td>
          <td>
            {{mappedReservedThree}}
            <!--
            <v-btn text class="btn-app">
              Self ID
              <img width="24" height="24" src="@/assets/img/ico-upload-file.gif" >
            </v-btn>
            -->
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 하단 옵션 -
    <div class="table-options">
      // button group
      <div>
        <v-btn text class="btn">Save</v-btn>
      </div>
    </div>
    -->
  </div>
</template>

<script>
import EventBus from '@/plugins/eventBus.js'

export default {
  name: 'AppConfig',
  data () {
    return {
      dialog: false,
      mappedArticleId: '',
      mappedReservedOne: '',
      mappedReservedTwo: '',
      mappedReservedThree: '',
      requests: {
        getReserved: {
          method: 'get',
          url: '/api/common/articles/map/reserved'
        }
      }
    }
  },
  methods: {
    getReserved () {
      const data = {}
      const params = {}
      params.company = this.$store.state.auth.user.company
      const config = {
        data: data,
        params: params
      }
      this.$utils
        .callAxios(
          this.requests.getReserved.method,
          this.requests.getReserved.url,
          config
        )
        .then((res) => {
          const result = res.data

          if (result.responseCode === '200') {
            this.mappedArticleId = result.mappedArticleId
            this.mappedReservedOne = result.mappedReservedOne
            this.mappedReservedTwo = result.mappedReservedTwo
            this.mappedReservedThree = result.mappedReservedThree
          }
        })
    }
  },
  mounted () {
    // 상단 공통 팝업 & 자동완성기능 사용유무
    EventBus.$emit('enableSelectedStores', false)

    this.getReserved()
  }
}
</script>
