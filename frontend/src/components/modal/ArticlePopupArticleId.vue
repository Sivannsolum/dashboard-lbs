<template>
            <v-dialog
              v-model="Dialog_ArticleId"
              persistent
              :retain-focus="false"
              width="890"
            >
              <v-card class="popup add_store_popup">
                <div class="page-title-bar">
                  <h2 class="page-title"><img src="@/assets/img/ico-doc.png" alt=""> <strong>ARTICLE</strong> DETAIL</h2>
                  <p class="update-info">Last Update order: <span>04/24/20 AM 07:08</span></p>
                  <v-btn text icon class="btn-refresh"><img src="@/assets/img/ico_refresh.png" alt="새로고침"></v-btn>
                </div>

                <div class="d-flex justify-space-between mt-9">
                  <div class="articleHistory">
                    <p class="form-title">ARTICLE HISTORY</p>
                    <!-- data table -->
                    <v-data-table
                      v-model="selected"
                      :headers="articlePopHeaders"
                      :items="articlePopItems"
                      show-select
                      single-select
                      item-key="no"
                      :page.sync="page"
                      :hide-default-footer="true"
                      class="tbl-type02"
                    >
                      <template v-slot:[`item.data-table-select`]="{ isSelected, select }">
                        <v-simple-checkbox :ripple="false" :value="isSelected" @input="select($event)" on-icon="$radioOn" off-icon="$radioOff"></v-simple-checkbox >
                      </template>
                    </v-data-table>
                    <div class="text-center pt-8">
                      <v-pagination v-model="page" :length="pageCount" color="#2f3b4c"></v-pagination>
                    </div>
                  </div>
                  <div class="articleViewer">
                    <v-tabs height="20" class="tab-popup">
                      <v-tab>VIEWER</v-tab>
                      <v-tab>HTML</v-tab>
                      <!-- viewer -->
                      <v-tab-item>
                        <div class="column02 popup-form-list mt-4">
                          <div class="d-flex align-start">
                            <span class="line-title">PRODUCT ID</span>
                            <div class="fields">
                              <v-text-field
                                value="8 8045364518"
                                hide-details="false" single-line loading="false" text height="25"
                                class="form-input"
                                clearable
                              ></v-text-field>
                            </div>
                          </div>
                          <div class="d-flex align-start mt-3">
                            <span class="line-title">PRODUCT NAME</span>
                            <div class="fields">
                              <v-text-field
                                value="Slid Milk Chocolate 200g"
                                hide-details="false" single-line loading="false" text height="25"
                                class="form-input"
                                clearable
                              ></v-text-field>
                            </div>
                          </div>
                          <div class="d-flex align-start mt-3">
                            <span class="line-title">TEMPLATE ID</span>
                            <div class="fields">
                              <v-text-field
                                value="S0005"
                                hide-details="false" single-line loading="false" text height="25"
                                class="form-input"
                                clearable
                              ></v-text-field>
                            </div>
                          </div>
                          <div class="d-flex align-start mt-3">
                            <span class="line-title">RETAIL PRICE</span>
                            <div class="fields d-flex">
                              <v-text-field
                                value="5.50"
                                hide-details="false" single-line loading="false" text height="25"
                                class="form-input"
                                clearable
                              ></v-text-field>
                              <v-text-field
                                value="$1.75 per 100g"
                                hide-details="false" single-line loading="false" text height="25"
                                class="form-input ml-2"
                                clearable
                              ></v-text-field>
                            </div>
                          </div>
                          <div class="d-flex align-start mt-3">
                            <span class="line-title">PROMO PRICE</span>
                            <div class="fields d-flex">
                              <v-text-field
                                value="3.35"
                                hide-details="false" single-line loading="false" text height="25"
                                class="form-input"
                                clearable
                              ></v-text-field>
                              <v-text-field
                                value="$1.68 per 100g"
                                hide-details="false" single-line loading="false" text height="25"
                                class="form-input ml-2"
                                clearable
                              ></v-text-field>
                            </div>
                          </div>
                          <div class="d-flex align-start mt-3">
                            <span class="line-title">OFFER PRICE</span>
                            <div class="fields d-flex">
                              <v-text-field
                                value="9.49"
                                hide-details="false" single-line loading="false" text height="25"
                                class="form-input"
                                clearable
                              ></v-text-field>
                              <v-text-field
                                value="$1.62 per 100g"
                                hide-details="false" single-line loading="false" text height="25"
                                class="form-input ml-2"
                                clearable
                              ></v-text-field>
                            </div>
                          </div>
                          <div class="d-flex align-start mt-3">
                            <span class="line-title">SHELF DETAIL</span>
                            <div class="fields">
                              <v-text-field
                                value="Buy 2 Wow Milk"
                                hide-details="false" single-line loading="false" text height="25"
                                class="form-input"
                                clearable
                              ></v-text-field>
                              <v-text-field
                                value="Chocolate for $6.49"
                                hide-details="false" single-line loading="false" text height="25"
                                class="form-input mt-3"
                                clearable
                              ></v-text-field>
                            </div>
                          </div>
                          <div class="d-flex align-start mt-3">
                            <span class="line-title">BARCODE</span>
                            <div class="fields">
                              <v-text-field
                                value="9600000696371408"
                                hide-details="false" single-line loading="false" text height="25"
                                class="form-input"
                                clearable
                              ></v-text-field>
                            </div>
                          </div>
                          <div class="d-flex align-start mt-3">
                            <span class="line-title">PROMO ID</span>
                            <div class="fields">
                              <v-text-field
                                value="696371002"
                                hide-details="false" single-line loading="false" text height="25"
                                class="form-input"
                                clearable
                              ></v-text-field>
                            </div>
                          </div>
                          <div class="d-flex align-start mt-3">
                            <span class="line-title">PROMO DATE</span>
                            <div class="fields d-flex">
                              <v-text-field
                                value="14/05/2020"
                                hide-details="false" single-line loading="false" text height="25"
                                class="form-input"
                                clearable
                              ></v-text-field>
                              <div class="dash">~</div>
                              <v-text-field
                                value="30/05/2020"
                                hide-details="false" single-line loading="false" text height="25"
                                class="form-input"
                                clearable
                              ></v-text-field>
                            </div>
                          </div>
                          <div class="d-flex align-start mt-3">
                            <span class="line-title">RESSONCODE</span>
                            <div class="fields">
                              <v-text-field
                                value="38350"
                                hide-details="false" single-line loading="false" text height="25"
                                class="form-input"
                                clearable
                              ></v-text-field>
                            </div>
                          </div>
                          <div class="d-flex align-start mt-3">
                            <span class="line-title">UPDATE ID</span>
                            <div class="fields">
                              <v-text-field
                                value="0000153180 (Updated)"
                                hide-details="false" single-line loading="false" text height="25"
                                class="form-input"
                                clearable
                              ></v-text-field>
                            </div>
                          </div>
                        </div>
                        <div class="d-flex justify-end mt-5">
                          <v-btn text class="btn-search-small" height="25">Article Update</v-btn>
                        </div>
                      </v-tab-item>

                      <!-- html -->
                      <v-tab-item>
                        <div class="mt-4">
                          <pre class="codeBox">
"DetailRecord": [
{
  "ESLUpdate": {
    "ItemNumber": "01234",
    "TemplateID": "C170",
    "ProductInformation": {
        "Description": "Woolworths Slid Mlk Chocolate Eggs 200g",
        "UnitOfMeasure": "ea"
    },
    "PriceInformation": {
        "RetailPrice": "5.50",
        "CUPRetail": "$1.75 per 100g",
        "PromoSellPrice": "3.35",
        "CUPPromo": "$1.68 per 100g",
        "SavePrice": "0.15",
        "OfferPrice": "9.49",
        "Threshold": "Any 2 for",
        "OfferSaving": "0.51",
        "MultibuyCUPValue": "$1.62 per 100g"
    }
  }
}
]
                          </pre>
                        </div>
                        <div class="d-flex justify-end mt-5">
                          <v-btn text class="btn-search-small" height="25">Article Update</v-btn>
                        </div>
                      </v-tab-item>
                    </v-tabs>
                  </div>
                </div>

                <v-card-actions class="d-flex justify-center">
                  <v-btn text icon @click="closeModal()"><img src="@/assets/img/btn-popup-close.png" alt="close"></v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
</template>
<script>
export default {
  props: { Dialog_ArticleId: Boolean },
  methods: {
    getArticleDetailList () {
      this.$axios.get('/api/common/articles/history', {
        params: {
          company: this.company,
          store: this.keyword,
          articleId: 'sort'
        }
      }).then((response) => {
        this.articlePopItems = response.data.articleList
      }).catch((ex) => {
        console.log('ERROR!! ', ex)
      })
    },
    closeModal () {
      this.$emit('closeArticleModal', false)
    }
  },
  mounted () { // init
    this.getArticleDetailList()
  },
  data () {
    return {
      selected: [],
      page: 1,
      pageCount: 0,
      articlePopHeaders: [
        { text: '#', align: 'center', sortable: false, value: 'no' },
        { text: 'UPLOAD DATE', align: 'center', sortable: false, value: 'update' }
      ],
      articlePopItems: [
        {
          no: 1,
          update: '2020-07-13 01:05:22'
        },
        {
          no: 2,
          update: '2020-07-13 01:05:22'
        }
      ]
    }
  }

}
</script>
