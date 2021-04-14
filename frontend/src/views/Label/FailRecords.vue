<template>
  <div>
    <h2 class="page-title-bar"><i class="ico ico-label"></i>{{$t('Fail Records')}}</h2>

    <!-- 검색 -->
    <div class="searchArea">
      <v-text-field outlined dense hide-details
        label="Update ID"
        placeholder="Input the update ID"
        class="form-input"
        @keyup.enter="searchLabelList()"
        clearable
      ></v-text-field>

      <v-text-field outlined dense hide-details
        label="Label ID"
        placeholder="Input the label ID"
        class="form-input ml-3"
        @keyup.enter="searchLabelList()"
        clearable
      ></v-text-field>

      <!-- 09.24 추가 -->
      <v-select
        outlined dense hide-details
        label="Fail reason"
        placeholder="Choose fail reason"
        :items="['Template Error', 'Outbound Error']"
        class="form-select ml-3"
        clearable
      ></v-select>
      <!-- //09.24 추가 -->

      <v-btn text class="btn type-search ml-3" @click="searchLabelList()">{{$t('Search')}}</v-btn>
    </div>

    <!-- data table -->
    <v-data-table
      v-model="selected"
      :headers="labelHeaders"
      :items="labelItems"
      :page.sync="page"
      :hide-default-footer="true"
      item-key="id"
      class="tbl-type01 mt-10"
      @page-count="pageCount = $event"
    >
    </v-data-table>

    <!-- 하단 옵션 -->
    <div class="table-options">
      <!-- button group -->
      <div>
        <v-btn text class="btn">{{$t('Export')}}</v-btn>
      </div>

      <!-- paging -->
      <div>
        <div class="pageInfo">1 to 7, 7 in total</div>
        <v-pagination v-model="page" :length="pageCount" color="#2f3b4c" class="paging"></v-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      labelHeaders: [
        { text: '#', sortable: false, align: 'center', value: 'no' },
        { text: 'UPDATE ID', value: 'update' },
        { text: 'LABEL ID', value: 'label' },
        { text: 'PRODUCT ID', value: 'product' },
        { text: 'FAIL REASON', value: 'fail' }
      ],
      labelItems: [
        {
          no: 1,
          update: '000-0000',
          label: '1002200444',
          product: '880292828',
          fail: 'template Error'
        }
      ]
    }
  }
}
</script>
