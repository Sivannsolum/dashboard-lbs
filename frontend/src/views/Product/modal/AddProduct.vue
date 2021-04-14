<template>
  <v-dialog
    v-model="addProductVisible"
    @click:outside="cancelAddProduct"
    width="600"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        :disabled="btnDisabledAddProduct"
        class="btn ml-2"
        v-bind="attrs"
        v-on="on"
        text
      >{{ $t('Add') }}</v-btn>
    </template>
    <v-card class="popup">
      <div class="popup-titbox _between">
        <h3 class="page-title-bar"><i class="ico ico-product"></i>{{ $t('ADD Product') }}</h3>
      </div>
      <div class="custom-scrollBox">
        <div class="product_detail">
          <table>
            <colgroup>
              <col style="width:120px">
              <col>
            </colgroup>
            <tr v-for="(articleData, idx) in articleDataList" :key="idx">
              <th>{{ addArticleHeader(articleData.key, idx) }}</th>
              <td>
                <v-text-field
                  v-model="articleData.value"
                  :placeholder="getPlaceholder(articleData.key)"
                  class="form-input rounded-0"
                  outlined dense hide-details solo
                  clearable
                ></v-text-field>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <v-card-actions class="d-flex justify-center">
        <v-btn @click="handleSaveClick" class="btn" text icon>{{ $t('Save') }}</v-btn>
        <v-btn @click="cancelAddProduct" class="btn" text icon>{{ $t('Cancel') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import EventBus from '@/plugins/eventBus.js'
import commons from '@/plugins/commons'
import codes from '@/plugins/codes'

export default {
  name: 'AddProduct',
  props: {
    btnDisabledAddProduct: Boolean,
    user: Object
  },
  data () {
    return {
      productionType: process.env.VUE_APP_PRODUCTION_TYPE,
      addProductVisible: false,
      articleDataList: [],
      articleDataListBackup: [],
      essentialProductData: {
        keys: ['ARTICLE_ID', 'ITEM_NAME', 'NFC_URL'],
        names: ['PRODUCT ID', 'DESCRIPTION', 'NFC URL']
      }
    }
  },
  methods: {
    cancelAddProduct () {
      this.addProductVisible = !this.addProductVisible
      this.articleDataList = commons.copy(this.articleDataListBackup)
    },
    getPlaceholder (key) {
      return `Input the ${key}`
    },
    getArticleDataList: function (articleDataKeyList) {
      const articleDataList = []
      for (const articleDataKey of articleDataKeyList) {
        const articleData = {}
        articleData.key = articleDataKey
        articleData.value = ''
        articleDataList.push(articleData)
      }
      return articleDataList
    },
    handleSaveClick () { this.addArticles() },
    buildProduct (articleDataList) {
      const product = {}
      const data = {}
      product.articleId = articleDataList[0].value
      product.articleName = articleDataList[1].value
      product.nfcUrl = articleDataList[2].value
      for (const articleData of articleDataList) {
        data[articleData.key] = articleData.value || null
      }
      const essProdDataNames = this.essentialProductData.names
      for (const name of essProdDataNames) {
        delete data[name]
      }
      product.data = data
      return product
    },
    addArticles () {
      const productToUpdate = this.buildProduct(this.articleDataList)
      const isValidData = commons.isValidData(
        {
          productId: productToUpdate.articleId,
          description: productToUpdate.articleName
        }
      )
      if (!isValidData.result) {
        EventBus.$emit('messageAlert', this.$t(isValidData.msg))
        return
      }
      const productData = [productToUpdate]
      const params = {
        store: this.$store.state.dataStore.selectedStore.code,
        company: this.user.company
      }
      const config = { params }
      this.$utils
        .callAxiosWithBody(
          codes.requests.addArticles.method,
          codes.requests.addArticles.url,
          productData,
          config
        )
        .then(res => {
          EventBus.$emit('messageAlert', this.$t(res.data.responseMessage))
          this.cancelAddProduct()
          this.$emit('fireResetProduct')
        })
        .catch(error => {
          EventBus.$emit('messageAlert', this.$t(error.response.data.responseMessage))
          console.debug(`Failed to update a product error: ${error}`)
        })
        .finally(() => {
          this.addProductVisible = false
        })
    },
    sortArticleDataKeys (articleDataKeys) {
      const keysToDisplay = this.essentialProductData.names
      articleDataKeys.unshift(...keysToDisplay)
      return articleDataKeys
    },
    addArticleHeader (key, idx) {
      if (idx < 2) return `${key}*`
      return this.$t(key) // 동적 라벨 다국어
    }
  },
  mounted () {
    // Get article data key list.
    const params = {
      store: this.$store.getters['dataStore/GET_SELECTED_STORE'].code
    }
    const config = {
      params: params
    }
    if (this.productionType === 'cloud') {
      params.company = this.$store.state.auth.user.company
    }
    this.$utils
      .callAxios(
        codes.requests.getArticleDataKeyList.method,
        codes.requests.getArticleDataKeyList.url,
        config
      )
      .then((res) => {
        const result = res.data
        const sortedArticleDataKeys = this.sortArticleDataKeys(result.articleDataKeyList)
        this.articleDataList = this.getArticleDataList(sortedArticleDataKeys)
        this.articleDataListBackup = commons.copy(this.articleDataList)
      })
  }
}
</script>

<style>

</style>
