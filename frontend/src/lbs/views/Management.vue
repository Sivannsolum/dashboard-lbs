<template>
  <div>
    <v-container class="grey lighten-5">
      <v-row no-gutters>
        <v-col cols="12" sm="9" style="">
          <v-card class="pa-2" style="border: none !important" outlined tile>
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

            <div id="panzoom-element">
              <div style="position: relative; display: block">
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
              <v-img max-height="600" src="@/assets/img/FloorPlan.png"></v-img>
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
              <v-tab href="#FirstTab"><b>SEARCH</b></v-tab>
              <v-tab href="#SecondTab"><b>ANALYSIS</b></v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <v-tab-item
                :value="'FirstTab'"
                :transition="false"
                :reverse-transition="false"
              >
                <v-card color="basil" flat>
                  <v-radio-group v-model="row" row>
                    <v-radio label="Product" value="radio-1"></v-radio>
                    <v-radio label="Label & GW" value="radio-2"></v-radio>
                    <v-radio label="Shelf" value="radio-2"></v-radio>
                  </v-radio-group>
                  <v-text-field
                    outlined
                    label=""
                    prepend-inner-icon="mdi-yeast"
                  ></v-text-field>
                  <v-btn class="btn type-search" text>{{ $t("Search") }}</v-btn>
                  <div class="labelText"><b>SELECTED SHELF</b></div>
                  <div style="margin-top: 2%"><b>-</b></div>
                  <v-row row>
                    <v-col cols="12" lg="8" class="text-no-wrap">
                      Label List
                    </v-col>
                    <v-col cols="12" lg="4" class="text-no-wrap">
                      Total : -
                    </v-col>
                  </v-row>
                  <v-textarea
                    name="input-7-1"
                    outlined
                    auto-grow
                    value=""
                  ></v-textarea>
                  <v-btn class="btn type-search btnAlign" text>{{
                    $t("Export")
                  }}</v-btn>
                </v-card>
              </v-tab-item>
              <v-tab-item
                :value="'SecondTab'"
                :transition="false"
                :reverse-transition="false"
              >
                <v-card color="basil" flat>
                  <v-radio-group v-model="row" row>
                    <v-radio label="Label" value="radio-1"></v-radio>
                    <v-radio label="Sales" value="radio-2"></v-radio>
                    <v-radio label="Stock" value="radio-2"></v-radio>
                  </v-radio-group>
                  <v-select
                    :items="items"
                    label="Select the index"
                    outlined
                  ></v-select>
                  <v-btn class="btn type-search" text>{{ $t("Scan") }}</v-btn>
                  <div class="labelText"><b>Legend</b></div>
                  <v-row row>
                    <v-col cols="12" md="4">
                      <v-img src="@/assets/img/stable.png"></v-img>
                      <v-row row>
                        <v-col
                          cols="12"
                          lg="12"
                          class="text-center text-no-wrap"
                          >STABLE <br />
                          0~40%</v-col
                        >
                      </v-row>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-img src="@/assets/img/caution.png"></v-img>
                      <v-row row>
                        <v-col
                          style="align: center"
                          cols="12"
                          lg="12"
                          class="text-center text-no-wrap"
                        >
                          CAUTION <br />
                          41~70%</v-col
                        >
                      </v-row>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-img src="@/assets/img/danger.png"></v-img>
                      <v-row row>
                        <v-col
                          cols="12"
                          lg="12"
                          class="text-center text-no-wrap"
                          >DANGER <br />
                          71~100%</v-col
                        >
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card>
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
export default {
  name: 'management',
  data () {
    return {
      floorItem: [],
      selectedfloor: null,
      items: ['Low Battery', 'Bad Signal', 'Time out'],
      tab: null,
      row: null,
      zoom: 1
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
.select_store_box {
  width: 20%;
}
.image {
  margin-top: 4%;
  margin-left: 4%;
}
.labelText {
  margin-top: 10%;
}
.btnAlign {
  margin-top: 28%;
  margin-bottom: 3%;
}
.v-sheet {
  height: 100%;
}
.btn {
  width: 100% !important;
}
.theme--light.v-tabs > .v-tabs-bar .v-tab {
  min-height: 0px !important;
  left: 0px !important;
  min-width: 0px !important;
  border: none !important;
}
</style>
