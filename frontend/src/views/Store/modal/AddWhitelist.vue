<template>
    <v-dialog
        v-model="addWhitelistVisible"
        width="400"
        @click:outside="cancelAddWhitelist"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-btn :disabled="addWhitelistDisabled" text v-bind="attrs" v-on="on" class="btn-s">{{$t('Add')}}</v-btn>
        </template>

        <v-card class="popup add_store_popup">
        <h3 class="page-title-bar"><i class="ico ico-store"></i>{{ $t('Add Whitelist') }}</h3>
        <v-row>
            <v-col>
            <p class="label-txt">{{$t('Add Type')}}</p>
            <v-radio-group
                v-model="addType"
                dense hide-details row
            >
                <v-radio
                    value="typing"
                    :label="$t('Typing')"
                    class="form-radio flat"
                ></v-radio>
                <v-radio
                    value="fileUpload"
                    :label="$t('File Upload')"
                    class="form-radio flat"
                ></v-radio>
            </v-radio-group>
            </v-col>
        </v-row>
        <v-row v-if="addType==='typing'">
            <v-col>
                <v-text-field
                    v-model="typedLabelId"
                    outlined dense hide-details
                    :label="`${$t('Label ID')} *`"
                    placeholder="Input the label ID"
                    class="form-input"
                    clearable
                ></v-text-field>
            </v-col>
        </v-row>
        <v-row v-else>
            <v-col>
            <v-file-input
                v-model="uploadedLabelIds"
                outlined dense hide-details prepend-icon flat solo
                placeholder="Select file"
                class="form-file"
            >
                <template v-slot:append>
                <img width="24" height="24" src="@/assets/img/ico-upload-file.gif" >
                </template>
            </v-file-input>
            </v-col>
        </v-row>

        <v-card-actions class="d-flex justify-center">
            <v-btn @click="addWhitelist" text icon class="btn">{{$t('Add')}}</v-btn>
            <v-btn text icon @click="cancelAddWhitelist" class="btn">{{$t('Cancel')}}</v-btn>
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

<style>

</style>
