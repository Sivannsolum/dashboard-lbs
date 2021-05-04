<template>
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
            dense
            flat
            hide-details
            solo
            ></v-select>
      </div>
   </div>
</template>
<script>
export default {
  data () {
    return {
      floorItem: [],
      selectedfloor: null
    }
  },
  computed: {
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
    },
    handleCompanyChange () {

    }
  },
  mounted () {
    this.getfloordata()
  }
}
</script>
<style scoped>
.select_store_box {
    width: 20%;
    margin: auto;
    position: absolute;
    z-index: 10;
}
</style>
