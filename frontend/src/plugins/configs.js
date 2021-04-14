// Apllication Type에 따라 불러온 환경변수를 이용해서 API 주소를 설정한다.
// 자세한 내용은 /README.md 참고.
import codes from '@/plugins/codes'

const config = {
  ApiUrl: process.env.VUE_APP_AIMS_SERVER_URL,
  ApiKey: process.env.VUE_APP_API_KEY,
  Release: process.env.VUE_APP_RELEASE
}
console.info('Default config' + JSON.stringify(config))

const getRuntimeConfig = async (productionType, baseUrl) => {
  let runtimeConfig = ''
  switch (productionType) {
    case 'local-server':
      runtimeConfig = await fetch(baseUrl + 'properties_local.json')
      break
    case 'test-server':
      runtimeConfig = await fetch(baseUrl + 'properties_test.json')
      break
    case 'cloud':
      runtimeConfig = await fetch(baseUrl + 'properties_cloud.json')
      break
    default: runtimeConfig = await fetch(baseUrl + 'properties.json')
      break
  }
  return await runtimeConfig.json()
}

const getServerIp = (productionType, json) => {
  // Server 설치버전에서 사용자가 localhost 주소로 접속한 경우 API서버 localhost로 덮어씌운다.
  if (location.hostname === codes.LOCALHOST && productionType === 'server') return codes.LOCALHOST
  return json.serverIp || codes.LOCALHOST
}

const init = async () => {
  const productionType = process.env.VUE_APP_PRODUCTION_TYPE
  const baseUrl = process.env.BASE_URL
  if (process.env.VUE_APP_USING_PROPERTIES) {
    return getRuntimeConfig(productionType, baseUrl).then(function (json) {
      // Cloud로 로그인 하면 localhost로 변경후 프록시 적용
      // if (productionType === 'cloud') {
      //   json.protocolType = location.protocol.replace(':', '')
      //   json.serverIp = location.hostname
      //   json.serverPort = location.port
      // }
      console.debug('Runtime config: ' + JSON.stringify(json))
      const protocol = json.protocolType || 'http'
      const serverIp = getServerIp(productionType, json)
      const serverPort = json.serverPort || '9001'
      const serverDomain = json.serverDomain || '/'
      const ServerAddress = `${protocol}://${serverIp}:${serverPort}`
      const newConfig = {
        ApiUrl: ServerAddress + (serverDomain || ''),
        ApiKey: json.apiKey,
        Release: json.Dashboard_Release
      }
      Object.assign(config, newConfig)
      return newConfig
    })
  }
}

const appliedConfig = init()
config.appliedConfig = appliedConfig
console.info('Set config' + JSON.stringify(appliedConfig))

export default config
