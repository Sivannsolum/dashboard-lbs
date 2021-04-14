# Introduction 
SoluM AIMS UI 개발
- Framework: Vue.js
테스트: Jest
차트: Chart.js
Tool chain: Vue-cli
상태관리: Vuex
CSR: Vue-Router
디자인 컴포넌트: Vuex

# Build and Test
## 필요 소프트웨어
- Git: https://git-scm.com/downloads 에서 다운로드 및 설치
- NPM: https://nodejs.org/ko/ 에서 12.18.2 LTS 버전 다운로드 및 설치
- Vue.js: 아래 명령 실행
```
npm install vue
```
## 권장 소프트웨어
- VSCode: 소스 관리등이 한번에 되어 편합니다.
- 권장 VSCode plugins: Vetur - Vue snippets 지원

## 소스 Clone 방법
- https://dev.azure.com/dtonic/_git/AIMS-ui 여기로 이동
- Repos > Clone 버튼 클릭
- Https 주소 복사 
```
https://dtonic@dev.azure.com/dtonic/AIMS-ui/_git/AIMS-ui
```
- Generate Git Credentials 버튼 클릭
- Password 복사
- 위의 2가지를 조합하여 url 생성
```
https://[Password]@dev.azure.com/dtonic/AIMS-ui/_git/AIMS-ui
```
- 조합된 주소로 git clone 실행
```
git clone https://[Password]@dev.azure.com/dtonic/AIMS-ui/_git/AIMS-ui
```
## 소스 실행
- Dependency 설치 - 최초 혹은 package가 추가되었을 경우 실행
```
npm install
```
- 개발환경 실행
```
npm run serve
```
- Revision 업데이트, /DashboardNew, /Dashboard 번들 생성(설치용)
```
npm run build-standalone
```

## Docker test
- NginX로 실행
```
.\run-nginx.cmd
```
- Tomcat으로 실행
```
.\run-tomcat.cmd
```
## 단위 테스트
### 라이브러리
- [Jest](https://jestjs.io/)
- [vue-test-utils](https://vue-test-utils.vuejs.org/)

### 테스트 작성방법
1. /src/tests/unit 폴더에 testName.spec.js 형식으로 테스트를 작성한다.
2. 아래 명령어로 테스트를 수행한다.
```
npm t
```

## 테스트 환경설정
package.json의 "jest" 항목에서 설정을 변경한다. jest.config.js에서도 변경가능.
 
# Edit
## Menu 추가
- /frontend/src/views 에 Page 추가
  - ex) about.vue
```xml
<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>
```
- /frontend/src/router/index.js의 Main아래에 위치 지정
  - path는 주소줄 표시
  - name은 페이지 이름
  - component는 Vue file 위치, @는 /frontend/src를 표현
```js
const routes = [
  {
    path: '/',
    component: () => import('@/views/Main'),
    children: [
      {
        {
          path: '/about',
          name: 'About',
          component: () => import('@/views/About')
        }
      }
    ]
```
- /frontend/src/components/Navigator.vue에 메뉴 생성 - 이부분은 메뉴를 통해서 접근 할 경우에만 지정
  - icon은 표시 아이콘 디자인 아이콘을 넣을 경우 별도로 협의 필요
  - name은 위에 route에 등록한 이름
```js
<script>
export default {
  data: () => ({
    menus: [
      { icon: 'mdi-home', name: 'Dashboard', path: '/' },
      { icon: 'mdi-home', name: 'About' }
    ]
  }),
```
## Resource 추가
- CSS를 사용 할 경우 /frontend/src/public에 추가한 후 index.html에 link 추가 필요 
혹은 main.js에 모듈로 import하면 된다.
- SCSS등 사용 할 경우에는 별도 협의 필요

## Style Guide
가능하면 [Vue.js 공식문서의 Style 가이드](https://vuejs.org/v2/style-guide/)에 따르도록 작성됐다.
규칙의 우선순위는 A~D가 있는데, 유지보수성을 위해 B까지는 지킬것을 권장.

# Contribute
- git commit: 변경 사항을 local에 저장. 커밋시 변경 내용 기입 필요.
```
git commit -m "이거 바꿈"
```
- git push: 변경 사항을 서버로 보냄.
```
git push
```

# 구동환경에 따른 설정 변경
**Vue-cli**의 mode 설정에 따라 바뀌는 환경설정파일을 /src/plugins/config.js에서 읽어서 

API endpoint 등을 환경에 맞게 변경함.

ex. vue-cli-service serve --mode server 명령어로 서비스한다면, server 모드로
 구동되는것이고 application이 .env.server 파일의 환경변수를 읽어서 적용할것.

(public한 자원이므로 민감한 정보를 기재하면 안됨)

# 다국어

본 애플리케이션의 다국어는 [i18n을](https://www.npmjs.com/package/i18n) 사용하고 있다.

## oldDashboard의 다국어 파일 newDashboard용으로 변환방법
다국어 파일을 입수했는데 아래 형식이라면 oldDashboard에서 사용하던 다국어 파일의 형식이다. 현재 번역 파일과 다르므로 형식을 변환해서 번역 파일에 덮어씌워야 한다.
```jsx
angular.module('gettext').run(['gettextCatalog', function(gettextCatalog) {
    /* Korean */
    gettextCatalog.setStrings('ko_KR', {

```

> 번역파일 경로: /frontend/src/locales/...

1. 다국어 파일을 **/frontend/wiki/multilanguage** 경로에 위치하게 한다.
2. CMD에서 **/frontend/wiki/multilanguage** 경로로 이동한뒤, 아래 명령어로 스크립트를 실행한다. 
```
node multilanguageParser.js
```
4. 프로그램의 지시에 따르면 변환된 파일들(en, ko, jp, zh, etc..)이 스크립트 경로에 생성된다.

## 다국어 파일(ko, en, etc...)중복되는 key값 제거 
1. 다국어 파일을 **/frontend/wiki/multilanguage** 경로에 위치하게 한다.
2. CMD에서 **/frontend/wiki/multilanguage** 경로로 이동한뒤, 아래 명령어로 스크립트를 실행한다.
```
node distinctObject.js
```

## 모든 다국어 파일의 key값 변경
1. 다국어 파일을 **/frontend/wiki/multilanguage** 경로에 위치하게 한다.
2. correctionList.json 를 **/frontend/wiki/multilanguage** 경로에 위치하게 한다.
> correctionList.json의 예시는 **/frontend/wiki/multilanguage**에 있으므로 참고.
2. CMD에서 **/frontend/wiki/multilanguage** 경로로 이동한뒤, 아래 명령어로 스크립트를 실행한다.
```
node corrector.js
```
# Mixins
컴포넌트간 공통으로 사용해야하는 기능들을 Mixin으로 처리했다.
자세한 내용은 [공식문서](https://kr.vuejs.org/v2/guide/mixins.html)를 참고.

각 Mixin의 자세한 설명은 해당 파일 최상단에 주석으로 기술해놨다.

현재 작성한 mixins
- FileUploader: 파일을 업로드하는 모달창을 띄우고자 하는 컴포넌트에서 사용.
- MsgBoxParent: 메시지 모달을 띄우고자 하는 컴포넌트에서 사용.
- SelectedStoreWatcher: Vuex의 selectedStore이 필요하고 해당값 변경시 특정동작(화면 리로드) 등이 필요한 경우 사용.
- StorePopup: StoreInfo - StoreAdd, StoreEdit이 공유하는 기능을 담음.

Mixin 폴더 경로: /src/mixins 

# Utility modules
경로: /src/plugins/
1. codes: 앱 전체에서 공통으로 사용하는 상수 모음.
2. commons: 객체, 배열 조작, 타입 점검, base64 decoding, pagenation 관련 함수 등 모음
3. configs: 애플리케이션의 환경설정을 수행. API 주소 설정, 환경변수 설정 등.
해당 모듈에서 env -> properties를 구동환경에 맞게 실행.
4. eventBus: 컴포넌트 트리 구조에서 거리가 먼 컴포넌트 간의 통신(이벤트 기반)에 사용.
5. exporter: 각 화면의 export 기능에 필요한 함수 모음.
6. healthCheck: API 서버의 세션을 점검하는 모듈.
7. passwordValidator: User관련된 페이지 (MyAccount, UserInfo 등)에서 비밀번호와 이메일 등
사용자정보의 유효성을 검증하는 모듈
8. sessionStorageManager: session storage를 간단히 사용하기 위한 facade.
9. utils: API 호출에 관련된 공통기능을 담음. 

# Components
경로: /src/components

Views의 페이지들에서 import해서 사용하는 컴포넌트들. Navigation, Modal 등이 있다.

# Views
경로: /src/views

Vue-router로 URL마다 표출할 페이지들의 모음. 페이지이름/modal 이런 식으로 하위 폴더에 모달들이 모여있기도하다.

# 로그인, MSAL
로그인 요청은 다른 API 요청과 달리 /src/auth/auth.service에서 한다.

클라우드 버전의 경우 로그인에 MS의 SSO서버를 사용한다. 구조는 OAuth2 flow에 대해서 조사하면 알 수 있다. 

본 프로젝트에서는 /src/adLogin 폴더 하위에 MSAL인증과 관련된 코드가 위치한다.
서버 버전은 세션기반의 로그인을 하고 있고, 클라우드 버전은 JWT기반(OAuth2)이므로 
로그인 방식이 다르다.

이 다른 부분을 /src/views/Login.vue 파일에서 분기처리를 한다. 코드를 읽어보면 알 수 있겠지만
onLogin method와 mounted hook을 참고하면 로그인 과정이 이해가 될 것임.

## 테스트 계정 정보
- esldashboard@gmail.com / SoluM@2020
- esldashboard@outlook.com / SoluM@2020

+ 계정 추가 가능

Client-side MSAL 구현 참고자료
- [MSAL documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-create-new-tenant)
- [MSAL use case: JavaScript SPA](https://docs.microsoft.com/en-us/azure/active-directory/develop/scenario-spa-overview)
- [Github](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser)
- [MSAL use case: Java](https://github.com/AzureAD/microsoft-authentication-library-for-java)
- [MSAL-core Github repo](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-core/src/UserAgentApplication.ts)

# Routing, 로그인 유지
애플리케이션의 라우팅은 /src/router/index.js 에서 관리한다. 
관련 내용은 Vue-router의 [공식문서](https://router.vuejs.org/kr/)를 확인하면 알 수 있다.
Router에서 하는 일은 기본적으로 사용자의 URL 혹은 popstate(window.popstate)변경에 반응해서 화면의 Vue component를 교체해주는것인데
이 때 본 애플리케이션은 현재 가지고 있는 sessoionId를 API에 요청해서 session이 유효한지 확인하고, 사용자가 권한이 없는 페이지로 이동하는지도 확인한다.
만약 세션이 유효하지 않으면 프론트엔드에서 가지고있는 사용자 정보를 초기화 후 로그인 페이지로 보내고, 사용자가 권한이 없는 경우에는 경고창을 띄운다.
권한점검의 경우는 master 브랜치에만 구현이 되어있다.

# Vuex
두 개의 모듈을 사용한다. 
1. /src/store/auth.module: 사용자정보와 관련된 정보를 관리하는 모듈.
2. /src/store/dataStore: 그 외 현재 애플리케이션 상태를 관리하는 모듈.
그러나 각 module에 namespace 속성을 true로 설정해놓았기 때문에 기본 설정대로 global scope에 state가 노출되지는 않는다.
그러므로 상태에 접근할때는 Vue컴포넌트 안에서 아래와 같이 상태에 접근한다.
```js
this.$store.state.모듈이름.상태이름 
```
Vuex는 Getters, Mutations, Actions를 규칙에 맞게 사용하지 않으면 의도한 대로 동작하지 않으므로 
반드시 [공식문서](https://vuex.vuejs.org/guide/modules.html)를 확인하고 작업해야한다.



# 그 외 참고사항
1. UI가 기획이 변경되었는데 직접 수정해야 하는 경우, 보통 Vuex설정으로 간단히 구현 가능한 경우가 있으므로 [공식문서](https://vuetifyjs.com/en/)를 찾아보고 없으면 직접 구현하거나 퍼블리셔분께 의뢰.