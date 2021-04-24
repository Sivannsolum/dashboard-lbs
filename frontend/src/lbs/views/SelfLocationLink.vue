<template>
  <div>
    <v-container class="grey lighten-5">
      <v-row no-gutters>
        <v-col cols="12" sm="9" style="">
          <v-card class="pa-2" outlined tile height="700px">
            <div class="select_store_box">
              <h4 ref="company" class="select_article is-complete">
                {{ $t("Floor") }}
              </h4>
              <div class="forms-area">
                <v-select
                  v-model="selectedfloor"
                  :items="floorItem"
                  :label="`${$t('Select the floor')}`"
                  item-text="value"
                  item-value="value"
                  @change="handleCompanyChange()"
                  clearable:false
                  dense
                  flat
                  hide-details
                  solo
                ></v-select>
              </div>
            </div>
            <div id="panzoom-element" class="">
               <div style="position: relative; ">
                <v-img
                  style="
                    width: 80px;
                    height: 80px;
                    position: absolute;
                    left: 90%;
                  "
                  src="@/assets/img/plus.png"
                ></v-img>
              </div>
              <br /><br />
               <div style="position: relative; display: block">
                <v-img
                  style="
                    width: 80px;
                    height: 80px;
                    position: absolute;
                    left: 90%;
                  "
                  src="@/assets/img/minus.png"
                ></v-img>
              </div>
              <div>
                <v-img
                  style="  position:absolute; top: 0px;"
                  max-height="800"
                  src="@/assets/img/FloorPlan.png"
                ></v-img>
              </div>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="3" >
          <v-card
            class="pb-6 pl-6 pr-6"
            outlined
            flat
            style="background-color: #ececec; max-height: 100%; "

          >
            <v-card class="mb-2" flat style="background-color: #ececec; ">
              <div class="labelText">
                <b style="font-weight: 900; font-size: 14px">Map</b>
              </div>
              <v-btn class="btn type-search" text style="margin-bottom: 10px; ">{{
                $t("Remark unlinked Shelf")
              }}</v-btn>
              <v-card color="basil" flat style="background-color: #ececec; height: 800px">
                <div class="labelText">
                  <b style="font-weight: 900; font-size: 14px">
                    Shelf ID List</b
                  >
                </div>
                <v-text-field
                  outlined
                  label=""
                  prepend-inner-icon="mdi-yeast"
                  style="height: 40px"
                  class="txt-field"
                ></v-text-field>
                <v-btn class="btn type-search mb-1" text>{{
                  $t("Search")
                }}</v-btn>
                <v-toolbar grow style="margin-top: 15px; " height="400px">
                  <template v-slot:extension width="100%">
                    <v-tabs v-model="tab" style="padding-bottom: 850px">
                      <v-tab
                        href="#tab-1st"
                        class="primary--text tab-divider"
                        style="border-top-left-radius: 2px; font-size: 10px"
                      >
                        <span>{{ $t("Total") }}</span>
                      </v-tab>
                      <v-tab
                        href="#tab-2nd"
                        class="primary--text tab-divider"
                        style="font-size: 10px"
                      >
                        <span>{{ $t("Linked") }}</span>
                      </v-tab>
                      <v-tab
                        href="#tab-3rd"
                        class="primary--text tab-divider"
                        style="border-top-right-radius: 2px; font-size: 10px"
                      >
                        <span>{{ $t("Unlinked") }}</span>
                      </v-tab>
                    </v-tabs>
                  </template>

                  <v-tabs-items v-model="tab" style="width: 100%">
                    <v-tab-item
                      :value="'tab-1st'"
                      :transition="false"
                      :reverse-transition="false"
                      v-if="tab === 'tab-1st'"
                      style=""
                    >
                      <v-data-table
                        item-key="data"
                        v-model="tab"
                        :headers="tableHeader"
                        show-select
                        :items="table"
                        grow
                        :single-select="true"
                        style="width: 100%"
                        :hide-default-footer="true"
                        :dense="false"
                        class="tbl-type04 tableMenu"
                      >
                        <template slot="no-data">
                          <p>
                            {{ $t("No data available") }}
                          </p>
                        </template>
                      </v-data-table>
                    </v-tab-item>
                    <v-tab-item
                      :value="'tab-2nd'"
                      :transition="false"
                      :reverse-transition="false"
                      v-if="tab === 'tab-2nd'"
                    >
                      <h7></h7>
                    </v-tab-item>
                    <v-tab-item
                      :value="'tab-3rd'"
                      :transition="false"
                      :reverse-transition="false"
                      v-if="tab === 'tab-3rd'"
                    >
                    </v-tab-item>
                  </v-tabs-items>
                </v-toolbar>
                <p
                  style="
                    text-align: right;
                    font-size: 15px;
                    font-weight: bolder;
                    margin-top: 5px;
                  "
                >
                  Total 1473
                </p>
                <div style="height: 100px; margin-top: 10px">
                  <v-btn class="" style="width: 50%; background-color: #e2e2e2"
                    >Link</v-btn
                  >
                  <v-btn class="" style="width: 50%; background-color: #e2e2e2"
                    >Unlink</v-btn
                  >
                  <v-btn
                    class="mt-4"
                    style="width: 100%; background-color: #e2e2e2"
                    >Save</v-btn
                  >
                </div>
              </v-card>
            </v-card>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
// import Panzoom from '@panzoom/panzoom'
// import TableComponent from './Pages/LbsComponent/TableComponent'
export default {
  name: 'shelfLocation',
  // component: {
  //   'table-component': TableComponent
  // },
  data () {
    return {
      floorItem: [],
      selectedfloor: null,
      items: ['Low Battery', 'Bad Signal', 'Time out'],
      tab: null,
      row: null,
      zoom: 1,
      table: [
        {
          data: 'Meredith '
        },
        {
          data: 'Lilly '
        },
        {
          data: 'Mcclain '
        },
        {
          data: 'Rosario '
        },
        {
          data: 'Marilyn '
        }
      ]
    }
  },
  computed: {
    tableHeader () {
      return [
        // {
        //   text: this.$t('#'),
        //   value: '',
        //   sortable: false,
        //   align: 'center',
        //   width: '85px'
        // },
        {
          text: this.$t(''),
          value: 'data',
          sortable: false,
          align: 'center',
          width: '100%'
        },
        {
          text: this.$t(''),
          value: '',
          sortable: false,
          align: 'center',
          width: '100%'
        }
      ]
    }
  },
  mounted () {
    this.getfloordata()
    // this.panzoom = Panzoom(document.getElementById('panzoom-element'), {
    //   maxScale: 5
    // })
  },
  methods: {
    getfloordata () {
      this.selectedfloor = { value: 'B2F' }
      this.floorItem = [
        { value: 'B2F' },
        { value: '2F' },
        { value: '1F' },
        { value: 'B1F' }
      ]
    }
    // zoomIn (level) {
    //   level === -1 ? this.panzoom.zoomOut() : this.panzoom.zoomIn()
    // }
  }
}
</script>
<style scoped>
.txt-field {
  /* border: 1px solid red; */
  height: 20px !important;
  margin-bottom: 30px !important;
}
.tab-divider {
  border-right: 3px solid #ccd2d7;
}
.tab-divider:last-child {
  border-right: 0;
}
.select_store_box {
  width: 20%;
}
.image {
  margin-top: 4%;
  margin-left: 4%;
}
.labelText {
  margin-top: 5%;
}

.v-sheet {
  height: 100%;
}
.btn {
  width: 100% !important;
  position: relative;
  top: 10px;
  margin-top: 5px !important;
}
.theme--light.v-tabs > .v-tabs-bar .v-tab {
  min-height: 0px !important;
  left: 0px !important;
  min-width: 0px !important;
  border: none !important;
}
.v-data-table {
  position: absolute;
  width: 100%;
}
.tableMenu th {
  border-bottom: 1px solid #4d4f5c !important;
  height: 40px !important;
  font-weight: 900 !important;
}
.tableMenu td {
  border-bottom: none !important;
}
.v-item-group {
  flex: 0 1 auto;
  position: relative;
  top: 8px;
  height: 300px;
  width: 190%;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}
.theme--light.v-tabs-items {
    background-color: #ffffff !important;
}
.lighten-5{
  padding: 0!important;
}
.v-application .pa-2 {
    padding: 0px !important;
}
.v-image.v-responsive.theme--light{
  margin-left: -1px;
  margin-top: -1px;
}
</style>
