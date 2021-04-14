<template>
      <!-- update 팝업 -->
              <v-dialog
                v-model="Dialog_ArticleUpdate"
                persistent
                width="890"
              >
                <!--
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" class="btn-primary mt-15" text width="100%" height="80">ARTICLE<br> UPDATE</v-btn>
                </template>
                -->
                <v-card class="popup add_store_popup">
                  <div class="page-title-bar">
                    <h2 class="page-title"><img src="@/assets/img/ico-doc.png" alt=""> <strong>UPDATE</strong> DETAIL</h2>
                  </div>

                  <!-- 테이블 데이터 검색 -->
                  <div class="searchTable-singleline">
                    <div class="formArea single-searchBar">
                        <v-select
                        clearable
                        :items="['Article ID', 'Label code','Result', 'Error code']"
                        hide-details="false" single-line loading="false" height="15" label="SELECT SORT"
                        class="form-select-type2"
                        ></v-select>
                        <v-text-field
                          hide-details="false" single-line loading="false" text height="30"
                          class="form-input ml-2"
                          clearable
                        ></v-text-field>
                    </div>
                    <v-btn class="btn-search ml-10" width="200px" height="30" text>SEARCH</v-btn>
                  </div>

                  <!-- data table -->
                  <v-data-table
                    v-model="selected"
                    :headers="updatePopHeaders"
                    :items="updatePopItems"
                    :hide-default-footer="true"
                    :page.sync="page"
                    class="tbl-type02 mt-10"
                    @page-count="pageCount = $event"
                  >
                  </v-data-table>

                  <!-- 하단 옵션 -->
                  <div class="table-options justify-end">
                    <div>
                      <v-btn text icon><img src="@/assets/img/ico-download.png" alt="download"></v-btn>
                      <v-btn text icon class="ml-5"><img src="@/assets/img/ico-share.png" alt="share"></v-btn>
                      <v-btn text icon class="ml-5"><img src="@/assets/img/ico-print.png" alt="print"></v-btn>
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
  props: { Dialog_ArticleUpdate: Boolean },
  methods: {
    closeModal () {
      this.$emit('closeUpdateModal', false)
    }
  },
  data () {
    return {
      selected: [],
      page: 1,
      pageCount: 0,
      updatePopHeaders: [
        {
          text: '#',
          align: 'center',
          sortable: false,
          value: 'no'
        },
        { text: 'ARTICLE ID', align: 'center', sortable: false, value: 'article' },
        { text: 'LABEL ID', align: 'center', sortable: false, value: 'label' },
        { text: 'RESULT', align: 'center', sortable: false, value: 'result' },
        { text: 'ERROR CODE', align: 'center', sortable: false, value: 'error' },
        { text: 'UPDATED TIME', align: 'center', sortable: false, value: 'update' }
      ],
      updatePopItems: [
        {
          no: '1111',
          article: '98766',
          label: '0388E190B295',
          result: 'SUCCESS',
          error: '-',
          update: '2020-07-13 01:05:22'
        },
        {
          no: '1112',
          article: '98766',
          label: '0388E190B295',
          result: 'TIMEOUT',
          error: '05',
          update: '2020-07-13 01:05:22'
        }
      ]
    }
  }
}
</script>
