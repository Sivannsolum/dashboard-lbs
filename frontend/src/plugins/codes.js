// 상수, 코드 모음.
'use strict'

const methods = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  PATCH: 'patch',
  DELETE: 'delete'
}

const codes = {
  prevPathName: 'prevPathName',
  activation: {
    ENABLED: 'Enabled',
    DISABLED: 'Disabled'
  },
  configKeys: {
    whiteListEnable: 'whiteListEnable',
    lbsEnabled: 'lbsEnabled',
    batteryMode: 'batteryMode',
    location: 'location',
    updatePageUnlock: 'updatePageUnlock'
  },
  msg: {
    areaSelection: {
      addCountry: 'Add Country.',
      addRegion: 'Add Region.',
      addCity: 'Add City.'
    }
  },
  productionTypes: {
    CLOUD: 'cloud',
    LOCAL: 'local-server',
    SERVER: 'server'
  },
  requests: {
    // Label Info
    getAlertSetting: {
      method: methods.GET,
      url: '/api/common/config/alertsetting'
    },
    getSummaryAction: {
      method: methods.GET,
      url: '/api/common/summary'
    },
    getProblemAction: {
      method: methods.GET,
      url: '/api/common/summary/problem'
    },
    unassignLabel: {
      method: methods.POST,
      url: '/api/common/labels/unlink'
    },
    getScheduleList: {
      method: methods.GET,
      url: '/api/common/labels/schedule'
    },
    getLabelHistoryList: {
      method: methods.GET,
      url: '/api/common/labels/history'
    },
    // Product Info
    getArticles: {
      method: methods.GET,
      url: '/api/common/articles'
    },
    searchArticles: {
      method: methods.GET,
      url: '/api/common/articles'
    },
    addArticle: {
      method: methods.POST,
      url: '/api/common/articles'
    },
    deleteArticle: {
      method: methods.DELETE,
      url: '/api/common/articles'
    },
    // Product Info, Blink LED
    getLedPatterns: {
      method: methods.GET,
      url: '/api/common/functions/led/pattern'
    },
    saveBlinkLed: {
      method: methods.PUT,
      url: '/api/common/articles/led'
    },
    // Product Info, Add Product
    addArticles: {
      method: methods.POST,
      url: '/api/common/articles'
    },
    getArticleDataKeyList: {
      method: methods.GET,
      url: '/api/common/articles/data'
    },
    // Product Info, Product Detail
    updateArticle: {
      method: methods.PUT,
      url: '/api/common/articles'
    },
    assignArticles: {
      method: methods.POST,
      url: '/api/common/labels/link'
    },
    unassignArticles: {
      method: methods.POST,
      url: '/api/common/labels/unlink'
    },
    getAnArticle: {
      method: methods.GET,
      url: '/api/common/config/articleField'
    },
    // Update Records
    getRecords: {
      method: methods.GET,
      url: '/api/common/articles/history'
    },
    // Store Info
    getStores: {
      method: methods.GET,
      url: '/api/common/store'
    },
    deleteStores: {
      method: methods.DELETE,
      url: '/api/common/store'
    },
    getTimezones: {
      method: methods.GET,
      url: '/api/common/store/timezone'
    },
    getAreas: {
      method: methods.GET,
      url: '/api/common/area'
    },
    getUserDetails: {
      method: methods.GET,
      url: '/api/common/account/detail'
    },
    // Store Info: Store Setting, Store Add
    getStoreInfo: {
      method: methods.GET,
      url: '/api/common/store/summary'
    },
    addStore: {
      method: methods.POST,
      url: '/api/common/store'
    },
    editStore: {
      method: methods.PUT,
      url: '/api/common/store'
    },
    addAreaInformation: {
      method: methods.POST,
      url: '/api/common/area'
    },
    setLbsConfiguration: {
      method: methods.POST,
      url: '/api/common/lbs/config'
    },
    getCloudStores: {
      method: methods.GET,
      url: '/api/common/store'
    },
    // Whitelist
    getFunctionSetting: {
      method: methods.GET,
      url: '/api/common/whiteList/info'
    },
    updateWhitelist: {
      method: methods.PUT,
      url: '/api/common/whiteList'
    },
    getWhitelist: {
      method: methods.GET,
      url: '/api/common/whiteList/list'
    },
    // Gateway Info
    getGateways: {
      method: methods.GET,
      url: '/api/common/gateway'
    },
    getGatewayDetail: {
      method: methods.GET,
      url: '/api/common/gateway/detail'
    },
    scanGateway: {
      method: methods.GET,
      url: '/api/common/scangateway'
    },
    addGateway: {
      method: methods.POST,
      url: '/api/common/gateway'
    },
    deleteGateway: {
      method: methods.DELETE,
      url: '/api/common/gateway'
    },
    // Gateway Info Cloud
    getFloatingGateway: {
      method: methods.GET,
      url: '/api/common/gateway/floating'
    },
    rebootGateway: {
      method: methods.PATCH,
      url: '/api/common/gateway'
    },
    // Template Info
    getTemplates: {
      method: methods.GET,
      url: '/api/common/templates'
    },
    searchTemplates: {
      method: methods.GET,
      url: '/api/common/templates/name'
    },
    addTemplate: {
      method: methods.POST,
      url: '/api/common/templates'
    },
    deleteTemplates: {
      method: methods.DELETE,
      url: '/api/common/templates'
    },
    // Template Grouping
    getGroups: {
      method: methods.GET,
      url: '/api/common/templates/mapping/group'
    },
    getGroupDetail: {
      method: methods.GET,
      url: '/api/common/templates/mapping/group/detail'
    },
    getTagTypes: {
      method: methods.GET,
      url: '/api/common/templates/data'
    },
    deleteGroups: {
      method: methods.DELETE,
      url: '/api/common/templates/mapping/group'
    },
    // Template Groping: New Template Grouping
    addGroup: {
      method: methods.POST,
      url: '/api/common/templates/mapping/group'
    },
    getTemplatesByTag: {
      method: methods.GET,
      url: '/api/common/templates'
    },
    // LBS Info: Anchors
    getAnchors: {
      method: methods.GET,
      url: '/api/common/lbs/anchor/config'
    },
    deleteAnchors: {
      method: methods.DELETE,
      url: '/api/common/lbs/anchor/config'
    },
    getStoreSummary: {
      method: methods.GET,
      url: '/api/common/store/summary'
    },
    getResults: {
      method: methods.GET,
      url: '/api/common/lbs/result'
    },
    deleteLbsConfiguration: {
      method: methods.DELETE,
      url: '/api/common/lbs/config'
    },
    // User Info
    getUsers: {
      method: methods.GET,
      url: '/api/common/account'
    },
    editUser: {
      method: methods.PUT,
      url: '/api/common/account'
    },
    deleteUser: {
      method: methods.DELETE,
      url: '/api/common/account'
    },
    getUserAccessLevel: {
      method: methods.GET,
      url: '/api/common/accessLevel'
    },
    getUserDetail: {
      method: methods.GET,
      url: '/api/common/account/detail'
    },
    // User Info Cloud
    getUsersCloud: {
      method: methods.GET,
      url: '/api/common/account/b2c'
    },
    editUserCloud: {
      method: 'put',
      url: '/api/common/account/b2c/approval'
    },
    updateUserInfoCloud: {
      method: methods.PUT,
      url: '/api/common/account/info'
    },
    // User Info: My Info
    getUser: {
      method: methods.GET,
      url: '/api/common/account/detail'
    },
    updateUserInfo: {
      method: methods.PUT,
      url: '/api/common/account'
    },
    updatePassword: {
      method: methods.PUT,
      url: '/api/common/account/password'
    },
    getCompanyList: {
      method: methods.GET,
      url: '/api/common/company'
    }
  },
  errors: {
    templateNotFound: {
      code: '404',
      status: 404,
      msg: 'It can\'t find template with the value'
    },
    labelNotWhitelisted: {
      code: null,
      status: null,
      msg: 'label is not in the whiteList'
    },
    scheduleNotFound: {
      msg: 'Schedule information not found.'
    },
    passwordExpired: {
      msg: 'Your password was expired.'
    }
  },
  lbsSetting: {
    LBS_ENABLED_DEFAULT_SETTING: {
      enable: true,
      startTime: 1200,
      endTime: 16,
      gatheringEndTime: 1800,
      txPower: 2,
      txInterval: 30,
      threshold: 75
    },
    LBS_DISABLED_DEFAULT_SETTING: {
      enable: false
    }
  },
  LOCALHOST: 'localhost',
  ROW_CLASS: 'row-class',
  statusCode: {
    CONNCTED: Symbol.for('CONNCTED'),
    DISCONNCTED: Symbol.for('DISCONNCTED')
  },
  networkStatusColor: new Map([
    ['CONNECTED', 'bg-stable'],
    ['NOT_READY', 'bg-caution'],
    ['DISCONNECTED', 'bg-danger']
  ]),
  lbsSearchType: {
    getByStore: 'getByStore',
    getByLabelId: 'getByLabel',
    getByPosition: 'getByPosition',
    getByArticleId: 'getByArticleId',
    getByArticleName: 'getByArticleName'
  },
  whitelistFetchType: {
    none: 'NONE',
    add: 'ADD',
    delete: 'DELETE'
  },
  assignType: {
    assign: 'Assign',
    unassign: 'Unassign'
  },
  ACTIVE_PAGE: 'activePage',
  labelStatus: {
    PROCESSING: 'PROCESSING',
    SUCCESS: 'SUCCESS',
    TIMEOUT: 'TIMEOUT',
    UNASSIGNED: 'UNASSIGNED',
    UNASSIGNING: 'UNASSIGNING'
  },
  EXPORT_SIZE: 1000000000,
  TEMP: 'TEMP'
}

export default codes
