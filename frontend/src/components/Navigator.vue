<template>
  <nav class="menuList">
    <sidebar-menu
      :menu="getActiveMenu"
      :collapsed="collapsed"
      :theme="selectedTheme"
      :show-one-child="true"
      @toggle-collapse="onToggleCollapse"
      @item-click="onItemClick"
    />
  </nav>
</template>

<script>
import commons from '@/plugins/commons'

export default {
  data () {
    return {
      productionType: process.env.VUE_APP_PRODUCTION_TYPE,
      user: null,
      activeMenu: [], // 활성화 메뉴 리스트
      cloudPages: {
        // Cloud 별도 화면 리스트
        'Gateway Info': true,
        'User Info': true,
        'User Mapping': true,
        'My Info': true,
        'Dashboard Config': true,
        'Label Info': true
      },
      // 전체 메뉴 리스트
      menu: [
        {
          href: '/',
          title: 'Overview', // 09.24 메뉴명 수정
          code: '1000',
          icon: {
            element: 'span',
            class: 'menu-overview'
          }
        },
        {
          href: '/Label/LabelInfo',
          title: 'Label Info',
          code: '2000',
          icon: {
            element: 'span',
            class: 'menu-label'
          },
          child: [
            {
              href: '/Label/LabelInfo',
              title: 'Label Info',
              code: '2100'
            },
            {
              href: '/Label/FailRecodes',
              title: 'Fail Records',
              code: '2200'
            },
            {
              href: '/Label/Firmware',
              title: 'Label Firmware', // 09.24 메뉴명 수정
              code: '2300'
            }
          ]
        },
        {
          href: '/Product/ProductInfo',
          title: 'Product Info',
          code: '3000',
          icon: {
            element: 'span',
            class: 'menu-product'
          },
          child: [
            {
              href: '/Product/ProductInfo',
              title: 'Product Info',
              code: '3100'
            },
            {
              href: '/Product/UpdateRecords',
              title: 'Update Records',
              code: '3200'
            }
          ]
        },
        {
          href: '/Gateway/GatewayInfo',
          title: 'Gateway Info', // 09.24 메뉴명 수정
          code: '4000',
          icon: {
            element: 'span',
            class: 'menu-gateway'
          },
          child: [
            {
              href: '/Gateway/GatewayInfo',
              title: 'Gateway Info', // 09.24 메뉴명 수정
              code: '4100'
            },
            {
              href: '/Gateway/GatewayFirmware',
              title: 'Gateway Firmware',
              code: '4200'
            }
          ]
        },
        {
          href: '/Template/TemplateInfo',
          title: 'Template Info',
          code: '5000',
          icon: {
            element: 'span',
            class: 'menu-template'
          },
          child: [
            {
              href: '/Template/TemplateInfo',
              title: 'Template Info',
              code: '5100'
            },
            {
              href: '/Template/TemplateGrouping',
              title: 'Template Grouping',
              code: '5200'
            },
            {
              href: '/Template/TemplateMapping',
              title: 'Template Mapping',
              code: '5300'
            }
          ]
        },
        {
          href: '/Multifunction/LBS',
          title: 'Multifunction Info',
          code: '6000',
          icon: {
            element: 'span',
            class: 'menu-multifunction'
          },
          child: [
            {
              href: '/Multifunction/LBS',
              title: 'LBS Info',
              code: '6100'
            },
            {
              href: '/Multifunction/LED',
              title: 'LED Info',
              code: '6200'
            }
          ]
        },
        {
          href: '/Store/StoreInfo',
          title: 'Store Info',
          code: '7000',
          icon: {
            element: 'span',
            class: 'menu-store'
          },
          child: [
            {
              href: '/Store/StoreInfo',
              title: 'Store Info',
              code: '7100'
            },
            {
              href: '/Store/WhiteList',
              title: 'Whitelist',
              code: '7200'
            }
          ]
        },
        {
          href: '/User/UserInfo',
          title: 'User Info',
          code: '8000',
          icon: {
            element: 'span',
            class: 'menu-user'
          },
          child: [
            {
              href: '/User/UserInfo',
              title: 'User Info',
              code: '8100'
            },
            {
              href: '/User/UserMapping',
              title: 'User Mapping',
              code: '8200'
            },
            {
              href: '/User/UserLevel',
              title: 'User Level',
              code: '8300'
            },
            {
              href: '/User/MyAccount',
              title: 'My Info', // 09.24 메뉴명 수정
              code: '8400'
            }
          ]
        },
        {
          href: '/System/DashboardConfig',
          title: 'System Config',
          code: '9000',
          icon: {
            element: 'span',
            class: 'menu-system'
          },
          child: [
            {
              href: '/System/DashboardConfig',
              title: 'Dashboard Config',
              code: '9100'
            },
            {
              href: '/System/ReportConfig',
              title: 'Report Config',
              code: '9200'
            },
            {
              href: '/System/AppConfig',
              title: 'App Config',
              code: '9300'
            },
            {
              href: '/System/SystemLicense',
              title: 'System License',
              code: '9400'
            }
          ]
        }
      ],
      collapsed: false,
      themes: [
        {
          name: 'Default theme',
          input: ''
        },
        {
          name: 'White theme',
          input: 'white-theme'
        }
      ],
      selectedTheme: '',
      isOnMobile: false
    }
  },
  mounted () {
    this.user = this.$store.state.auth.user
    this.onResize()
    window.addEventListener('resize', this.onResize)
  },
  computed: {
    getActiveMenu () {
      // Null check
      if (commons.isNull(this.user)) return []
      if (commons.isNull(this.$store.state.auth.user.accountInfo)) return []
      const accessMenu = this.$store.state.auth.user.accountInfo.accessMenu
      if (!commons.isValidStr(accessMenu)) return []

      // Disable links refer to the user information.
      let noAccMenu = ['2200', '4200']
      if (this.productionType === 'cloud') {
        noAccMenu.push('9300', '9400')
      }
      // disabled by the user information. ex: user.lbsEnable..etc
      let disabeldLinks = [
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
      ]

      if (commons.isNull(this.$store.state.auth.user.otaEnable)) {
        noAccMenu.push('2300')
      }

      disabeldLinks = this.setDisabled(disabeldLinks, accessMenu)
      noAccMenu = this.pushDisabledLinks(noAccMenu, disabeldLinks)

      const essentialMenu = ['1000', '8400']
      // Delete non-accessable items
      const menuList = JSON.parse(JSON.stringify(this.menu))
      let activeMenu = menuList.map(parent => {
        if (parent.child !== undefined) {
          // 하위요소 존재하면 사용자의 Access Menu와 대조하여 접근불가한 메뉴 삭제.
          parent.child = parent.child.filter(childItem => {
            // 하위 요소가 accessMenu에 포함되고 요소가 1차 테스트 대상인 경우만 남기고 나머지는 삭제.

            if (
              this.productionType === 'cloud' &&
              this.cloudPages[childItem.title]
            ) {
              childItem.href = childItem.href + 'Cloud'
            }

            const accessable =
              (accessMenu.includes(childItem.code) &&
                !noAccMenu.includes(childItem.code)) ||
              essentialMenu.includes(childItem.code)
            return accessable
          })
        }
        return parent
      })
      activeMenu = activeMenu.filter(
        parent =>
          (!commons.isNull(parent.child) && parent.child.length > 0) ||
          essentialMenu.includes(parent.code)
      )
      // Change default url of a parent link
      // in case of the existing default url is disabled by user's configuration.
      this.setDefaultParentUrl(activeMenu)
      this.setDisabledLinksParentUrl(activeMenu, disabeldLinks)
      return activeMenu
    }
  },
  methods: {
    onToggleCollapse (collapsed) {
      this.collapsed = collapsed
    },
    onItemClick (event, item, node) {},
    onResize () {
      if (window.innerWidth <= 767) {
        this.isOnMobile = true
        this.collapsed = true
      } else {
        this.isOnMobile = false
        this.collapsed = false
      }
    },
    includesAny (arr, arrToFind) {
      if (!commons.isValidStr(arr)) return false
      for (const el of arr) {
        for (const elToFind of arrToFind) {
          if (el === elToFind) return true
        }
      }
      return false
    },
    setDisabled (disabeldLinks, accessMenu) {
      for (const link of disabeldLinks) {
        link.disabled = this.user[link.key] === 'false'
      }
      return disabeldLinks
    },
    pushDisabledLinks (noAccMenu, disabeldLinks) {
      for (const link of disabeldLinks) {
        if (link.disabled === true) {
          noAccMenu.push(...link.codeList)
        }
      }
      return noAccMenu
    },
    setDefaultParentUrl (activeMenu) {
      for (const item of activeMenu) {
        if (commons.isNull(item)) continue
        if (Number(item.code.substring(1, 4)) === 0) {
          // 대분류인 경우. url을 설정해줘야한다.
          if (commons.isNull(item.child) || !commons.notEmpty(item.child)) {
            continue
          }
          item.href = commons.peekFirst(item.child).href
        }
      }
    },
    setDisabledLinksParentUrl (ActiveMenu, disabeldLinks) {
      for (const link of disabeldLinks) {
        if (link.disabled) {
          const parent = ActiveMenu.find(am => am.code === link.parentCode)
          if (commons.isNull(parent)) continue
          const firstChild = commons.peekFirst(parent.child)
          if (commons.isNull(firstChild)) continue
          parent.href = firstChild.href
        }
      }
    }
  }
}
</script>

<style>
.v-sidebar-menu {
  position: relative;
  background: transparent;
}
.v-sidebar-menu .vsm--toggle-btn {
  display: none;
}
.v-sidebar-menu .vsm--link {
  padding: 0 30px;
  font-size: 15px;
  color: #adb7bf;
  line-height: 65px;
  outline: none;
}
.v-sidebar-menu .vsm--link_exact-active,
.v-sidebar-menu .vsm--link_active {
  color: #fff;
  font-weight: 400;
}
.v-sidebar-menu .vsm--link_level-1.vsm--link_exact-active,
.v-sidebar-menu .vsm--link_level-1.vsm--link_active {
  box-shadow: 7px 0px 0px 0px #fff inset;
  background: #697a8a;
}
.v-sidebar-menu.vsm_expanded .vsm--item_open .vsm--link_level-1 {
  background: transparent;
}
.v-sidebar-menu.vsm_expanded
  .vsm--item_open
  .vsm--link_level-1.vsm--link_active {
  background: #697a8a;
}
.v-sidebar-menu .vsm--dropdown .vsm--list {
  padding: 0;
  background: transparent;
}
.v-sidebar-menu .vsm--dropdown .vsm--list .vsm--link_level-2 {
  font-weight: 200;
  padding-left: 62px;
  line-height: 55px;
}
.v-sidebar-menu .vsm--dropdown .vsm--list .vsm--link_level-2.vsm--link_active {
  font-weight: 400;
}

/* 아이콘 : 공통 */
.v-sidebar-menu .vsm--link_level-1 .vsm--icon {
  display: inline-block;
  width: 22px;
  height: 22px;
  background-repeat: no-repeat;
  background-position: top left;
  background-size: cover;
  background-color: transparent;
}
.v-sidebar-menu .vsm--link_level-1 .vsm--icon.menu-overview {
  background-image: url(../assets/img/nav-ico01.png);
}
.v-sidebar-menu .vsm--link_level-1 .vsm--icon.menu-label {
  background-image: url(../assets/img/nav-ico02.png);
}
.v-sidebar-menu .vsm--link_level-1 .vsm--icon.menu-product {
  background-image: url(../assets/img/nav-ico03.png);
}
.v-sidebar-menu .vsm--link_level-1 .vsm--icon.menu-store {
  background-image: url(../assets/img/nav-ico04.png);
}
.v-sidebar-menu .vsm--link_level-1 .vsm--icon.menu-template {
  background-image: url(../assets/img/nav-ico05.png);
}
.v-sidebar-menu .vsm--link_level-1 .vsm--icon.menu-multifunction {
  background-image: url(../assets/img/nav-ico06.png);
}
.v-sidebar-menu .vsm--link_level-1 .vsm--icon.menu-user {
  background-image: url(../assets/img/nav-ico07.png);
}
.v-sidebar-menu .vsm--link_level-1 .vsm--icon.menu-system {
  background-image: url(../assets/img/nav-ico08.png);
}
/* 09.27 추가 */
.v-sidebar-menu .vsm--link_level-1 .vsm--icon.menu-gateway {
  background-image: url(../assets/img/nav-ico09.png);
}
/* //09.27 수정 */

.v-sidebar-menu .vsm--link_level-1.vsm--link_active .vsm--icon {
  background-position: bottom left;
}
.v-sidebar-menu.vsm_expanded .vsm--item_open .vsm--link_level-1 .vsm--icon {
  background-color: transparent;
  background-position: bottom left;
}

.v-sidebar-menu .vsm--arrow {
  display: flex;
  justify-content: center;
  align-items: center;
}
.v-sidebar-menu .vsm--arrow:after {
  content: '';
  display: inline-block;
  width: 10px;
  height: 10px;
  border: solid #adb7bf;
  border-width: 0 1px 1px 0;
  transform: rotate(45deg);
}
.v-sidebar-menu .vsm--arrow_open {
  transform: rotate(180deg);
}
.v-sidebar-menu .vsm--arrow_open:after {
  border-color: #fff;
}
</style>
