<template>
    <v-dialog
              v-model="dialog_popupMutiFunction"
              persistent
              :retain-focus="false"
              width="630"
            >
            <!--
              <template v-slot:activator="{ on, attrs }">
                <v-btn text v-bind="attrs" v-on="on">{{item.pattern}}</v-btn>
              </template>
            -->
              <v-card class="popup add_store_popup">
                <div class="page-title-bar">
                  <h2 class="page-title"><img src="@/assets/img/ico-doc.png" alt="save"> <strong>LED</strong> CONFIGURATION SETTING</h2>
                </div>

                <v-row>
                  <v-col cols="12" sm="5" class="d-flex align-center">
                    <div>
                      <p class="line-title mb-2">Pattern Name</p>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="7">
                    <v-text-field
                      value="PATTERN_1"
                      hide-details="false" v-bind:single-line="true" loading="false" text height="30"
                      class="form-input"
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="5" class="d-flex align-center">
                    <div>
                      <p class="line-title mb-2">{{ $t('On Time (msec)') }}</p>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="7">
                    <v-text-field
                      value="30"
                      hide-details="false" v-bind:single-line="true" loading="false" text height="30"
                      class="form-input"
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="5" class="d-flex align-center">
                    <div>
                      <p class="line-title mb-2">{{ $t('Off Time(msec)') }}</p>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="7">
                    <v-text-field
                      value="30"
                      hide-details="false" v-bind:single-line="true" loading="false" text height="30"
                      class="form-input"
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="5" class="d-flex align-center">
                    <div>
                      <p class="line-title mb-2">{{ $t('Idle Time (sec)') }}</p>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="7">
                    <v-text-field
                      value="1"
                      hide-details="false" v-bind:single-line="true" loading="false" text height="30"
                      class="form-input"
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="5" class="d-flex align-center">
                    <div>
                      <p class="line-title mb-2">Repeat Count</p>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="7">
                    <v-text-field
                      value="5"
                      hide-details="false" v-bind:single-line="true" loading="false" text height="30"
                      class="form-input"
                      clearable
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-card-actions class="d-flex justify-center">
                  <v-btn text icon @click="saveMutiFunction()"><img src="@/assets/img/btn-popup-save.png" alt="save"></v-btn>
                  <v-btn text icon @click="closeModal()"><img src="@/assets/img/btn-popup-close.png" alt="close"></v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
</template>
<script>
export default {
  props: {
    dialog_popupMutiFunction: Boolean
  },
  methods: {
    closeModal () {
      this.$emit('closeMutiFunctionModal', false)
    },
    saveMutiFunction () {
      this.closeModal()
    }
  },
  mounted () { // init
  },
  data () {
    return {
      selected: [],
      page: 1,
      pageCount: 0
    }
  }
}
</script>
