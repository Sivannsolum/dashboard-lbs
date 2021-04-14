<template>
  <v-dialog v-model="fuVisible" width="800" @click:outside="cancelFileUpload()">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        text
        :disabled="btnDisabledFileUpload"
        v-bind="attrs"
        v-on="on"
        class="btn ml-2"
        >{{ $t("File Upload") }}</v-btn
      >
    </template>
    <v-card class="popup add_store_popup">
      <h3 class="page-title-bar">
        <i class="ico ico-product"></i>{{ $t("File Upload") }}
      </h3>
      <v-row>
        <v-col>
          <v-file-input
            outlined
            dense
            hide-details
            prepend-icon
            solo
            flat
            :placeholder="`${$t('Select file')}`"
            class="form-file"
            multiple
            v-model="files"
            @change="appendFiles()"
          >
            <template v-slot:append>
              <img
                width="24"
                height="24"
                src="@/assets/img/ico-upload-file.gif"
              />
            </template>
          </v-file-input>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <p class="label-txt">{{ $t("Selected Files") }}</p>
          <ul class="selectedFile-list mt-2">
            <li v-for="file in filesToUpload" :key="file.name">
              <p>{{ file.name }}</p>
              <v-btn @click="removeFile(file.name)" text icon
                ><img width="24" height="24" src="@/assets/img/ico-delete2.png"
              /></v-btn>
            </li>
          </ul>
        </v-col>
      </v-row>
      <v-card-actions class="d-flex justify-center">
        <v-btn text icon @click="uploadFiles()" class="btn">{{
          $t("Upload")
        }}</v-btn>
        <v-btn text icon @click="cancelFileUpload()" class="btn">{{
          $t("Cancel")
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import EventBus from '@/plugins/eventBus'
import commons from '@/plugins/commons'

export default {
  props: {
    btnDisabledFileUpload: Boolean,
    store: Object
  },
  data () {
    return {
      productionType: process.env.VUE_APP_PRODUCTION_TYPE,
      requests: {
        uploadFiles: {
          method: 'post',
          url: '/api/common/articles/upload'
        }
      },
      files: [],
      filesToUpload: [],
      fuVisible: false
    }
  },
  methods: {
    cancelFileUpload () {
      this.files = []
      this.filesToUpload = []
      this.toggleFu()
    },
    toggleFu () {
      this.fuVisible = !this.fuVisible
    },
    appendFiles () {
      this.filesToUpload = [...this.filesToUpload, ...this.files]
      this.files = []
    },
    removeFile (fileName) {
      this.filesToUpload = this.filesToUpload.filter(
        (file) => file.name !== fileName
      )
    },
    async buildFileUploadBody (files) {
      const fileDataList = []
      for (const idx in files) {
        const fileData = {}
        fileData.contentType = 'IMAGE'
        fileData.imgBase64 = await commons.getBase64(files[idx])
        fileData.pageIndex = Number(idx) + 1
        fileData.fileName = files[idx].name
        fileDataList.push(fileData)
      }
      return fileDataList
    },
    async uploadFiles () {
      const files = this.filesToUpload
      if (files.length < 1) {
        EventBus.$emit('messageAlert', this.$t('Select files to upload.'))
        return
      }
      const reqBody = await this.buildFileUploadBody(files)
      const params = { store: this.store.code }
      const config = { params: params }

      if (this.productionType === 'cloud') {
        params.company = this.$store.state.auth.user.company
      }

      this.$utils
        .callAxiosWithBody(
          this.requests.uploadFiles.method,
          this.requests.uploadFiles.url,
          reqBody,
          config
        )
        .then((res) => {
          EventBus.$emit('messageAlert', this.$t(res.data.responseMessage))
          this.cancelFileUpload()
        })
    }
  }
}
</script>

<style>
</style>
