<template>
  <!-- 09.28 팝업추가 -->
  <v-dialog
    v-model="addTemplateVisible"
    width="400"
    @click:outside="cancelAddTemplate"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        :disabled="addBtnDisabled"
        text
        v-bind="attrs"
        v-on="on"
        class="btn"
        >{{ $t('Add') }}</v-btn
      >
    </template>
    <v-card class="popup add_store_popup" :key="addTemplateVisible">
      <h3 class="page-title-bar">
        <i class="ico ico-template"></i>{{ $t('Add Template') }}
      </h3>
      <v-row>
        <v-col class="pt-0">
          <v-select
            outlined
            dense
            hide-details
            v-model="tagType"
            :items="tagTypes"
            @change="setTemplateSizes"
            :label="`${$t('Label Type')}`"
            :placeholder="`${$t('Input the label type')}`"
            class="form-select"
            clearable
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="pt-0">
          <v-text-field
            v-model="template.width"
            :disabled="tagTypeSelected"
            outlined
            dense
            hide-details
            :label="`${$t('Width')} *`"
            :placeholder="`${$t('Input the width')}`"
            class="form-input"
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="pt-0">
          <v-text-field
            v-model="template.height"
            :disabled="tagTypeSelected"
            outlined
            dense
            hide-details
            :label="`${$t('Height')} *`"
            :placeholder="`${$t('Input the height')}`"
            class="form-input"
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="pt-0">
          <v-text-field
            v-model="template.templateName"
            outlined
            dense
            hide-details
            :label="`${$t('Name')} *`"
            :placeholder="`${$t('Input the template name')}`"
            class="form-input"
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="pt-0">
          <v-file-input
            accept="text/xml"
            v-model="templateFile"
            @change="encodeFile"
            @click:clear="clearFile(templateFile)"
            outlined
            dense
            hide-details
            prepend-icon
            :label="`${$t('Template File')}`"
            :placeholder="`${$t('Input the template file')}`"
            class="form-file"
            clearable
          >
            <template v-slot:append>
              <img
                width="24"
                height="24"
                src="@/assets/img/ico-upload-file.gif"
              />
            </template>
          </v-file-input>
        </v-col>
      </v-row>

      <v-card-actions class="d-flex justify-center">
        <v-btn text icon @click="addTemplate" class="btn">{{
          $t('Add')
        }}</v-btn>
        <v-btn text icon @click="cancelAddTemplate" class="btn">{{
          $t('Cancel')
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import EventBus from '@/plugins/eventBus.js'
import commons from '@/plugins/commons'

const requests = {
  getTagTypes: {
    method: 'get',
    url: '/api/common/templates/data'
  },
  addTemplate: {
    method: 'post',
    url: '/api/common/templates'
  }
}

export default {
  props: ['user', 'addBtnDisabled'],
  data () {
    return {
      productionType: process.env.VUE_APP_PRODUCTION_TYPE,
      addTemplateVisible: false,
      addTemplateInputKey: true,
      template: {
        data: null,
        templateName: null,
        fileType: 'XSL',
        width: null,
        height: null,
        tagImageUpdateRequired: true
      },
      templateFile: null,
      tagType: null,
      tagTypes: [],
      sizesByTagTypes: []
    }
  },
  methods: {
    cancelAddTemplate () {
      this.addTemplateVisible = false
      this.template = {
        data: null,
        templateName: null,
        fileType: 'XSL',
        width: null,
        height: null,
        tagImageUpdateRequired: true
      }
      this.tagType = null
      this.templateFile = null
    },
    setSizesByTagTypes (tagTypeList) {
      const sizesByTagTypes = {}
      for (const tagType of tagTypeList) {
        sizesByTagTypes[tagType.name] = tagType
      }
      this.sizesByTagTypes = sizesByTagTypes
    },
    getTagTypes () {
      const params = { company: this.user.company }
      const config = { params: params }
      if (this.productionType === 'cloud') {
        params.company = this.$store.state.auth.user.company
      }
      this.$utils
        .callAxios(
          requests.getTagTypes.method,
          requests.getTagTypes.url,
          config
        )
        .then(res => {
          this.setSizesByTagTypes(res.data.tagTypeList)
          this.tagTypes = res.data.tagTypeList.map(tl => tl.name)
        })
    },
    setTemplateSizes (event) {
      const sizes = this.sizesByTagTypes[event]
      this.template.width = sizes.width
      this.template.height = sizes.height
    },
    async encodeFile (event) {
      if (event === null) return
      if (event.type !== 'text/xml') {
        EventBus.$emit(
          'messageAlert',
          this.$t("Template file's filename extension must be XSL.")
        )
        this.$nextTick(() => {
          this.templateFile = null
        })
        return
      }
      const reader = new FileReader()
      reader.addEventListener(
        'load',
        () => {
          let result = reader.result
          if (result.startsWith('data:')) {
            const base64Idx = 'base64,'
            const strToRemove = result.substring(
              0,
              result.indexOf(base64Idx, 0) + base64Idx.length
            )
            result = result.substring(strToRemove.length, result.length)
          }
          this.template.data = result
        },
        false
      )
      if (event) {
        await reader.readAsDataURL(event)
      }
    },
    addTemplate () {
      this.template.templateName =
        this.template.templateName === null
          ? null
          : this.template.templateName.trim()
      const template = this.template
      const isValidData = commons.isValidData(template)
      if (!isValidData.result) {
        EventBus.$emit('messageAlert', this.$t(isValidData.msg))
        return
      }
      const params = { company: this.user.company }
      const config = { params }
      params.company = this.$store.state.auth.user.company

      if (this.productionType === 'cloud') {
        template.labelType = this.tagType
      }
      this.$utils
        .callAxiosWithBody(
          requests.addTemplate.method,
          requests.addTemplate.url,
          template,
          config
        )
        .then(res => {
          const result = res.data
          EventBus.$emit('messageAlert', this.$t(result.responseMessage))
          this.cancelAddTemplate()
          this.$emit('refreshTemplates')
        })
        .catch(error => {
          console.log(error)
          EventBus.$emit('messageAlert', this.$t('Failed to add new template'))
          this.cancelAddTemplate()
        })
    },
    clearFile (templateFile) {
      templateFile = null
      this.template.data = null
    }
  },
  computed: {
    tagTypeSelected () {
      return this.tagType !== null
    }
  },
  mounted () {
    this.getTagTypes()
  }
}
</script>

<style></style>
