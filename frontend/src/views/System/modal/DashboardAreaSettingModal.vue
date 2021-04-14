<template>
  <v-dialog
    v-model="dialog"
    @click:outside="closeModal"
    width="400"
  >
    <v-card class="popup add_store_popup">
      <h3 class="page-title-bar"><i class="ico ico-system"></i>{{ $t(titleText) }}</h3>
      <div>
      <v-text-field
        outlined dense hide-details solo
        v-model="input"
        :placeholder="`${$t(`Input the ${this.action} ${this.category}`)}`"
        class="form-input"
        clearable
      ></v-text-field>
      </div>

      <v-card-actions class="d-flex justify-center">
        <v-btn text icon @click="clickSave" class="btn">{{$t('Save')}}</v-btn>
        <v-btn text icon @click="closeModal" class="btn">{{$t('Cancel')}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: [
    'dialog',
    'action',
    'category',
    'item'
  ],
  data () {
    return {
      input: null
    }
  },
  computed: {
    titleText () {
      return this.capitalize(this.action) + ' ' + this.capitalize(this.category)
    }
  },
  methods: {
    closeModal () {
      this.$emit('closeAreaModal', false)
    },
    capitalize (str) {
      if (str === null) {
        return ''
      } else {
        return str.charAt(0).toUpperCase() + str.slice(1)
      }
    },
    clickSave () {
      this.closeModal()
      this.$emit('saveArea', this.action, this.category, this.input)
    }
  },
  beforeUpdate () {
    // if (this.action === 'new') this.input = null
    // else this.input = this.item
  },
  watch: {
    dialog: function () {
      if (this.action === 'new') this.input = null
      else if (this.action === 'edit') this.input = this.item
    }
  }

}
</script>
