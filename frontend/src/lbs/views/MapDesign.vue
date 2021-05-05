<template>
<div>
    <v-container class="grey lighten-5">
    <v-row no-gutters>
      <v-col cols="12" sm="9">
        <v-card class="pa-2" style="border:none !important" outlined tile>
           <!-- <div class="select_store_box">
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
        </div> -->
                  <SelectFloor />
<div id="panzoom-element" class="">
   <div style="position: relative;display:block" >
    <v-img  style="width:80px;height:80px;position:absolute;left:90%;" src="@/assets/img/plus.png"></v-img>
  </div><br><br>
  <div style="position: relative;display:block">
    <v-img style="width:80px;height:80px;position:absolute;left:90%;" src="@/assets/img/minus.png"></v-img>
  </div>

  <div >
   <v-img  max-height="800" class="floorPlan"  src="@/assets/img/FloorPlan.png"></v-img>

</div>
</div>

</v-card>
</v-col>
<v-col cols="12" sm="3">
 <v-card class="pa-6" outlined >
  <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
    <v-tab class="vtab" href="#tab-1st"><b>COMPONENT</b></v-tab>
    <v-tab class="vtab" href="#tab-2nd"><b>ZONE</b></v-tab>
  </v-tabs>
  <v-tabs-items v-model="tab">
    <v-tab-item :value="'tab-1st'" :transition="false" :reverse-transition="false">
     <v-card color="basil" flat>
      <v-select :items="items" outlined style="margin-top:4%" v-model='selectedItems'></v-select>
        <v-select :items="items1" outlined v-model ='selectedItems1'></v-select>
    <v-card>
      <v-card-text style="padding:0px !important">

        <v-btn block   x-large v-for="items in FloorSize" :key='items.value'>
<v-row row>
              <v-col cols="12" sm='3'>
          <v-icon   large>mdi-checkbox-blank-outline</v-icon>
          </v-col>
          <v-col style="line-height: 2.8 !important" cols="12" sm='6'>
              {{items.value}}
              </v-col>
        </v-row>

        </v-btn>

      </v-card-text>
    </v-card>
  <v-btn class="btn type-search btnAlignment" text>{{ $t('Import CAD Data') }}</v-btn>
  <v-btn class="btn type-search btnAlignment" text>{{ $t('Save') }}</v-btn>
 </v-card>
 </v-tab-item>
<v-tab-item :value="'tab-2nd'" :transition="false" :reverse-transition="false">
    <v-card color="basil" flat>
        <addzone></addzone>
    <!-- <v-btn class="btn type-search btnAlignment" text>{{ $t('Add Zone') }}</v-btn> -->
    <v-row row>
     <v-col cols="12" sm="6">
        <v-btn class="btn type-search" text>{{ $t('Edit Zone') }}</v-btn>
     </v-col>
     <v-col cols="12" sm="6">
        <v-btn class="btn type-search" text>{{ $t('Delete') }}</v-btn>
     </v-col>
    </v-row>
<v-card outlined>
   <!-- <v-card-text  class="cardText">
      <v-text-field style="margin-top:3%" v-for="item in FloorDetails" :key='item.value' :readonly="readonly" v-model="item.value" single-line>
      </v-text-field>
   </v-card-text> -->
   <v-card-text style="padding:0px !important">
        <v-btn style="justify-content:left !important;border-bottom:1px solid gray !important"  block  x-large v-for="items in FloorDetails" :key='items.value'>
          {{items.value}}
        </v-btn>
      </v-card-text>
</v-card>
<v-btn class="btn type-search btnAlignment" text>{{ $t('Import CAD Data') }}</v-btn>
<v-btn class="btn type-search  btnAlignment" text>{{ $t('Save') }}</v-btn>
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
import addzone from './modal/Addzone'
import SelectFloor from '@/lbs/components/SelectFloor.vue'
export default {
  name: 'management',
  components: { addzone, SelectFloor },
  data () {
    return {
      floorItem: [],
      selectedfloor: null,
      items: ['Shelf'],
      items1: ['Group1'],
      FloorDetails: [{ value: 'Toy & Doll' }, { value: 'Deli' }, { value: 'Fresh Fish' }, { value: 'Office' }, { value: 'Living_1' }, { value: 'Living_2' }, { value: 'Cosmetic' }, { value: 'Snack & Sweet' }, { value: 'Food_1' }, { value: 'Food_2' }, { value: 'Food_3' }, { value: 'Food_4' }],
      FloorSize: [{ value: '600*450*1800' }, { value: '600*450*1200' }, { value: '600*450*1500' }, { value: '600*450*1600' }, { value: '600*450*1000' }, { value: '600*450*1300' }, { value: '600*450*1400' }],
      selectedItems: null,
      selectedItems1: null,
      tab: null,
      row: null,
      readonly: true
    }
  },
  mounted () {
    this.getfloordata()
  },
  methods: {
    getfloordata () {
      this.selectedfloor = { value: 'B2F' }
      this.selectedItems = this.items[0]
      this.selectedItems1 = this.items1[0]
      this.floorItem = [
        { value: 'B2F' },
        { value: '2F' },
        { value: '1F' },
        { value: 'B1F' }
      ]
    }
  }
}
</script>
<style scoped>
.select_store_box {
width: 20% ;
}
.image{
    margin-top: 4%;
    margin-left:4%
}
.labelText{
    margin-top: 10%;
}
.btnAlignment{
    margin-top: 3%;
}
.v-sheet{
    height: 100%;
}
.iconStyle{
margin-left: -30px ! important;
    margin-right: 30px !important;
}
.sidePanel{
    max-width: 9% !important;
    margin-left: -1px;
  box-shadow: 5px 10px 8px #888888 !important;
}
.sidePanelrow{
     margin-left:  0px !important;
    /* margin:5px !important; */
}
.imageCol{
    padding:0px !important
}
.cardText{
  padding:0px !important
}
</style>
<style  scoped>
.theme--light.v-tabs > .v-tabs-bar .v-tab{
    min-height: 0px !important;
    left: 0px !important;
    min-width: 0px !important;
    border: none !important;
    background-color: #FFFFFF !important;
}
.btn{
width:100% ! important;
}
.v-image.v-responsive.floorPlan.theme--light {
    margin-top: -68px;
    margin-left: -20px;
}
</style>
