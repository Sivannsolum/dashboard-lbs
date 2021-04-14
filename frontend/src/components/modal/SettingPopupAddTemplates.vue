<template>
    <v-dialog
        v-model="dialog_AddTemplates"
        persistent
        :retain-focus="false"
        width="630"
    >
        <!--
        <template v-slot:activator="{ on, attrs }">
        <v-btn text v-bind="attrs" v-on="on"><img src="@/assets/img/ico-add.png" alt=""> <i class="txt">ADD</i></v-btn>
        </template>
        -->
        <v-card class="popup add_store_popup">
        <div class="page-title-bar">
            <h2 class="page-title"><img src="@/assets/img/ico-doc.png" alt="save"> <strong>ADD</strong> EMAIL ADDRESS</h2>
        </div>

        <v-row>
            <v-col cols="12" sm="5" class="d-flex align-center">
            <div>
                <p class="line-title mb-2">Email Address</p>
                <p class="sub-text">Mail Address</p>
            </div>
            </v-col>
            <v-col cols="12" sm="7">
            <v-text-field
                hide-details="false" v-bind:single-line="true" loading="false" text height="30"
                class="form-input"
                clearable
            ></v-text-field>
            </v-col>
        </v-row>

        <v-card-actions class="d-flex justify-center">
            <v-btn text icon @click="saveAddTemplates()"><img src="@/assets/img/btn-popup-save.png" alt="save"></v-btn>
            <v-btn text icon @click="closeModal()"><img src="@/assets/img/btn-popup-close.png" alt="close"></v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
  props: {
    dialog_AddTemplates: Boolean
  },
  methods: {
    closeModal () {
      this.$emit('closeAddTemplatesModal', false)
    },
    saveAddTemplates () {
      this.closeModal()
    }
  },
  mounted () { // init
  },
  data () {
    return {
      selected: [],
      page: 1,
      pageCount: 0,
      Headers: [
        {
          text: 'TIME',
          align: 'center',
          sortable: false,
          value: 'time'
        },
        { text: 'UPDATE ID', align: 'center', sortable: false, value: 'update' },
        { text: 'DISPLAY', align: 'center', sortable: false, value: 'display' }
      ],
      Items: [
        {
          time: '2020-07-14 00:36:00',
          update: 80431323,
          display: 'To be'
        },
        {
          time: '2020-07-11 00:36:00',
          update: 80431323,
          display: 'As is'
        }
      ]
    }
  }
}
</script>
