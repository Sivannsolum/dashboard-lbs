<template>
  <v-dialog
    v-model="newTemplateGroupVisible"
    @click:outside="cancelNewTemplateGroup"
    :key="newTemplateGroupVisible"
    width="800"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn :disabled="newBtnDisabled" text v-bind="attrs" v-on="on" class="btn-s">{{$t('New')}}</v-btn>
    </template>

    <v-card class="popup add_store_popup">
      <h3 class="page-title-bar">
        <i class="ico ico-template"></i>{{ $t('NEW TEMPLATE GROUP') }}
      </h3>

      <v-row>
        <v-col>
          <p class="label-txt"><strong>{{ $t('TEMPLATE GROUP NAME') }}</strong></p>
          <v-text-field
            v-model="groupName"
            :placeholder="`${$t('Input the group name')}`"
            :style="{paddingTop: '0', paddingBottom: '25px'}"
            class="form-input"
            outlined
            dense
            hide-details
            clearable
          >
            <template slot="no-data">
              <p>{{ $t('No data available') }}</p>
            </template>
          </v-text-field>
          <p class="label-txt"><strong>{{ $t('TEMPLATE GROUP DETAIL') }}</strong></p>
          <v-data-table
            v-model="selectedGroupedTemplates"
            :headers="groupedTemplatesHeaders"
            :items="groupedTemplates"
            item-key="templateName"
            :hide-default-footer="true"
            :items-per-page="-1"
            fixed-header
            height="248"
            class="tbl-type01 flat-type02 mt-2"
          >
            <template v-slot:[`item.del`]="{ item }">
              <v-btn
                @click="ungroupTemplate(item)"
                text icon
                ><img src="@/assets/img/ico-delete2.png" alt=""
              /></v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex justify-center">
          <v-btn
            @click="handleAddClick"
            text
            class="btn-round"
            ><img src="@/assets/img/ico-up.png" alt="" /> {{ $t('Add') }}</v-btn
          >
        </v-col>
      </v-row>
      <v-row>
        <v-col class="pt-0 pb-0">
          <p class="label-txt"><strong>{{ $t('TEMPLATE LIST') }}</strong></p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <v-list dense class="list-selector scroll">
            <v-list-item-group>
              <v-list-item
                v-for="(tagType, i) in tagTypes"
                :key="i"
                @click="getTemplatesByTag(tagType)"
              >
                <v-list-item-content>
                  <v-list-item-title v-text="tagType.name"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-col>
        <v-col cols="8">
          <v-data-table
            v-model="selectedTemplatesByTag"
            :headers="templatesByTagHeaders"
            :items="templatesByTag"
            item-key="templateName"
            :page.sync="page"
            :hide-default-footer="true"
            :single-select="true"
            show-select
            fixed-header
            height="180"
            class="tbl-type01 flat-type02"
          >
          <template slot="no-data">
            <p> {{ $t('No data available') }} </p>
          </template>
          </v-data-table>
        </v-col>
      </v-row>

      <v-card-actions class="d-flex justify-center">
        <v-btn
          @click="handleSaveClick"
          text icon
          class="btn"
        >{{ $t('Save') }}
        </v-btn>
        <v-btn
          @click="cancelNewTemplateGroup"
          class="btn"
          text
          icon
        >{{ $t('Cancel') }}
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
  props: ['user', 'tagTypes', 'newBtnDisabled'],
  data () {
    return {
      // cloud 용 임시
      productionType: process.env.VUE_APP_PRODUCTION_TYPE,
      page: 1,
      groupName: null,
      selectedGroupedTemplates: [],
      selectedTemplatesByTag: [],
      newTemplateGroupVisible: false,
      groupedTemplates: [],
      templatesByTag: [],
      msg: {
        confirm: {
          emptyGroup: this.$t('The template list is empty. Go ahead?')
        }
      }
    }
  },
  computed: {
    groupedTemplatesHeaders () {
      return [
        { text: this.$t('TEMPLATE NAME'), sortable: false, value: 'templateName' },
        { text: '', sortable: false, align: 'center', value: 'del' }
      ]
    },
    templatesByTagHeaders () {
      return [
        { text: this.$t('TEMPLATE NAME'), sortable: false, value: 'templateName' },
        {
          text: this.$t('GENERATE'),
          sortable: false,
          align: 'center',
          value: 'lastUpdateTime'
        }
      ]
    }
  },
  methods: {
    cancelNewTemplateGroup () {
      this.resetNewTemplateGroup()
      this.newTemplateGroupVisible = !this.newTemplateGroupVisible
    },
    resetNewTemplateGroup () {
      this.groupName = null
      this.groupedTemplates = []
      this.templatesByTag = []
      this.selectedGroupedTemplates = []
      this.selectedTemplatesByTag = []
    },
    getTemplatesByTag (tag) {
      const params = { company: this.user.company, width: tag.width, height: tag.height }
      const config = { params: params }
      if (this.productionType === 'cloud') params.company = this.$store.state.auth.user.company
      this.$utils
        .callAxios(
          codes.requests.getTemplatesByTag.method,
          codes.requests.getTemplatesByTag.url,
          config
        )
        .then(res => {
          this.templatesByTag = res.data.templateList
          this.selectedTemplatesByTag = []
        })
    },
    buildAddGroupBody () {
      const addGroupBody = {}
      addGroupBody.groupName = commons.isValidStr(this.groupName) ? this.groupName.trim() : this.groupName
      const templateNameList = this.groupedTemplates.map(gt => gt.templateName)
      addGroupBody.templateNameList = templateNameList
      return addGroupBody
    },
    handleSaveClick () {
      if (Array.isArray(this.selectedGroupedTemplates) && this.groupedTemplates.length < 1) {
        // 추가하려는 그룹에 포함될 template이 한 개도 없는경우 사용자 진행의사 확인.
        this.$emit('fireConfirm', this.msg.confirm.emptyGroup, this.addGroup)
      } else {
        this.addGroup()
      }
    },
    addGroup () {
      const addGroupBody = this.buildAddGroupBody()
      const isValidData = commons.isValidData(addGroupBody)
      if (!isValidData.result) {
        EventBus.$emit('messageAlert', this.$t(isValidData.msg))
        return
      }
      const params = { company: this.user.company }
      const config = { params: params }
      if (this.productionType === 'cloud') params.company = this.$store.state.auth.user.company
      this.$utils
        .callAxiosWithBody(
          codes.requests.addGroup.method,
          codes.requests.addGroup.url,
          addGroupBody,
          config
        )
        .then(res => {
          const result = res.data
          EventBus.$emit('messageAlert', this.$t(result.responseMessage))
          this.cancelNewTemplateGroup()
          this.$emit('resetGroups')
        })
        .catch((error) => {
          EventBus.$emit('messageAlert', this.$t('Failed to add a new template group.'))
          this.cancelNewTemplateGroup()
          console.log(error)
        })
    },
    ungroupTemplate (groupedTemplate) {
      this.groupedTemplates = this.groupedTemplates.filter(gt => gt !== groupedTemplate)
    },
    handleAddClick () {
      this.groupTemplates()
    },
    groupTemplates () {
      let templates = this.selectedTemplatesByTag
      // Remove redundant templates beforehand.
      templates = templates.filter(template => {
        for (const gt of this.groupedTemplates) {
          if (gt.templateName === template.templateName) {
            EventBus.$emit('messageAlert', this.$t('Same template is already selected.'))
            return false
          }
        }
        return true
      })
      // Check if user is trying to add a redundant type of template
      const groupedTemplates = this.groupedTemplates
      for (const gt of groupedTemplates) {
        for (const t of templates) {
          if (gt.width === t.width && gt.height === t.height) {
            EventBus.$emit('messageAlert', this.$t('Same template type already selected. Please deselect that to select new template.'))
            return
          }
        }
      }
      this.groupedTemplates = [...groupedTemplates, ...templates]
      this.selectedTemplatesByTag = []
    }
  }
}
</script>

<style>
</style>
