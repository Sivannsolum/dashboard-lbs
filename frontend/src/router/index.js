import Vue from 'vue'
import VueRouter from 'vue-router'
import codes from '@/plugins/codes'
import store from '@/store'
import { cloudLogout } from '@/adLogin/authPopup'
import { checkApiSession } from '@/plugins/healthCheck'
import {
  clearTempObjs,
  setTempObj,
  getTempObj
} from '@/plugins/sessionStorageManager'
import EventBus from '@/plugins/eventBus.js'
// import commons from '@/plugins/commons'
import lbsRoutes from '@/lbs/router/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/Main'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '/',
        name: 'Overview',
        component: () => import('@/views/Overview')
      },
      {
        path: '/Label/LabelInfo',
        name: 'Label Info',
        component: () => import('@/views/Label/LabelInfo')
      },
      {
        path: '/Label/LabelInfoCloud',
        name: 'Label Info Cloud',
        component: () => import('@/views/Label/LabelInfoCloud')
      },
      {
        path: '/Label/FailRecodes',
        name: 'Fail Recodes',
        component: () => import('@/views/Label/FailRecords')
      },
      {
        path: '/Label/Firmware',
        name: 'Firmware',
        component: () => import('@/views/Label/Firmware')
      },
      {
        path: '/Product/ProductInfo',
        name: 'Product Info',
        component: () => import('@/views/Product/ProductList')
      },
      {
        path: '/Product/UpdateRecords',
        name: 'Update Records',
        component: () => import('@/views/Product/UpdateRecords')
      },
      {
        path: '/Gateway/GatewayInfo',
        name: 'Gateway Info',
        component: () => import('@/views/Gateway/GatewayInfo')
      },
      {
        path: '/Gateway/GatewayInfoCloud',
        name: 'Gateway Info Cloud',
        component: () => import('@/views/Gateway/GatewayInfoCloud')
      },
      {
        path: '/Gateway/GatewayFirmware',
        name: 'Gateway Firmware',
        component: () => import('@/views/Gateway/GatewayFirmware')
      },
      {
        path: '/Template/TemplateInfo',
        name: 'Template Info',
        component: () => import('@/views/Template/TemplateInfo')
      },
      {
        path: '/Template/TemplateGrouping',
        name: 'Template Grouping',
        component: () => import('@/views/Template/TemplateGrouping')
      },
      {
        path: '/Template/TemplateMapping',
        name: 'Template Mapping',
        component: () => import('@/views/Template/TemplateMapping')
      },
      {
        path: '/Multifunction/LBS',
        name: 'LBS Info',
        component: () => import('@/views/Multifunction/LBS')
      },
      {
        path: '/Multifunction/LED',
        name: 'LED Info',
        component: () => import('@/views/Multifunction/LED')
      },
      {
        path: '/Store/StoreInfo',
        name: 'Store Info',
        component: () => import('@/views/Store/StoreInfo')
      },
      {
        path: '/Store/WhiteList',
        name: 'White List',
        component: () => import('@/views/Store/WhiteList')
      },
      {
        path: '/User/UserInfo',
        name: 'User Info',
        component: () => import('@/views/User/UserInfo')
      },
      {
        path: '/User/UserInfoCloud',
        name: 'User Info Cloud',
        component: () => import('@/views/User/UserInfoCloud')
      },
      {
        path: '/User/UserMapping',
        name: 'User Mapping',
        component: () => import('@/views/User/UserMapping')
      },
      {
        path: '/User/UserMappingCloud',
        name: 'User Mapping Cloud',
        component: () => import('@/views/User/UserMappingCloud')
      },
      {
        path: '/User/UserLevel',
        name: 'User Level',
        component: () => import('@/views/User/UserLevel')
      },
      {
        path: '/User/MyAccount',
        name: 'My Account',
        component: () => import('@/views/User/MyAccount')
      },
      {
        path: '/User/MyAccountCloud',
        name: 'My Account Cloud',
        component: () => import('@/views/User/MyAccountCloud')
      },
      {
        path: '/System/DashboardConfig',
        name: 'Dashboard Config',
        component: () => import('@/views/System/DashboardConfig')
      },
      {
        path: '/System/DashboardConfigCloud',
        name: 'Dashboard Config Cloud',
        component: () => import('@/views/System/DashboardConfigCloud')
      },
      {
        path: '/System/ReportConfig',
        name: 'Report Config',
        component: () => import('@/views/System/ReportConfig')
      },
      {
        path: '/System/AppConfig',
        name: 'App Config',
        component: () => import('@/views/System/AppConfig')
      },
      {
        path: '/System/SystemLicense',
        name: 'System License',
        component: () => import('@/views/System/SystemLicense')
      }
    ]
  },
  // LBS Routing
  lbsRoutes,
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const cloudMode = process.env.VUE_APP_PRODUCTION_TYPE === 'cloud'
const cloudPages = {
  'Gateway Info': true,
  'User Info': true,
  'User Mapping': true,
  'My Account': true,
  'Dashboard Config': true,
  'Label Info': true
}

let timeout = null

router.beforeEach(async (to, from, next) => {
  // Cloud 페이지가 있는 경우 Cloud 페이지로 이동하는 함수.
  const redirect = async () => {
    // 클라우드 버전이 따로 존재하는 page로 이동하는경우
    if (cloudMode && cloudPages[to.name] === true) {
      next({ name: `${to.name} Cloud`, params: to.params })
    } else {
      next()
    }
    // 접속한 유저가 이동하려는 페이지에 접근권한이 있는지 점검
    const isAccessablePage = await store.dispatch('isAccessablePage', to.name)
    if (isAccessablePage) {
      // if (isAccessablePage || !commons.isNull(store.state.auth.user.otaEnable)) {
      // 접근권한 있는 경우
      next()
    } else if (to.path.substring(0, 5) === '/Lbs/') { // Condition for LBS module
      next()
    } else {
      // 접근권한 없는 경우
      const prevPage = getTempObj(codes.prevPathName)
      if (prevPage) {
        next(prevPage)
      } else {
        next('/')
      }
      if (!timeout) {
        timeout = setTimeout(() => {
          EventBus.$emit('messageAlert', 'unauthorized to access URL')
        }, 800)
      }
    }
  }
  // 권한 점검 수행
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 권한이 필요한 경로인 경우.
    // 로그인 여부 확인
    if (!store.state.auth.user) {
      next('/login')
    }
    const apiSessionConnected = await checkApiSession()
    if (apiSessionConnected) {
      // 로그인 되어있고, 세션 연결된 경우.
      redirect()
    } else {
      // 세션 연결되지 않은경우이므로 로그아웃
      if (cloudMode) {
        // 로그아웃: Cloud version 일 경우
        if (store.getters['auth/GET_USER'] && store.state.auth.tokenAPI) {
          const uniqueId = store.state.auth.tokenAPI.uniqueId
          await store.dispatch('auth/logout').then(res => {
            store.dispatch('dataStore/CLEAN')
            cloudLogout(uniqueId)
          })
        } else {
          next('/login')
        }
      } else {
        // 로그아웃:Server version 일 경우
        await store.dispatch('auth/logout')
        store.dispatch('dataStore/CLEAN')
        next('/login')
      }
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    // 권한 필요없는 경로인 경우.
    if (localStorage.getItem('jwt') == null) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
  if (from.fullPath !== '/') clearTempObjs()
})

router.afterEach(() => {
  setTempObj(codes.prevPathName, window.location.pathname)
})

export default router
