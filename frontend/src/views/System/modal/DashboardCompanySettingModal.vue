<template>
  <v-dialog
    v-model="dialogCompany"
    @click:outside="closeModal"
    width="400"
  >
    <v-card class="popup add_store_popup">
      <h3 class="page-title-bar"><i class="ico ico-system"></i>{{ $t(titleText) }}</h3>
      <div>
        <v-row>
          <v-col>
            <v-text-field
              outlined dense hide-details
              v-model="companyObj.code"
              :disabled="editMode"
              :label="`${$t('code')} *`"
              :placeholder="`${$t(`Input the code`)}`"
              class="form-input"
              clearable
            ></v-text-field>
        </v-col>
      </v-row>
      <!--
      <v-row>
          <v-col>
          <v-text-field
            outlined dense hide-details
            v-model="companyObj.name"
            :label="`${$t('name')} *`"
            :placeholder="`${$t(`Input the name`)}`"
            class="form-input"
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
      -->
      <!-- <v-row>
          <v-col>
            <p class="label-txt">{{ $t('batch services') }} *</p>
            <v-switch inset hide-details solo
                  class="form-switch"
                  v-model="companyObj.batch_services"
            ></v-switch>
        </v-col>
      </v-row> -->
      <v-row>
          <v-col>
          <v-text-field
            outlined dense hide-details
            v-model="companyObj.max_images"
            :label="`${$t('max images')} *`"
            :placeholder="`${$t(`Input the max images`)}`"
            @keyup.prevent="handleKeyUp"
            type="number"
            :min=1
            :max=7
            class="form-input"
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
          <v-col>
          <v-text-field
            outlined dense hide-details
            v-model="companyObj.description"
            :label="`${$t('description')} *`"
            :placeholder="`${$t(`Input the description`)}`"
            class="form-input"
            :maxlength=50
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
      </div>

      <v-card-actions class="d-flex justify-center">
        <v-btn text icon @click="clickSave" class="btn">{{$t('Save')}}</v-btn>
        <v-btn text icon @click="closeModal" class="btn">{{$t('Cancel')}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import EventBus from '@/plugins/eventBus.js'
export default {
  props: [
    'dialogCompany',
    'action',
    'category',
    'item'
  ],
  data () {
    return {
      input: null,
      editMode: false,
      companyObj: {
        code: null,
        name: null,
        max_images: 0,
        description: null,
        batch_services: false,
        register_date: null,
        storesPerPartition: null
      }
    }
  },
  computed: {
    titleText () {
      return this.capitalize(this.action) + ' ' + this.capitalize(this.category)
    }
  },
  methods: {
    handleKeyUp (e) {
      const regex = /[ㄱ-ㅎㅏ-ㅣ가-힣|A-Za-z|.+_-]/g
      const value = e.target.value.replace(regex, '')
      e.target.value = value.length > 1 ? value.substring(0, 1) : value
    },
    closeModal () {
      this.$emit('closeCompanyModal', false)
    },
    capitalize (str) {
      if (str === null) {
        return ''
      } else {
        return str.charAt(0).toUpperCase() + str.slice(1)
      }
    },
    getCompanyInfo () {
      const url = '/api/common/company'
      const config = {}

      config.params = {
        company: this.item
      }
      this.$utils.callAxios('get', url, config).then((res) => {
        if (res.data) {
          if (res.data.companyList.length > 0) this.companyObj = res.data.companyList[0]
        }
      })
        .catch((error) => {
          console.debug(error.response.data.responseMessage)
          return false
        })
    },
    init () {
      this.companyObj = {
        code: null,
        name: null,
        max_images: 0,
        description: null,
        batch_services: false,
        register_date: null,
        storesPerPartition: null
      }
    },
    clickSave () {
      if (this.action === 'new') {
        this.NewSave()
      } else if (this.action === 'edit') {
        this.EditSave()
      }
    },
    NewSave () {
      const url = '/api/common/company'
      const config = {}
      const body = {
        code: this.companyObj.code,
        name: this.companyObj.code,
        max_images: this.companyObj.max_images,
        description: this.companyObj.description
        // batch_services: this.companyObj.batch_services
        // register_date: this.companyObj.register_date,
        // storesPerPartition: this.companyObj.storesPerPartition
      }
      this.$utils.callAxiosWithBody('post', url, body, config).then((res) => {
        this.$emit('saveCompany', this.action, this.category, this.input)
        this.closeModal()
      })
        .catch(error => {
          EventBus.$emit('messageAlert', this.$t(error.response.data.responseMessage))
        })
    },
    EditSave () {
      const url = '/api/common/company'
      const config = {
        params: {
          company: this.companyObj.code
        }
      }
      const body = {
        name: this.companyObj.name,
        max_images: this.companyObj.max_images,
        description: this.companyObj.description
        // batch_services: this.companyObj.batch_services
        // register_date: this.companyObj.register_date,
        // storesPerPartition: this.companyObj.storesPerPartition
      }
      this.$utils.callAxiosWithBody('put', url, body, config).then((res) => {
        this.$emit('saveCompany', this.action, this.category, this.input)
        this.closeModal()
      })
        .catch(error => {
          EventBus.$emit('messageAlert', this.$t(error.response.data.responseMessage))
        })
    }
  },
  beforeUpdate () {
    // if (this.action === 'new') this.input = null
    // else this.input = this.item
  },
  watch: {
    dialogCompany: function () {
      if (this.action === 'new') {
        this.editMode = false
        this.init()
        this.input = null
      } else if (this.action === 'edit') {
        this.editMode = true
        this.getCompanyInfo()
        this.input = this.item
      }
    }
  }

}
</script>
