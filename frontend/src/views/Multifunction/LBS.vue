<template>
  <div>
    <h2 class="page-title-bar"><i class="ico ico-multi"></i>{{$t('LBS Info')}}</h2>
    <anchors />
    <results />
  </div>
</template>

<script>
import EventBus from '@/plugins/eventBus.js'

import Anchors from './lbs/Anchors'
import Results from './lbs/Results'

export default {
  name: 'LBS',
  components: {
    Anchors,
    Results
  },
  data () {
    return {
    }
  },
  mounted () {
    // 상단 공통 팝업 & 자동완성기능 사용유무
    EventBus.$emit('enableSelectedStores', true)
  }
}

</script>
