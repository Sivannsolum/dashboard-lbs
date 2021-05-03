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
                <v-card class="sideTab">
                  <v-tabs
                    v-model="tab"
                    hide-slider
                    active-class="activeTab"
                  >
                    <v-tab
                      v-for="item in items"
                      :key="item.tab"
                    >
                      {{ item.tab }}
                    </v-tab>
                  </v-tabs>

                  <v-tabs-items v-model="tab">
                    <v-tab-item
                      v-for="item in items"
                      :key="item.tab"
                    >
                      <v-card flat class="tabContent">
                        <v-card-text><component v-bind:is="item.content"></component></v-card-text>
                      </v-card>
                    </v-tab-item>
                  </v-tabs-items>
                </v-card>
                <p
                  style="
                    text-align: right;
                    font-size: 15px;
                    font-weight: bolder;
                    margin-top: 175px;
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
import Total from '@/lbs/components/Tabs/Total.vue'
import Linked from '@/lbs/components/Tabs/Linked.vue'
import Unlinked from '@/lbs/components/Tabs/Unlinked.vue'
export default {
  components: {
    Total,
    Linked,
    Unlinked
  },
  data () {
    return {
      tab: null,
      floorItem: [],
      selectedfloor: null,
      row: null,
      zoom: 1,
      items: [
        { tab: 'Total', content: Total },
        { tab: 'Linked', content: Linked },
        { tab: 'Unlinked', content: Unlinked }
      ]
    }
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
  margin: 10px;
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
.v-card.v-card--flat.v-sheet.theme--light{
  overflow-x: hidden;
    overflow-y: auto;
    height: auto!important;
    min-height: 450px;
}
table.v-table tbody td, table.v-table tbody th {
    height: 10px;
}
.v-data-table.theme--light {
    margin-left: -15px;
}
.theme--light.v-tabs > .v-tabs-bar .v-tab:not(.v-tab--active) {
  background: #e2e2e2 !important;
  font-weight: 900;
  border: 1px solid #b9adad!important;
  border-radius: 0px 10px 0px 0px;
}
.theme--light.v-tabs > .v-tabs-bar .v-tab--active {
  border-right: 3px solid #d41515;
  background-color: #ffffff;
  font-weight: 900;
  border: 1px solid #b9adad!important;
  border-radius: 5px 5px 0px 0px;
  border-bottom: 0px!important;
}

.v-tab{
  font-size: 10px;
}
.tabContent{
    border: 1px solid #b9adad!important;
    border-top: 0px!important;
    border-radius: 0px 0px 5px 5px;
    margin-top: -8px;
}
.sideTab{
  margin: 20px 0;
}
html {
    overflow: scroll;
    overflow-x: hidden;
}
::-webkit-scrollbar {
    width: 0;  /* Remove scrollbar space */
    background: transparent;  /* Optional: just make scrollbar invisible */
}
/* Optional: show position indicator in red */
::-webkit-scrollbar-thumb {
    background: #FF0000;
}
</style>
