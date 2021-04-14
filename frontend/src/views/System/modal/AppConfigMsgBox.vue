<template>
  <v-dialog
    v-model="msgModalVisible"
    @click:outside="closeAppConfigMsgBox"
    width="350"
  >
    <v-card class="popup-success">
    <i class="ico-success"><img src="@/assets/img/ico-success.png" alt=""></i>
    <div class="msg">
        <h3>{{ $t('Success') }}</h3>
        <p>{{ $t('The setting successfully save.') }}</p>
    </div>
    <v-card-actions class="d-flex justify-center btnArea">
        <v-btn @click="closeAppConfigMsgBox" text icon class="btn"> {{ $t('OK') }} </v-btn>
    </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    msgModalVisible: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
    }
  },
  mounted () {

  },
  methods: {
    handleAppconfigSaveBtnClick () {

    },
    closeAppConfigMsgBox () {
      this.$emit('closeAppConfigMsgBox')
    }
  }
}
</script>

<style>

</style>
