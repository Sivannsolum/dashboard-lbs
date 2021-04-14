<template>
  <div>
    <h2 class="page-title-bar">
      <i class="ico ico-user"></i>{{ $t('User Level') }}
    </h2>
    <v-row class="mt-10">
      <v-col cols="3">
        <!-- data table -->
        <v-data-table
          :headers="tableHeaders"
          v-model="selectedAcc"
          :items="accessLevelList"
          item-key="accessLevel"
          :page.sync="page"
          :hide-default-footer="true"
          @click:row="onRowClickAccessLevel"
          single-select
          height="700"
          class="tbl-type03"
          @page-count="pageCount = $event"
        >
          <template v-slot:[`item.title`]="{ item }">
            <v-text-field
              v-if="item.editable"
              dense
              hide-details
              v-model="item.title"
              placeholder="item.title"
              class="form-input"
              readolny
              clearable
            ></v-text-field>
            <span v-else>{{ item.title }}</span>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn text v-if="item.accessLevel != 1" @click="onTitleEdit(item)">
              <img src="@/assets/img/ico-edit.png" alt="" />
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="1" class="d-flex justify-center align-center">
        <img src="@/assets/img/ico-next-step.png" alt="" />
      </v-col>
      <v-col cols="4">
        <h3 class="tit-treeBox">{{ $t('MENU ACCESS') }}</h3>
        <div class="treeBox">
          <template>
            <v-treeview
              v-model="selectedMenu"
              :items="accessMenuTree"
              item-disabled="primary"
              open-all
              selectable
              dense
              shaped
              selected-color="#001e38"
              class="tree_selector"
            ></v-treeview>
          </template>
        </div>
        <div>
          <v-btn
            @click="onSaveMenu"
            :disabled="userLevelSaveResetDisabled"
            text
            class="btn t-bottom"
            >{{ $t('Save') }}
          </v-btn>
          <v-btn
            @click="onResetMenu"
            :disabled="userLevelSaveResetDisabled"
            text
            class="btn t-bottom ml-2"
            >{{ $t('Reset') }}
          </v-btn>
        </div>
      </v-col>
      <v-col cols="4">
        <h3 class="tit-treeBox">{{ $t('ACTION ACCESS') }}</h3>
        <div class="treeBox">
          <template>
            <v-treeview
              v-model="selectedAction"
              :items="accessActionTree"
              item-disabled="primary"
              open-all
              selectable
              dense
              shaped
              selected-color="#001e38"
              class="tree_selector"
            ></v-treeview>
          </template>
        </div>
        <div>
          <v-btn
            @click="onSaveAction"
            :disabled="userLevelSaveResetDisabled"
            text
            class="btn t-bottom"
          >
            {{ $t('Save') }}
          </v-btn>
          <v-btn
            @click="onResetAction"
            :disabled="userLevelSaveResetDisabled"
            text
            class="btn t-bottom ml-2"
          >
            {{ $t('Reset') }}
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import EventBus from '@/plugins/eventBus.js'
import commons from '@/plugins/commons'
import codes from '@/plugins/codes'

const requests = {
  getAccessLevels: {
    method: 'get',
    url: '/api/common/accessLevel'
  },
  updateAcessLevelTitle: {
    method: 'put',
    url: '/api/common/accessLevel/title'
  },
  getDefaultAccessMenu: {
    method: 'get',
    url: '/api/common/accessLevel/menu/reset'
  },
  getDefaultAccessAction: {
    method: 'get',
    url: '/api/common/accessLevel/action/reset'
  },
  updateAccessMenu: {
    method: 'put',
    url: '/api/common/accessLevel/menu'
  },
  updateAccessAction: {
    method: 'put',
    url: '/api/common/accessLevel/action'
  }
}

const essentialItems = ['8400']
const primaryMenu = ['8300', '9000', '9100', '9200', '9300', '9400', '9500']
const primaryAccess = [
  '8300',
  '9000',
  '9100',
  '9101',
  '9102',
  '9200',
  '9201',
  '9300',
  '9400',
  '9500'
]
const essentialAccessItems = ['8400', '8401']

function getMenuGroup (menuId) {
  return menuId.toString().substr(0, 1)
}

export default {
  name: 'UserLevel',
  data () {
    return {
      productionType: process.env.VUE_APP_PRODUCTION_TYPE,
      user: null,
      page: 1,
      pageCount: 0,
      selectedAcc: [],
      accessLevelList: [],

      selectedLevel: null,
      selectedMenu: [],
      selectedAction: [],
      disabeldLinks: [
        {
          key: 'lbsEnable',
          parentCode: '6000',
          codeList: ['6100']
        },
        {
          key: 'templateGroupEnable',
          parentCode: '5000',
          codeList: ['5200', '5300']
        }
      ],
      userLevelSaveResetDisabled: false
    }
  },
  computed: {
    tableHeaders () {
      return [
        {
          text: this.$t('Level'),
          sortable: false,
          align: 'center',
          value: 'accessLevel'
        },
        {
          text: this.$t('TITLE'),
          sortable: false,
          align: 'center',
          value: 'title'
        },
        { text: '', sortable: false, align: 'center', value: 'actions' }
      ]
    },
    company () {
      const account = this.$store.state.auth.user
      return account && account.company
    },
    accessMenuTree () {
      const accessMenu = this.$store.getters['dataStore/GET_MENU']
      return this.makeMenuTree(accessMenu, primaryMenu)
    },
    accessActionTree () {
      const accessAction = this.$store.getters['dataStore/GET_ACTION']
      return this.makeAccessTree(accessAction, primaryAccess)
    }
  },
  beforeMount () {
    this.user = this.$store.state.auth.user
  },
  mounted () {
    // 상단 공통 팝업 & 자동완성기능 사용유무
    EventBus.$emit('enableSelectedStores', false)
    this.$store.dispatch('auth/getDisabledBtn', '8300').then(flag => {
      this.userLevelSaveResetDisabled = flag
    })
    this.getAccessLevels()
  },
  methods: {
    makeMenuTree (list, primaryItems) {
      if (!commons.isValidStr(list)) return

      // 1차 테스트 대상이 아니면 생성안함.
      const noAccMenu = ['1000', '2200', '4200', '6300']

      // cloud일경우 App Config, System License 메뉴 사용하지 않음
      if (this.productionType === codes.productionTypes.CLOUD) {
        noAccMenu.push('9300', '9400')
      }

      const disabeldLinks = this.setDisabled(this.disabeldLinks)
      for (const link of disabeldLinks) {
        if (link.disabled === true) noAccMenu.push(...link.codeList)
      }
      const tree = list.reduce((total, currentValue) => {
        const treeItem = {
          id: currentValue.code,
          name: currentValue.name
        }
        // Primary item 이면 마크.
        if (primaryItems.includes(treeItem.id)) treeItem.primary = true
        let parent = null
        for (let index = 0; index < total.length; index++) {
          const element = total[index]
          if (
            !noAccMenu.includes(treeItem.id) &&
            getMenuGroup(treeItem.id) === getMenuGroup(element.id)
          ) {
            // Parent가 있는 경우 현재 요소를 해당 Parent의 child로 포함.
            parent = element
            break
          }
        }
        if (parent !== null) {
          // 부모 요소가 존재하는 경우.
          if (!parent.children) parent.children = []
          if (primaryItems.includes(parent.id)) parent.primary = true
          parent.children.push(treeItem)
        } else {
          // 부모 요소 생성되지 않은 경우.
          if (!commons.has(noAccMenu, treeItem.id)) {
            total.push(treeItem)
          }
        }
        return total
      }, [])
      // 부모 없이 Leaf만 있는 경우 부모를 생성해 줌
      tree.forEach(x => {
        if (!x.children) {
          x.children = [
            {
              id: x.id,
              name: x.name
            }
          ]
          x.id = x.id + 1
        }
      })
      return tree
    },
    makeAccessTree (accessAction, primaryItems) {
      if (!commons.isValidStr(accessAction)) return
      accessAction = accessAction.map(x => {
        return {
          id: x.code,
          name: x.name
        }
      })
      // 1차 테스트 대상이 아니면 생성안함
      const noAccMenu = ['1000', '2200', '2301', '2302', '4200', '4201']
      const disabeldLinks = this.setDisabled(this.disabeldLinks)
      for (const link of disabeldLinks) {
        if (link.disabled === true) noAccMenu.push(...link.codeList)
      }
      const tree = accessAction.reduce((total, currentValue) => {
        const treeItem = {
          id: currentValue.id,
          name: currentValue.name
        }
        // Primary item 이면 마크.
        if (primaryItems.includes(treeItem.id)) treeItem.primary = true
        let parent = null
        for (let index = 0; index < total.length; index++) {
          const element = total[index]
          if (
            !noAccMenu.includes(treeItem.id) &&
            getMenuGroup(treeItem.id) === getMenuGroup(element.id)
          ) {
            // Parent가 있는 경우 현재 요소를 해당 Parent의 child로 포함.
            parent = element
            break
          }
        }
        if (parent) {
          // 부모 요소가 존재하는 경우.
          if (!parent.children) parent.children = []
          if (primaryItems.includes(parent.id)) parent.primary = true
          parent.children.push(treeItem)
        } else {
          // 부모 요소 생성되지 않은 경우.
          if (noAccMenu.indexOf(treeItem.id) === -1) {
            total.push(treeItem)
          }
        }
        return total
      }, [])
      tree.forEach(x => {
        if (!x.children) {
          // 부모 없이 Leaf만 있는 경우 부모를 생성해 줌
          x.children = [
            {
              id: x.id,
              name: x.name
            }
          ]
          x.id = x.id + 1
        }
      })
      return tree
    },
    getAccessLevels: function () {
      this.$utils
        .callAxios(
          requests.getAccessLevels.method,
          requests.getAccessLevels.url,
          {
            params: {
              company: this.company
            }
          }
        )
        .then(({ data }) => {
          this.accessLevelList = data.accessLevelList.map(accessLevel => {
            accessLevel.editable = false
            return accessLevel
          })
          // Load시 초기 셋팅
          if (!commons.notEmpty(this.selectedAcc)) {
            this.initSelected()
          }
        })
    },
    initSelected () {
      // Load시 초기 셋팅 user Level로 셋팅
      const userLevel = String(this.$store.getters['auth/GET_USER_LEVEL'])
      const userLevelList = this.accessLevelList.filter(list => {
        return list.accessLevel === userLevel
      })

      this.selectedLevel = userLevelList[0]
      this.selectedAcc.push(userLevelList[0])

      this.selectedMenu = [...userLevelList[0].accessMenu]
      this.selectedAction = [...userLevelList[0].accessAction]
    },
    onTitleEdit (level) {
      level.editable = !level.editable
      if (!level.editable) {
        this.$utils.callAxiosWithBody(
          requests.updateAcessLevelTitle.method,
          requests.updateAcessLevelTitle.url,
          {
            title: level.title
          },
          {
            params: {
              company: this.company,
              accessLevel: level.accessLevel
            }
          }
        )
      }
    },
    isAccessLevel (accessLevel) {
      const userLevel = this.$store.getters['auth/GET_USER_LEVEL']
      return Number(accessLevel) >= Number(userLevel)
    },
    onRowClickAccessLevel (level, row) {
      if (!this.isAccessLevel(level.accessLevel)) {
        EventBus.$emit('messageAlert', this.$t('You have no permission'))
        return
      }
      row.select(true)
      this.selectedLevel = level

      this.selectedMenu = this.selectedLevel.accessMenu
      this.selectedAction = this.selectedLevel.accessAction
    },
    onSaveMenu () {
      if (!commons.isValidStr(this.selectedMenu)) return
      const accessMenu = this.selectedMenu.concat(essentialItems)
      this.$utils
        .callAxiosWithBody(
          requests.updateAccessMenu.method,
          requests.updateAccessMenu.url,
          accessMenu,
          {
            params: {
              company: this.company,
              accessLevel: this.selectedLevel.accessLevel
            }
          }
        )
        .then(({ data }) => {
          EventBus.$emit('messageAlert', this.$t('Saved successfully'))
          this.getAccessLevels()
        })
    },
    onResetMenu () {
      if (!this.selectedLevel) {
        return
      }
      this.$utils
        .callAxios(
          requests.getDefaultAccessMenu.method,
          requests.getDefaultAccessMenu.url,
          {
            params: {
              company: this.company,
              accessLevel: this.selectedLevel.accessLevel
            }
          }
        )
        .then(res => {
          EventBus.$emit(
            'messageAlert',
            this.$t('Reset Menu Aaccess Successfully')
          )
          this.selectedMenu = res.data.accessMenu
        })
    },
    onSaveAction () {
      if (!this.selectedLevel) return
      const menuContainsPrimaryItems = this.selectedAction.concat(
        essentialAccessItems
      )
      this.$utils
        .callAxiosWithBody(
          requests.updateAccessAction.method,
          requests.updateAccessAction.url,
          menuContainsPrimaryItems,
          {
            params: {
              company: this.company,
              accessLevel: this.selectedLevel.accessLevel
            }
          }
        )
        .then(({ data }) => {
          EventBus.$emit('messageAlert', this.$t('Saved successfully'))
          this.getAccessLevels()
        })
    },
    onResetAction () {
      if (!this.selectedLevel) {
        return
      }
      this.$utils
        .callAxios(
          requests.getDefaultAccessAction.method,
          requests.getDefaultAccessAction.url,
          {
            params: {
              company: this.company,
              accessLevel: this.selectedLevel.accessLevel
            }
          }
        )
        .then(({ data }) => {
          EventBus.$emit('messageAlert', this.$t('reset successful'))
          this.selectedAction = data.accessAction.concat(primaryAccess)
        })
    },
    setDisabled (disabeldLinks) {
      for (const link of disabeldLinks) {
        link.disabled = this.user[link.key] === 'false'
      }
      return disabeldLinks
    }
  }
}
</script>
