<template>
    <v-dialog
        v-model="addWhitelistVisible"
        width="400"
        @click:outside="cancelAddWhitelist"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-btn :disabled="addWhitelistDisabled" text v-bind="attrs" v-on="on" class=" btn btn1 type-search btnAlignment">{{$t('Add Zone')}}</v-btn>
        </template>

        <v-card class="popup add_store_popup">
        <h3 class="page-title-bar"><i class="ico ico-store"></i>{{ $t('Add Zone') }}</h3>

        <v-row >
            <v-col>
                <v-text-field
                    v-model="typedLabelId"
                    outlined dense hide-details
                    :label="`${$t('Title')} *`"
                    placeholder="Input the title"
                    class="form-input"
                    clearable
                ></v-text-field>
            </v-col>
        </v-row>

        <v-card-actions class="d-flex justify-center">
            <v-btn  text icon class="btn">{{$t('Save')}}</v-btn>
            <v-btn text icon  class="btn">{{$t('Cancel')}}</v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import EventBus from '@/plugins/eventBus.js'

const inputType = {
  typing: 'typing',
  fileUpload: 'fileUpload'
}

export default {
  props: ['addWhitelistDisabled'],
  data () {
    return {
      addWhitelistVisible: false,
      addType: inputType.typing,
      typedLabelId: null,
      uploadedLabelIds: null
    }
  },
  methods: {
    cancelAddWhitelist () {
      this.addWhitelistVisible = false
      this.uploadedLabelIds = null
      this.typedLabelId = null
      this.addType = inputType.typing
    },
    isValid (val) {
      if (val !== null && val !== undefined) return true
      return false
    },
    isValidStr (val) {
      if (val !== null && val !== undefined && val.trim().length > 0) return true
      return false
    },
    addWhitelist () {
      let labels = []
      if (this.addType === inputType.typing) {
        if (!this.isValidStr(this.typedLabelId)) {
          EventBus.$emit('messageAlert', this.$t('Input the label ID.'))
          return
        }
        labels.push(this.typedLabelId)
        this.$emit('addWhitelist', labels)
      } else {
        if (!this.isValid(this.uploadedLabelIds)) {
          EventBus.$emit('messageAlert', this.$t('Input the label ID.'))
          return
        }
        const fr = new FileReader()
        fr.readAsText(this.uploadedLabelIds)
        fr.onload = () => {
          labels = fr.result.split('\n')
            .filter(label => this.isValidStr(label))
            .map(label => label.trim())
          this.$emit('addWhitelist', labels)
        }
      }
    }
  },
  mounted () {
    EventBus.$on('fireCancelAddWhitelist', () => {
      this.cancelAddWhitelist()
    })
  }
}
</script>

<style scoped>
.btnAlignment{
    margin-top: 3%;

}
.btn1{
width:100% ! important;
}
</style>
