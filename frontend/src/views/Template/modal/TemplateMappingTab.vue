<template>
  <div>
        <!-- 10.06 탭 안쪽으로 이동 -->
        <div class="mapping-selector d-flex justify-end">
          <div class="d-flex align-center">
            <p>{{$t('Normal Group')}}</p>
            <v-select
              outlined dense hide-details solo
              :placeholder="`${$t('Choose the group')}`"
              v-model="selectedGroup"
              :items="groupItems"
              item-text="groupName"
              item-value="groupName"
              class="form-select ml-2"
            ></v-select>
          </div>
        </div>
        <!-- //10.06 탭 안쪽으로 이동 -->

        <!-- data table -->
        <v-data-table
          v-model="selectedRow"
          :headers="templateMappingHeaders"
          :items="tableItems"
          :page.sync="page"
          :hide-default-footer="true"
          :items-per-page="-1"
          item-key="priority"
          show-select
          fixed-header
          height="528"
          class="tbl-type01"
        >
          <template slot="no-data">
            <p>
              {{ $t('No data available') }}
            </p>
          </template>
        </v-data-table>

        <!-- 10.06 버튼 탭 안쪽으로 이동 -->
        <div class="innerButton">
          <!-- paging -->
          <div class="pageInfo">{{ pageInfoText }}</div>

          <div class="mt-2 mb-2">
            <v-btn text icon><img src="@/assets/img/ico-move-top.png" @click="moveRow('top')" alt=""></v-btn>
            <v-btn text icon><img src="@/assets/img/ico-move-up.png" @click="moveRow('up')" alt=""></v-btn>
            <v-btn text icon><img src="@/assets/img/ico-move-down.png" @click="moveRow('down')" alt=""></v-btn>
            <v-btn text icon><img src="@/assets/img/ico-move-bottom.png" @click="moveRow('bottom')" alt=""></v-btn>
          </div>

          <v-dialog
            v-model="dialogSave"
            @click:outside="closeModal"
            width="400"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn text :disabled="buttonDisabled" v-bind="attrs" v-on="on" class="btn">{{$t('New')}}</v-btn>
            </template>

            <v-card class="popup add_store_popup">
              <h3 class="page-title-bar"><i class="ico ico-template"></i>{{$t('NEW MAPPING')}}</h3>
              <!--
              <v-row>
                <v-col>
                  <v-text-field outlined dense hide-details
                    label="Mapping Title"
                    placeholder="Input the mapping title"
                    v-model="SaveCondition.tartgetField"
                    class="form-input"
                  ></v-text-field>
                </v-col>
              </v-row>
              -->
              <v-row>
                <v-col>
                  <v-select
                    outlined dense hide-details
                    :label="`${$t('Target Field')}`"
                    :placeholder="`${$t('Select the target field')}`"
                    v-model="SaveCondition.tartgetField"
                    ref="tartgetField"
                    :items="targetFieldItems"
                    class="form-select"
                    clearable
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field outlined dense hide-details
                    :label="`${$t('Expected Value')}`"
                    :placeholder="`${$t('Input the expected value')}`"
                    v-model="SaveCondition.expectedValue"
                    ref="expectedValue"
                    class="form-input"
                    clearable
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <!--
                  <v-text-field outlined dense hide-details
                    label="Template Group"
                    placeholder="Input template group"
                    v-model="SaveCondition.linkedTemplateGroup"
                    class="form-input ico-search"
                  >-->
                  <v-select
                    outlined dense hide-details
                    :label="`${$t('Template Group')}`"
                    :placeholder="`${$t('Template Group')}`"
                    v-model="SaveCondition.linkedTemplateGroup"
                    :items="groupItems"
                    item-text="groupName"
                    item-value="groupName"
                    ref="linkedTemplateGroup"
                    class="form-select"
                    clearable
                  ></v-select>
                  <!--
                  <template v-slot:append>
                    <img width="24" height="24" src="@/assets/img/ico-upload-file.gif" >
                  </template>
                  </v-text-field>
                  -->

                </v-col>
              </v-row>

              <v-card-actions class="d-flex justify-center">
                <v-btn text icon  @click="AddSave()" class="btn">{{$t('Save')}}</v-btn>
                <v-btn text icon @click="dialogSave = false" class="btn">{{$t('Cancel')}}</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-btn text :disabled="deleteDisabled" class="btn ml-1" @click="RemoveRow()" >{{$t('Delete')}}</v-btn>
          <v-btn text :disabled="buttonDisabled" class="btn ml-1" @click="Save()">{{$t('Save')}}</v-btn>
        </div>
      </div>
</template>
<script>
import EventBus from '@/plugins/eventBus.js'
import commons from '@/plugins/commons'

export default {
  props: {
    tapNumber: Number,
    buttonDisabled: Boolean
  },
  computed: {
    templateMappingHeaders () {
      return [
        { text: this.$t('PRIORITY'), value: 'priority', sortable: false },
        { text: this.$t('TARGET FIELD'), value: 'tartgetField', sortable: false },
        { text: this.$t('EXPECTED VALUE'), value: 'expectedValue', sortable: false },
        { text: this.$t('LINKED TEMPLATE GROUP'), value: 'linkedTemplateGroup', sortable: false }
      ]
    }
  },
  watch: {
    selectedRow () {
      this.deleteDisabled = (commons.isNull(this.selectedRow) || this.selectedRow.length < 1 || this.buttonDisabled)
    },
    dialogSave (value) {
      if (value) {
        this.initAddPopup()
      }
    }
  },
  methods: {
    changedSate (flag) {
      this.$emit('changedSave', flag)
    },
    getTemplateGroup () {
      const data = {}
      const params = {
        company: this.$store.state.auth.user.company,
        size: 10000
      }
      const config = {
        data: data,
        params: params
      }
      this.$utils
        .callAxios(
          this.requests.getTemplateGroup.method,
          this.requests.getTemplateGroup.url,
          config
        )
        .then((res) => {
          const result = res.data
          if (result.responseCode === '200') {
            this.groupItems = res.data.groupList
          }
        })
    },
    getPageInfoText: function (headers) {
      if (headers['x-totalelements'] === 0) return '0 in total'
      return `${headers['x-total-count'] * 1} in total`
    },
    getTemplateList (page) {
      const data = {}
      const params = {}
      params.page = page
      params.company = this.$store.state.auth.user.company
      const config = {
        data: data,
        params: params
      }
      this.$utils
        .callAxios(
          this.requests.getTemplateList.method,
          this.requests.getTemplateList.url,
          config
        )
        .then((res) => {
          const result = res.data

          if (result.responseCode === '200') {
            const createdList = res.data.conditionList.map((row, index) => {
              return {
                priority: index + 1,
                tartgetField: row.tartgetField,
                expectedValue: row.expectedValue,
                checkMethod: 'equal',
                linkedTemplateGroup: row.linkedTemplateGroup
              }
            })
            this.tableItems = createdList
            this.selectedGroup = res.data.defaultGroup
            // Pagination
            this.pageInfoText = this.getPageInfoText(res.headers)
          }
        })
    },
    RemoveRow () {
      if (this.selectedRow.length === 0) return

      const aliveList = []
      this.tableItems.map((row, index, target) => {
        let alive = true
        this.selectedRow.forEach(element => {
          if (row.priority === element.priority) {
            alive = false
          }
        })
        if (alive) {
          aliveList.push(row)
        }
      })
      this.tableItems = aliveList
      this.selectedRow = []
      this.tableSort()
    },
    tableSort () {
      this.tableItems = this.tableItems.map((row, index) => {
        return {
          priority: index + 1,
          tartgetField: row.tartgetField,
          expectedValue: row.expectedValue,
          checkMethod: 'equal',
          linkedTemplateGroup: row.linkedTemplateGroup
        }
      })

      this.changedSate(true) // 데이타 변경 되었음
    },
    moveRow (type) { // top , up , down  , bottom
      const selectArray = []
      let tableItemsCopy = null
      let tempRow = {}
      let shift = 0

      if (this.selectedRow.length === 0) return

      this.selectedRow.forEach(row => {
        selectArray.push(row.priority)
      })

      tableItemsCopy = this.tableItems.slice()

      if (type === 'top') {
        if (selectArray.indexOf(1) !== -1) { // 최상위가 포함되면
          return
        }
        shift = 0 - (selectArray[0] + -1)

        for (let x = 0; x < selectArray.length; x++) {
          for (let i = 0; i < selectArray[x]; i++) {
            if (selectArray[x] * 1 > (i + 1)) {
              if (i > (selectArray[x] + shift - 1)) {
                this.tableItems.splice(i, 1, tableItemsCopy[i - 1])
              }
            } else if (selectArray[x] * 1 === (i + 1)) {
              this.tableItems.splice(i, 1, tableItemsCopy[i - 1])
              this.tableItems.splice(i + shift, 1, tableItemsCopy[i])
            }
            if (i === (selectArray[x] - 1)) {
              tableItemsCopy = this.tableItems.slice()
            }
          }
        }
      } else if (type === 'up') {
        shift = -1
        if (selectArray.indexOf(1) !== -1) { // 최상위가 포함되면
          return
        }
        for (let i = 0; i < this.tableItems.length; i++) {
          if (selectArray.indexOf(this.tableItems[i].priority) !== -1) {
            tempRow = this.tableItems[i]
            this.tableItems.splice(i, 1, this.tableItems[i + shift])
            this.tableItems.splice(i + shift, 1, tempRow)
          }
        }
      } else if (type === 'down') {
        shift = 1
        if (selectArray.indexOf(this.tableItems.length) !== -1) { // 최하위가 포함되면
          return
        }
        for (let i = this.tableItems.length - 1; i >= 0; i--) {
          if (selectArray.indexOf(this.tableItems[i].priority) !== -1) {
            tempRow = this.tableItems[i]
            this.tableItems.splice(i, 1, this.tableItems[i + shift])
            this.tableItems.splice(i + shift, 1, tempRow)
          }
        }
      } else if (type === 'bottom') {
        if (selectArray.indexOf(this.tableItems.length) !== -1) { // 최하위가 포함되면
          return
        }

        shift = this.tableItems.length - (selectArray[selectArray.length - 1])
        for (let x = selectArray.length - 1; x >= 0; x--) {
          for (let i = selectArray[x] - 1; i < this.tableItems.length; i++) {
            if (selectArray[x] * 1 < (i + 1)) {
              if (i < (selectArray[x] + shift - 1)) {
                this.tableItems.splice(i, 1, tableItemsCopy[i + 1])
              }
            } else if (selectArray[x] * 1 === (i + 1)) {
              this.tableItems.splice(i, 1, tableItemsCopy[i + 1])
              this.tableItems.splice(i + shift, 1, tableItemsCopy[i])
            }
            if (i === (this.tableItems.length - 1)) {
              tableItemsCopy = this.tableItems.slice()
            }
          }
        }
      }
      this.tableSort()
      const selectedStay = []
      this.selectedRow.map((value) => {
        selectedStay.push(this.tableItems[value.priority + shift - 1])
      })
      this.selectedRow = selectedStay
    },
    checkSelectedRow (target, selectedRow) {
      selectedRow.map()
    },
    getTargetField () {
      const data = {}
      const params = { }
      // cloud 용 임시
      if (this.productionType === 'cloud') {
        params.company = this.$store.state.auth.user.company
      }
      const config = {
        data: data,
        params: params
      }
      this.$utils
        .callAxios(
          this.requests.getTargetField.method,
          this.requests.getTargetField.url,
          config
        )
        .then((res) => {
          const result = res.data
          if (result.responseCode === '200') {
            this.targetFieldItems = res.data.articleDataKeyList
          }
        })
    },
    closeModal () {
      this.dialogSave = false
    },
    initAddPopup () {
      this.SaveCondition.tartgetField = ''
      this.SaveCondition.expectedValue = ''
      this.SaveCondition.linkedTemplateGroup = ''
      this.getTargetField()
    },
    AddSave () {
      if (this.SaveCondition.tartgetField === '') {
        EventBus.$emit('messageAlert', this.$t('Input the data'))
        this.$refs.tartgetField.focus()
        return
      }
      if (this.SaveCondition.expectedValue === '') {
        EventBus.$emit('messageAlert', this.$t('Input the data'))
        this.$refs.expectedValue.focus()
        return
      }
      if (this.SaveCondition.linkedTemplateGroup === '') {
        EventBus.$emit('messageAlert', this.$t('Input the data'))
        this.$refs.linkedTemplateGroup.focus()
        return
      }
      // add List
      this.tableItems.push(
        {
          priority: this.tableItems.length + 1,
          tartgetField: this.SaveCondition.tartgetField,
          expectedValue: this.SaveCondition.expectedValue,
          checkMethod: 'equal',
          linkedTemplateGroup: this.SaveCondition.linkedTemplateGroup
        }
      )
      this.dialogSave = false
      this.changedSate(true) // 데이타 변경 되었음
    },
    Save () {
      // selectedGroup값이 groupItems에 포함 되어 있는지 확인
      const selectedGroupValue = this.groupItems.filter((item) => {
        if (this.selectedGroup === item.groupName) return item
      })

      if (!commons.notEmpty(selectedGroupValue)) {
        EventBus.$emit('messageAlert', this.$t('Template group not exists. Please change the default template group'))
        return
      }
      const data = {}
      const params = { }
      params.company = this.$store.state.auth.user.company
      params.page = this.tapNumber

      data.defaultGroup = this.selectedGroup
      data.conditionList = this.tableItems
      const config = {
        params: params
      }
      this.$utils
        .callAxiosWithBody(
          this.requests.getTemplateSave.method,
          this.requests.getTemplateSave.url,
          data,
          config
        )
        .then((res) => {
          const result = res.data

          if (result.responseCode === '200') {
            EventBus.$emit('messageAlert', this.$t('Saved successfully'))
            this.dialogSave = false
            this.changedSate(false) // 데이타 변경상태 클리어
          } else {
            EventBus.$emit('messageAlert', this.$t(result.responseMessage))
          }
        })
    }
  },
  mounted () { // init
    this.getTemplateGroup()
    this.getTemplateList(this.tapNumber)
  },
  data () {
    return {
      // cloud 용 임시
      productionType: process.env.VUE_APP_PRODUCTION_TYPE,
      selectedRow: [],
      search: '',
      page: 1,
      pageCount: 0,
      dialogSave: false,
      deleteDisabled: true,
      pageInfoText: '',
      SaveCondition: {
        page: this.tapNumber,
        tartgetField: '',
        checkMethod: '',
        expectedValue: '',
        linkedTemplateGroup: ''
      },
      requests: {
        getTemplateGroup: {
          method: 'get',
          url: '/api/common/templates/mapping/group'
        },
        getTemplateList: {
          method: 'get',
          url: '/api/common/templates/mapping/condition'
        },
        getTemplateSave: {
          method: 'post',
          url: '/api/common/templates/mapping/condition'
        },
        getTargetField: {
          method: 'get',
          url: '/api/common/articles/data'
        }
      },
      selectedGroup: {},
      groupItems: [],
      targetFieldItems: [],
      tableItems: []
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
