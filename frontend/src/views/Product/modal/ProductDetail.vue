<template>
  <v-dialog
    :key="productDetailVisible"
    v-model="productDetailVisible"
    @click:outside="closeProductDetail"
    width="700"
  >
    <v-card class="popup">
      <div class="popup-titbox _between">
        <h3 class="page-title-bar">
          <i class="ico ico-product"></i>{{ $t("Product Detail") }}
        </h3>
      </div>
      <div class="custom-scrollBox">
        <div class="productInfo d-flex">
          <div class="list">
            <v-data-table
              :headers="pdHeaders"
              :items="pdItems"
              :page.sync="page"
              :hide-default-footer="true"
              item-key="no"
              class="tbl-type01"
            >
            </v-data-table>
          </div>
          <div class="product_detail">
            <table>
              <colgroup>
                <col style="width: 100px" />
                <col />
              </colgroup>
              <tr v-for="(articleData, idx) in articleDataList" :key="idx">
                <th :disabled="idx < 1">
                  {{ editArticleHeader(articleData.key, idx) }}
                </th>
                <td>
                  <v-text-field
                    v-model="articleData.value"
                    :placeholder="getPlaceholder(articleData.key)"
                    :disabled="idx < 1"
                    class="form-input flat rounded-0"
                    outlined
                    dense
                    hide-details
                    solo
                    clearable
                  ></v-text-field>
                </td>
              </tr>
              <tr>
                <th>Assigned Label</th>
                <td>
                  <div class="label-list">
                    <div
                      v-for="assignedLabel in assignedLabels"
                      :key="assignedLabel"
                      class="d-flex align-baseline"
                    >
                      <v-text-field
                        :value="assignedLabel"
                        :placeholder="$t('Input the label ID')"
                        class="form-input flat rounded-0"
                        clearable
                        dense
                        hide-details
                        solo
                      ></v-text-field>
                      <v-btn
                        :disabled="productAssignDisabled"
                        @click="unassignArticle(assignedLabel)"
                        class="btn flat ml-2"
                        text
                        width="80"
                        >{{ $t("Unassign") }}
                      </v-btn>
                    </div>
                    <div
                      v-for="(labelToAssign, idx) in labelsToAssign"
                      :key="idx"
                      class="d-flex align-baseline"
                    >
                      <v-text-field
                        :value="labelsToAssign[idx]"
                        @keyup.prevent="handleLabelIdKeyUp(idx, $event)"
                        :placeholder="$t('Input the label ID')"
                        class="form-input flat rounded-0"
                        dense
                        hide-details
                        solo
                        clearable
                      ></v-text-field>
                      <v-btn
                        :disabled="productAssignDisabled"
                        @click="assignArticle(labelsToAssign[idx])"
                        class="btn basic flat ml-2"
                        width="80"
                        text
                        >{{ $t("Assign") }}</v-btn
                      >
                    </div>
                    <div class="d-flex justify-center">
                      <v-btn text icon @click="addNewLabelInput()"
                        ><img src="@/assets/img/ico-add.jpg" alt=""
                      /></v-btn>
                    </div>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <v-card-actions class="d-flex justify-center">
        <v-btn
          :disabled="productDetailUpdateDisabled"
          @click="updateArticle"
          class="btn"
          text
          icon
        >
        {{$t("Update")}}
        </v-btn>
        <v-btn
          @click="closeProductDetail"
          class="btn"
          text
          icon
        >
        {{ $t("Cancel")}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import EventBus from '@/plugins/eventBus'
import commons from '@/plugins/commons'
import codes from '@/plugins/codes'

export default {
  props: {
    store: Object,
    pdHeaders: Array,
    pdItems: Array,
    page: Number
  },
  data () {
    return {
      productDetailVisible: false,
      productionType: process.env.VUE_APP_PRODUCTION_TYPE,
      articleId: null,
      initArticleDataList: [],
      articleDataList: [],
      articleDataKeyList: [],
      articleDataValueList: [],
      assignedLabels: [],
      labelsToAssign: [''],
      essentialProductData: {
        keys: ['ARTICLE_ID', 'ITEM_NAME', 'NFC_URL'],
        names: ['PRODUCT ID', 'DESCRIPTION', 'NFC URL']
      },
      productDetailUpdateDisabled: false,
      productAssignDisabled: false
    }
  },
  computed: {},
  mounted () {
    EventBus.$on('showProductDetail', () => {
      this.productDetailVisible = true
    })
    EventBus.$on('showCurrArticleDataValues', (articleId) => {
      this.articleId = articleId
      this.showCurrArticleDataValues()
    })
    // Get article data key list.
    const params = { store: this.store.code }
    const config = { params: params }
    if (this.productionType === 'cloud') params.company = this.$store.state.auth.user.company
    this.$utils
      .callAxios(
        codes.requests.getArticleDataKeyList.method,
        codes.requests.getArticleDataKeyList.url,
        config
      )
      .then(res => {
        this.articleDataList = this.getArticleDataListWithKeys(this.sortArticleDataKeys(res.data.articleDataKeyList))
        this.initArticleDataList = require('lodash').cloneDeep(this.articleDataList)
      })
    this.$store.dispatch('auth/getDisabledBtn', '3101').then((flag) => {
      this.productDetailUpdateDisabled = flag
    })
    this.$store.dispatch('auth/getDisabledBtn', '3101').then((flag) => {
      // 위 3103 코드는 추후 assign권한이 따로 생기면 바뀔 수 있음.
      this.productAssignDisabled = flag
    })
  },
  beforeDestroy () {
    EventBus.$off('showCurrArticleDataValues')
    EventBus.$off('showProductDetail')
  },
  methods: {
    handleLabelIdKeyUp (idx, e) {
      this.$nextTick(() => {
        // 한글, 알파벳 G~Z 특수문자 입력불가 ( 0~9 A~F 만 입력 가능) 소문자->대문자로 변경
        const labelIdFilter = /[ㄱ-ㅎㅏ-ㅣ가-힣g-zG-Z~!@#$%^&*()\-=+_';<>/.`:",[]?|{}]/gi
        e.target.value = e.target.value
          .toUpperCase()
          .replace(labelIdFilter, '')
        this.labelsToAssign[idx] = e.target.value
      })
      this.$forceUpdate()
    },
    getPlaceholder (key) {
      return this.$t(`Input the ${key}`)
    },
    closeProductDetail () {
      this.articleDataList = require('lodash').cloneDeep(this.initArticleDataList)
      this.labelsToAssign = ['']
      this.assignedLabels = []
      this.productDetailVisible = false
    },
    buildProduct (articleDataList) {
      const product = {}
      const articleData = {}
      for (const productData of articleDataList) {
        if (commons.isValidStr(productData.value)) {
          articleData[productData.key] = productData.value
        } else {
          articleData[productData.key] = null
        }
      }
      const essentialProductDataNames = this.essentialProductData.names
      for (const name of essentialProductDataNames) {
        delete articleData[name]
      }
      product.articleId = articleDataList[0].value
      product.articleName = articleDataList[1].value
      product.nfcUrl = articleDataList[2].value
      product.data = articleData
      return product
    },
    updateArticle () {
      const productToUpdate = this.buildProduct(this.articleDataList)
      const isValidData = commons.isValidData({
        productId: productToUpdate.articleId,
        description: productToUpdate.articleName
      })
      if (!isValidData.result) {
        EventBus.$emit('messageAlert', this.$t(isValidData.msg))
        return
      }
      const productData = [productToUpdate]
      const params = { store: this.$store.state.dataStore.selectedStore.code }
      const config = { params }
      if (this.productionType === 'cloud') params.company = this.$store.state.auth.user.company
      this.$utils
        .callAxiosWithBody(
          codes.requests.updateArticle.method,
          codes.requests.updateArticle.url,
          productData,
          config
        )
        .then(res => {
          const result = res.data
          EventBus.$emit('messageAlert', this.$t(result.responseMessage))
          this.closeProductDetail()
          this.$emit('fireResetProduct')
        })
        .catch(error => {
          const result = error.response.data
          EventBus.$emit('messageAlert', this.$t(result.responseMessage))
          this.closeProductDetail()
        })
    },
    getAnArticleData (articleId) {
      if (commons.isNull(articleId)) return
      const params = {
        store: this.$store.state.dataStore.selectedStore.code,
        article: articleId
      }
      const config = { params }
      if (this.productionType === 'cloud') params.company = this.$store.state.auth.user.company
      return this.$utils
        .callAxios(
          codes.requests.getAnArticle.method,
          codes.requests.getAnArticle.url,
          config
        )
        .then(res => {
          return res.data
        })
        .catch(error => {
          console.debug(`Failed to get data of an article. ${error}`)
        })
    },
    setAssignedLabel (assignedLabels) {
      if (commons.isValidStr(assignedLabels)) {
        this.assignedLabels = assignedLabels
      }
    },
    async showCurrArticleDataValues () {
      // this.articleDataList = []
      const res = await this.getAnArticleData(this.articleId)
      if (commons.isNull(res)) return
      this.setAssignedLabel(res.assignedLabel)
      const data = res.data
      if (commons.isNull(data)) return
      for (const articleData of this.articleDataList) {
        if (data[articleData.key] !== undefined) {
          articleData.value = data[articleData.key]
        } else {
          articleData.value = ''
        }
      }
      const essentialKeys = [
        { key: 'PRODUCT ID', value: res.articleId },
        { key: 'DESCRIPTION', value: res.articleName },
        { key: 'NFC URL', value: res.nfcUrl }
      ]
      for (const idx in essentialKeys) {
        if (!commons.isNull(essentialKeys[idx].value)) this.articleDataList[idx] = essentialKeys[idx]
      }
    },
    getArticleDataListWithKeys (articleDataKeyList) {
      const articleDataList = []
      for (const articleDataKey of articleDataKeyList) {
        const articleData = {}
        articleData.key = articleDataKey
        articleData.value = ''
        articleDataList.push(articleData)
      }
      return articleDataList
    },
    buildAssignList (articleId, labelToAssign) {
      const reqBody = {}
      const assignList = []
      const assignData = {}
      const articleIdList = []
      articleIdList.push(articleId)
      assignData.articleIdList = articleIdList
      assignData.labelCode = labelToAssign
      assignList.push(assignData)
      reqBody.assignList = assignList
      return reqBody
    },
    getTranslatedErrorMsg (error) {
      if (error.response === undefined) return this.$t('Failed to assign the product to the label')
      const data = error.response.data
      if (commons.matchErrorType(error, codes.debugs.templateNotFound)) {
        const responseMessage = data.responseMessage.split(' ')
        const labelId = responseMessage.pop()
        const msg = this.$t(responseMessage.join(' '))
        return `${msg} ${labelId}`
      } else if (commons.matchErrorType(error, codes.debugs.labelNotWhitelisted)) {
        const responseMessage = data.responseMessage.split(' ')
        const labelId = responseMessage.shift()
        const storeCode = responseMessage.pop().replace('station', '')
        responseMessage.push('station')
        const msg = this.$t(responseMessage.join(' '))
        return `${labelId} ${msg} ${storeCode}`
      } else {
        return this.$t(data.responseMessage)
      }
    },
    assignArticle (labelToAssign) {
      const reqBody = this.buildAssignList(this.articleId, labelToAssign)
      const params = { store: this.$store.state.dataStore.selectedStore.code }
      const config = { params: params }
      if (this.productionType === 'cloud') params.company = this.$store.state.auth.user.company
      this.$utils
        .callAxiosWithBody(
          codes.requests.assignArticles.method,
          codes.requests.assignArticles.url,
          reqBody,
          config
        )
        .then(res => {
          EventBus.$emit('messageAlert', this.$t(res.data.responseMessage))
          commons.remove(this.labelsToAssign, labelToAssign)
          commons.add(this.assignedLabels, labelToAssign)
        })
        .catch(error => {
          console.debug(`Could not assgin an article. error: ${error}`)
          EventBus.$emit('messageAlert', this.getTranslatedErrorMsg(error))
        })
    },
    unassignArticle (assignedLabel) {
      const reqBody = { unAssignList: [assignedLabel] }
      const params = { store: this.$store.state.dataStore.selectedStore.code }
      const config = { params: params }
      if (this.productionType === 'cloud') params.company = this.$store.state.auth.user.company
      this.$utils
        .callAxiosWithBody(
          codes.requests.unassignArticles.method,
          codes.requests.unassignArticles.url,
          reqBody,
          config
        )
        .then(res => {
          if (res.status === 200) {
            const msg = res.data.responseMessage.split(' ')
            const labelId = msg.pop()
            EventBus.$emit('messageAlert', `${this.$t(msg.join(' '))} ${labelId}`)
            commons.remove(this.assignedLabels, assignedLabel)
          } else {
            EventBus.$emit('messageAlert', this.$t(res.data.responseMessage))
          }
        })
        .catch(error => {
          const result = error.response.data
          EventBus.$emit('messageAlert', this.$t(result.responseMessage))
          console.debug(`Could not unassign an article. error: ${error}`)
        })
    },
    addNewLabelInput () { this.labelsToAssign.push('') },
    sortArticleDataKeys (articleDataKeys) {
      const essentialKeys = this.essentialProductData.keys
      articleDataKeys.unshift(...essentialKeys)
      return articleDataKeys
    },
    editArticleHeader (key, idx) {
      if (idx < 2) return `${key}*`
      return key
    }
  }
}
</script>
<style>
</style>
