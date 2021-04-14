<template>
  <div>
    <h2 class="page-title-bar">
      <i class="ico ico-label"></i>{{ $t('Label Firmware') }}
    </h2>

    <!-- data table -->
    <v-data-table
      v-model="selected"
      :headers="labelHeaders"
      :items="labelItems"
      :page.sync="page"
      :hide-default-footer="true"
      item-key="id"
      class="tbl-type01 mt-10"
      @page-count="pageCount = $event"
    >
    </v-data-table>

    <!-- 하단 옵션 -->
    <div class="table-options">
      <!-- button group -->
      <div>
        <v-dialog v-model="dialog" width="700">
          <template v-slot:activator="{ on, attrs }">
            <v-btn text v-bind="attrs" v-on="on" class="btn">{{
              $t('Firmware Update')
            }}</v-btn>
          </template>

          <v-card class="popup add_store_popup">
            <h3 class="page-title-bar">
              <i class="ico ico-overview"></i>{{ $t('Firmware Update') }}
            </h3>

            <div>
              <v-select
                outlined
                dense
                label="Model*"
                placeholder="Select the model"
                hint="Select the model for firmware update"
                persistent-hint
                :items="['A-001', 'A-002', 'A-003']"
                class="form-select"
                clearable
              ></v-select>
            </div>
            <div class="mt-5">
              <v-select
                outlined
                dense
                label="Firmware*"
                placeholder="Select the firmware version"
                hint="Select the firmware version"
                persistent-hint
                :items="['A-001', 'A-002', 'A-003']"
                class="form-select"
                clearable
              ></v-select>
            </div>
            <div class="mt-5">
              <v-file-input
                outlined
                dense
                hide-details
                prepend-icon
                :label="$t('File Upload')"
                :placeholder="$t('File Upload')"
                class="form-file"
                append-icon
              ></v-file-input>
            </div>
            <v-card-actions class="d-flex justify-center">
              <v-btn text icon @click="dialog = false" class="btn">{{
                $t('Update')
              }}</v-btn>
              <v-btn text icon @click="dialog = false" class="btn">{{
                $t('Cancel')
              }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-btn text class="btn ml-2">{{ $t('Export') }}</v-btn>
      </div>

      <!-- paging -->
      <div>
        <div class="pageInfo">1 to 7, 7 in total</div>
        <v-pagination
          v-model="page"
          :length="pageCount"
          color="#2f3b4c"
          class="paging"
        ></v-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Firmware',
  data () {
    return {
      page: 0,
      selected: [],
      pageCount: 0,
      dialog: false,
      labelHeaders: [
        { text: '#', sortable: false, align: 'center', value: 'no' },
        { text: 'TITLE', value: 'title' },
        { text: 'FIRMWARE VERSION', value: 'version' },
        { text: 'MODEL', value: 'model' },
        { text: 'DESCRIPTION', value: 'desc' },
        { text: 'DATE', value: 'date' }
      ],
      labelItems: [
        {
          no: 31,
          title: '213-nfc-3led',
          version: '0000000',
          model: 'EL029H3WRA',
          desc: 'LBS Function(anchor), Improved Wi0Fi sensitivity',
          date: '2020-00-00'
        }
      ]
    }
  }
}
</script>
