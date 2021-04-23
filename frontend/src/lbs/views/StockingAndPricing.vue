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
              <div style="position: relative">
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
                  style="position: absolute; top: 50px"
                  max-height="700"
                  max-width="750"
                  src="@/assets/img/map.png"
                ></v-img>
              </div>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="3">
          <v-card class="pa-6" outlined>
            <v-tabs
              v-model="tab"
              background-color="transparent"
              color="basil"
              grow
            >
              <v-tab href="#FirstTab"><b>STOCKING</b></v-tab>
              <v-tab href="#SecondTab"><b>PRICING</b></v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <v-tab-item
                :value="'FirstTab'"
                :transition="false"
                :reverse-transition="false"
              >
                <v-card color="basil" flat>
                  <v-btn class="startBtnAlign" text>{{
                    $t("Start Location Set")
                  }}</v-btn>
                  <div class="labelText"><b>ZONE PRIORITY</b></div>
                  <v-text-field
                    outlined
                    label=""
                    prepend-inner-icon="mdi-yeast"
                    style="margin-top: 5px"
                  ></v-text-field>
                  <v-btn class="btn type-search" text>{{ $t("Search") }}</v-btn>
                  <v-card
                    width="100%"
                    style=" margin-bottom:20px"
                    height="330px"
                  >
                    <v-simple-table height="325px"  dense class="stokesTable">
                      <template v-slot:default>
                        <tbody>
                          <tr v-for="item in tableItem" :key="item.id">
                            <td>{{ item.id }}</td>
                            <div style="width: 100%; height:40px; padding-left: 40px; padding-top:7px; float:left">
                            <td style="">{{ item.name }}</td>
                            </div>
                            <div></div>
                            <td>#</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-card>

                  <v-btn class="btn type-search btnAlign" style="" text>{{
                    $t("Inter Floor Connection")
                  }}</v-btn>
                  <v-btn class="saveAlign" style="" text>{{ $t("save") }}</v-btn>
                </v-card>
              </v-tab-item>
              <v-tab-item
                :value="'SecondTab'"
                :transition="false"
                :reverse-transition="false"
              >
                <p>Empty Components</p>
              </v-tab-item>
            </v-tabs-items>
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
  name: 'StockingAndPricing',
  //   component: {
  //     ExpandLessIcon: ExpandLessIcon
  //   },
  data () {
    return {
      floorItem: [],
      selectedfloor: null,
      items: ['Low Battery', 'Bad Signal', 'Time out'],
      tab: null,
      row: null,
      zoom: 1,
      tableItem: [
        {
          id: 1,
          name: 'Meredith '
        },
        {
          id: 2,
          name: 'Lilly '
        },
        {
          id: 3,
          name: 'Mcclain '
        },
        {
          id: 4,
          name: 'Rosario '
        },
        {
          id: 5,
          name: 'Marilyn '
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
  margin-top: 3%;
  font-size: 15px;
}

.v-sheet {
  height: 100%;
}
.startBtnAlign {
  margin-top: 10px;
  background-color: #e27070 !important ;
  width: 100% !important;
  position: relative;
  top: 5px;
  margin-top: 2px !important;
}
.v-btn__content {
  color: #ffffff;
}
.type-search {
  width: 100% !important;
  position: relative;
  top: -15px;
  margin-top: 0px !important;
}
.saveAlign {
  background-color: #ccd2d7 !important ;
  margin-top: 10px !important;
  width: 100% !important;
  position: relative;
  top: -2px;
  margin-top: 0px !important;
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
.stokesTable td {
  border-bottom: none !important;
}
</style>
