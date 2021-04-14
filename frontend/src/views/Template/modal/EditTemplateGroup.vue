<template>
  <v-dialog
    v-model="editTemplateGroupVisible"
    @click:outside="cancelEditTemplateGroup"
    :key="editTemplateGroupVisible"
    width="800"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn :disabled="editBtnDisabled" @click="setGroupData" text v-bind="attrs" v-on="on" class="btn-s ml-2">{{$t('Edit')}}</v-btn>
    </template>

    <v-card class="popup add_store_popup">
      <h3 class="page-title-bar">
        <i class="ico ico-template"></i>{{$t('TEMPLATE EDIT')}}
      </h3>

      <v-row>
        <v-col>
          <p class="label-txt"><strong>{{$t('TEMPLATE GROUP NAME')}}</strong></p>
          <v-text-field
            v-model="groupName"
            disabled
            outlined
            dense
            hide-details
            placeholder="Input the Group Name"
            class="form-input"
            :style="{paddingTop: '0', paddingBottom: '25px'}"
            clearable
          ></v-text-field>
          <p class="label-txt"><strong>{{$t('TEMPLATE GROUP DETAIL')}}</strong></p>
          <v-data-table
            v-model="selectedGroupedTemplates"
            :headers="groupedTemplatesHeaders"
            :items="groupedTemplates"
            item-key="templateName"
            :items-per-page="-1"
            :hide-default-footer="true"
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
            @click="groupTemplates"
            text
            class="btn-round"
            ><img src="@/assets/img/ico-up.png" alt="" /> {{$t('Add')}}</v-btn
          >
        </v-col>
      </v-row>
      <v-row>
        <v-col class="pt-0 pb-0">
          <p class="label-txt"><strong>{{$t('TEMPLATE LIST')}}</strong></p>
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
            :hide-default-footer="true"
            show-select
            :single-select="true"
            fixed-header
            height="180"
            class="tbl-type01 flat-type02"
          >
          </v-data-table>
        </v-col>
      </v-row>

      <v-card-actions class="d-flex justify-center">
        <v-btn text icon @click="editGroup" class="btn"
          >{{$t('Save')}}</v-btn
        >
        <v-btn
          text icon
          @click="cancelEditTemplateGroup"
          class="btn"
          >{{$t('Cancel')}}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import EventBus from '@/plugins/eventBus.js'
import commons from '@/plugins/commons'

const requests = {
  editGroup: {
    method: 'post',
    url: '/api/common/templates/mapping/group'
  },
  getTemplatesByTag: {
    method: 'get',
    url: '/api/common/templates'
  }
}

export default {
  props: ['user', 'tagTypes', 'group', 'templates', 'editDisabled'],
  data () {
    return {
      // cloud 용 임시
      productionType: process.env.VUE_APP_PRODUCTION_TYPE,
      page: 1,
      groupName: null,
      selectedGroupedTemplates: [],
      selectedTemplatesByTag: [],
      editTemplateGroupVisible: false,
      groupedTemplatesHeaders: [
        { text: this.$t('TEMPLATE NAME'), sortable: false, value: 'templateName' },
        { text: '', sortable: false, align: 'center', value: 'del' }
      ],
      groupedTemplates: [],
      templatesByTagHeaders: [
        { text: this.$t('TEMPLATE NAME'), sortable: false, value: 'templateName' },
        {
          text: this.$t('GENERATE'),
          sortable: false,
          align: 'center',
          value: 'lastUpdateTime'
        }
      ],
      templatesByTag: []
    }
  },
  methods: {
    setGroupData () {
      this.setGroupName()
      this.groupedTemplates = this.templates.map(template => {
        return { templateName: template.name }
      })
    },
    setGroupName () {
      this.groupName = this.group.groupName
    },
    cancelEditTemplateGroup () {
      this.resetEditTemplateGroup()
      this.editTemplateGroupVisible = !this.editTemplateGroupVisible
    },
    resetEditTemplateGroup () {
      this.groupedTemplates = []
      this.templatesByTag = []
      this.selectedGroupedTemplates = []
      this.selectedTemplatesByTag = []
    },
    getTemplatesByTag (tag) {
      const params = { company: this.user.company, width: tag.width, height: tag.height }
      const config = { params: params }
      // cloud용 임시 주석
      if (this.productionType === 'cloud') {
        params.company = this.$store.state.auth.user.company
      }

      this.$utils
        .callAxios(
          requests.getTemplatesByTag.method,
          requests.getTemplatesByTag.url,
          config
        )
        .then(res => {
          this.templatesByTag = res.data.templateList
          this.selectedTemplatesByTag = []
        })
    },
    buildEditGroupBody () {
      const editGroupBody = {}
      editGroupBody.groupName = this.groupName
      const templateNameList = this.groupedTemplates.map(gt => gt.templateName)
      editGroupBody.templateNameList = templateNameList
      return editGroupBody
    },
    editGroup () {
      const editGroupBody = this.buildEditGroupBody()

      const isValidData = commons.isValidData(editGroupBody)
      if (!isValidData.result) {
        EventBus.$emit('messageAlert', this.$t(isValidData.msg))
        return
      }
      const params = { company: this.user.company }
      const config = { params: params }
      if (this.productionType === 'cloud') {
        params.company = this.$store.state.auth.user.company
      }

      this.$utils
        .callAxiosWithBody(
          requests.editGroup.method,
          requests.editGroup.url,
          editGroupBody,
          config
        )
        .then((res) => {
          const result = res.data
          EventBus.$emit('messageAlert', this.$t(result.responseMessage))
          this.cancelEditTemplateGroup()
          this.$emit('resetGroups')
        })
        .catch((error) => {
          EventBus.$emit('messageAlert', this.$t('Failed to edit the template group.'))
          this.cancelEditTemplateGroup()
          console.log(error)
        })
    },
    ungroupTemplate (groupedTemplate) {
      this.groupedTemplates = this.groupedTemplates.filter(gt => gt !== groupedTemplate)
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
  },
  computed: {
    editBtnDisabled () {
      return (this.group === null || this.group === undefined || this.editDisabled)
    }
  }
}
</script>

<style>
.scroll-tbl{height:495px; overflow-y:auto;}
/* width */
.scroll-tbl::-webkit-scrollbar {width: 5px;}
/* Track */
.scroll-tbl::-webkit-scrollbar-track {background: transparent;}
/* Handle */
.scroll-tbl::-webkit-scrollbar-thumb {background: #818181; border-radius:5px;}
/* Handle on hover */
.scroll-tbl::-webkit-scrollbar-thumb:hover {background: #555;}
</style>
