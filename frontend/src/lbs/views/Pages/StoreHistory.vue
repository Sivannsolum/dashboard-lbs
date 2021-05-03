<template>
  <div>
    <div style="margin-top: -80px">
      <div class="mt-0 header-component">
        <h3 class="pl-4" name="map">Map History List</h3>
      </div>
      <v-data-table
        item-key="version"
        :headers="historyHeaders"
        :items="history"
        :hide-default-footer="true"
        :item-class="rowClass"
        :dense="true"
        class="tbl-type04 mt-2 history"
      >
        <template slot="no-data">
          <p>
            {{ $t("No data available") }}
          </p>
        </template>
      </v-data-table>
    </div>
    <div>
      <div class="mt-5 header-component">
        <h3 class="pl-4" name="product">Product ID Extraction</h3>
      </div>
      <v-container fluid>
        <v-row align="center">
          <v-col class="d-flex" cols="12" sm="3">
            <p>Function On/Off</p>
          </v-col>
          <v-col class="d-flex selected-size mb-10 pr-90" cols="12" sm="2">
            <v-select
              :items="selectedItems"
              class="select_article is-complete"
              outlined
              v-model="defaultSelected"
              dense
              hide-details
              solo
              dark
              background-color="#001e38"
            ></v-select>
          </v-col>
        </v-row>
      </v-container>

      <v-data-table
        item-key="prefix"
        :headers="productsHeaders"
        :items="products"
        :hide-default-footer="true"
        :item-class="rowClass2"
        :dense="true"
        class="tbl-type04 mt-2 products"
      >
        <template v-slot:[`item.checkStatus`]="{ item }">
          <v-icon @click="close(item.prefix)">mdi-close-circle</v-icon>
        </template>
        <template slot="no-data">
          <p>
            {{ $t("No data available") }}
          </p>
        </template>

      </v-data-table>
    </div>
    <v-btn :disabled="false" text class="btn ml-2 mt-4">{{ $t("Add") }}</v-btn>
    <v-btn :disabled="false" text class="btn ml-2 mt-4">{{ $t("Save") }}</v-btn>
  </div>
</template>
<script>
export default {
  name: 'StoreHistory',
  data () {
    return {
      defaultSelected: 'On',
      items: ['STORE HISTORY', 'COMPONENT', 'APP SET', 'DEFAULT SET'],
      selectedItems: ['On', 'Off'],
      text: 'this is search tab bar',
      products: [
        {
          validDigits: '8 ',
          prefix: 'XX',
          paddingValue: '-',
          totalDigit: '10 '
        },
        {
          validDigits: '7 ',
          prefix: 'YY',
          paddingValue: '- ',
          totalDigit: '12 '
        },
        {
          validDigits: '8 ',
          prefix: 'ZZ',
          paddingValue: '- ',
          totalDigit: '13 '
        }
      ],
      history: [
        {
          date: 'Meredith ',
          version: 39,
          status: 'Virgie ',
          floor: 'Hurley ',
          exArea: 'Frank ',
          area: 'Robbins ',
          salesArea: 'Macias '
        },
        {
          date: 'Lilly ',
          version: 38,
          status: 'Mandy ',
          floor: 'Julie ',
          exArea: 'Danielle ',
          area: 'Lucy ',
          salesArea: 'Rae '
        },
        {
          date: 'Mcclain ',
          version: 24,
          status: 'Gertrude ',
          floor: 'Delacruz ',
          exArea: 'Whitfield ',
          area: 'Margarita ',
          salesArea: 'Rhoda '
        },
        {
          date: 'Rosario ',
          version: 23,
          status: 'Gross ',
          floor: 'Daugherty ',
          exArea: 'Odom ',
          area: 'Jacklyn ',
          salesArea: 'Navarro '
        },
        {
          date: 'Marilyn ',
          version: 10,
          status: 'Bradford ',
          floor: 'Latonya ',
          exArea: 'Esperanza ',
          area: 'Browning ',
          salesArea: 'Ashlee '
        }
      ]
    }
  },
  computed: {
    historyHeaders () {
      return [
        {
          text: this.$t('VERSION'),
          value: 'version',
          sortable: false
        },
        { text: this.$t('DATE'), value: 'date', sortable: false },
        { text: this.$t('STATUS'), value: 'status', sortable: false },
        {
          text: this.$t('DRAWIING/FLOOR'),
          value: 'floor',
          sortable: false
        },
        { text: this.$t('AREA'), value: 'area', sortable: false },
        {
          text: this.$t('EXCEPTION AREA'),
          value: 'exArea',
          sortable: false
        },
        {
          text: this.$t('SALES AREA'),
          value: 'salesArea',
          sortable: false
        }
      ]
    },
    productsHeaders () {
      return [
        { text: this.$t('PREFIX'), value: 'prefix', sortable: false },
        {
          text: this.$t('VALID DIGITS'),
          value: 'validDigits',
          sortable: false
        },
        {
          text: this.$t('PADDING VALUE'),
          value: 'paddingValue',
          sortable: false
        },
        { text: this.$t('TOTAL DIGITS'), value: 'totalDigit', sortable: false },
        { text: this.$t(''), value: 'checkStatus', sortable: false }
      ]
    },
    activeStyle () {
      return {
        'background-color': `${this.color}`
      }
    }
  },
  methods: {
    rowClass (item) {
      const rowClass = 'myrowClass'
      return rowClass
    },
    rowClass2 (item) {
      const rowClass = 'myrowClass2'
      return rowClass
    },
    close (id) {
      console.log(id)
    }
  }
}
</script>
<style scoped >
.history {
  border-top: 1px solid#4D4F5C;
  border-collapse: collapse;
  border-radius: 1px;
}
.products {
  border-top: 1px solid#4D4F5C;
  border-radius: 1%;
  border-collapse: collapse;
  background-color:#ffffff;
}
.myrowClass {
  opacity: 1;
  border: none;
  border-bottom: none;
}
.myrowClass2 {
  opacity: 1;
  border: none;
  border-bottom: none;
}
.headers {
  color: red;
}

.products th {
  border-bottom: 1px solid #4d4f5c !important;
  height: 40px !important;
  font-weight: 900 !important;
}
.products td {
  border-bottom: none !important;
}
.header-component {
  color: "black";
  font-weight: 700;
  padding-top: 2px !important;
  text-align: left;
}
.header-component {
  height: 40px;
  background-color: #ececec;
  line-height:2.0;
}
.selected-size {
  height: 15px;
}
.v-text-field.v-text-field--solo:not(.v-text-field--solo-flat) > .v-input__control > .v-input__slot {
  background-color:#09263f;
}
.theme--light.v-select .v-select__selection--comma {
  color:#09263f;
   /* background-color: red; */
}.theme--light.v-select{
  color:red !important;
}
.mdi:before,
.mdi-set {
  color: #ffffff;
}
.v-list-item--link::before {
  background-color: #a4afb7;
}
.row{
    margin-left:-13px;
    margin-right:190px;
}
.theme--light.v-sheet {
    font-size: large;
}
.mdi[data-v-735daf6c]:before{
  color:red !important
}
.header-component h3{
  font-size: small;
  font-weight: normal;
}
</style>
<style>
.v-data-table-header th.text-start span{
  color: black;
}
</style>
