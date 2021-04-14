<template>
    <div>
        <div class="mapping-search d-flex justify-end">
            <div class="innerBox d-flex align-center">
                <p>DEFAULT TEMPLATE GROUP</p>
                <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Normal"
                hide-details="false" v-bind:single-line="true" loading="false" height="30"
                class="form-search ml-5"
                clearable
                ></v-text-field>
        </div>
        </div>
            <v-data-table
            v-model="selected"
            :headers="mappingHeaders"
            :items="mappingItems"
            :hide-default-footer="true"
            show-select
            :search="search"
            class="tbl-type01"
            >
            </v-data-table>
            <!-- 하단 옵션 -->
            <div class="table-options">
            <div>
                <v-btn text><img src="@/assets/img/ico-add.png" alt=""> <i class="txt"></i>{{$t('NEW MAPPING')}}</v-btn>
                <v-btn text class="ml-5"><img src="@/assets/img/ico-edit.png" alt=""> <i class="txt">{{$t('EDIT')}}</i></v-btn>
                <v-btn text class="ml-5"><img src="@/assets/img/ico-delete.png" alt=""> <i class="txt">{{$t('DELETE')}}</i></v-btn>
            </div>
            <div>
                <v-btn text><i class="txt">APPLY</i></v-btn>
                <v-btn text icon class="ml-5"><img src="@/assets/img/ico-up.png" alt="up"></v-btn>
                <v-btn text icon><img src="@/assets/img/ico-down.png" alt="down"></v-btn>
                <v-btn text icon class="ml-5"><img src="@/assets/img/ico-top.png" alt="top"></v-btn>
                <v-btn text icon><img src="@/assets/img/ico-bottom.png" alt="bottom"></v-btn>
            </div>
            </div>
    </div>
</template>
<script>
export default {
  props: {
  },
  methods: {
    closeModal () {
      this.$emit('closeMainStoreModal', false)
    },
    saveMainStoreModal () {
      this.closeModal()
    }
  },
  mounted () { // init
  },
  data () {
    return {
      selected: [],
      search: '',
      page: 1,
      pageCount: 0,
      mappingHeaders: [
        {
          text: this.$t('PRIORITY'),
          align: 'center',
          sortable: false,
          value: 'priority'
        },
        { text: this.$t('GROUP NAME'), align: 'center', sortable: false, value: 'name' },
        { text: this.$t('TARGET FIELD'), align: 'center', sortable: false, value: 'field' },
        { text: this.$t('EXPECTED VALUE'), align: 'center', sortable: false, value: 'value' },
        { text: this.$t('LINKED TEMPLATE GROUP'), align: 'center', sortable: false, value: 'group' }
      ],
      mappingItems: []
    }
  }
}
</script>
<style scoped>
  .groupList{width:53%;}
  .selectedGroup{width:43.07%;}
  .borderBox{padding:20px; border:1px solid #ececec;}
  .pageTab{border-top-left-radius:5px; border-top-right-radius:5px; color:#fff; background:#2f3b4c; font-size:var(--font15); font-weight:700; text-align:center;}
  .mapping-search{padding:8px; background:#2f3b4c;}
  .mapping-search .innerBox{width:400px;}
  .mapping-search p{font-size:var(--font13); color:#fff; font-weight:700; letter-spacing: 0,05em;}
</style>
