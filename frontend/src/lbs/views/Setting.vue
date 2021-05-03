<template>
  <div>
    <v-card style="border-radius: 10px; margin: 15px">
      <v-toolbar flat>
        <template v-slot:extension>
          <v-tabs
            v-model="tab"
            grow
            style="margin-top: -135px"
            hide-slider
            center-active
            active-class="activeTab"
          >
            <v-tabs-slider></v-tabs-slider>
            <v-tab
              href="#tab-1st"
              class="primary--text tab-divider"
              style="border-top-left-radius: 10px"
            >
              <span>{{ $t("STORE HISTORY") }}</span>
            </v-tab>
            <v-tab href="#tab-2nd" class="primary--text tab-divider">
              <span>{{ $t("COMPONENT") }}</span>
            </v-tab>
            <v-tab href="#tab-3rd" class="primary--text tab-divider">
              <span>{{ $t("APP SET") }}</span>
            </v-tab>
            <v-tab
              href="#tab-4th"
              class="primary--text tab-divider"
              style="border-top-right-radius: 10px"
            >
              <span>{{ $t("DEFAULT SET") }}</span>
            </v-tab>
          </v-tabs>
        </template>
      </v-toolbar>
      <v-tabs-items v-model="tab" style="padding: 40px">
        <v-tab-item
          :value="'tab-1st'"
          :transition="false"
          :reverse-transition="false"
          v-if="tab === 'tab-1st'"
        >
          <v-card flat>
            <storeHistory></storeHistory>
          </v-card>
        </v-tab-item>
        <v-tab-item
          :value="'tab-2nd'"
          :transition="false"
          :reverse-transition="false"
          v-if="tab === 'tab-2nd'"
        >
          <v-card flat>
            <AppSet></AppSet>
          </v-card>
        </v-tab-item>
        <v-tab-item
          :value="'tab-3rd'"
          :transition="false"
          :reverse-transition="false"
          v-if="tab === 'tab-3rd'"
        >
          <v-card flat>
            <ComponentSet></ComponentSet>
          </v-card>
        </v-tab-item>
        <v-tab-item
          :value="'tab-4th'"
          :transition="false"
          :reverse-transition="false"
          v-if="tab === 'tab-4th'"
        >
          <v-card flat>
            <h1>Component Not Fount</h1>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>
<script>
import StoreHistory from './Pages/StoreHistory'
import AppSet from './Pages/AppSet'
import ComponentSet from './Pages/ComponentSet'
export default {
  name: 'LbsSetting',
  components: {
    storeHistory: StoreHistory,
    AppSet: AppSet,
    ComponentSet: ComponentSet
  },
  data () {
    return {
      tab: null
    }
  }
}
</script>
<style scoped>
.imgageproperty {
  margin-right: 14px;
  height: 24px;
}
.tab-divider {
  border-right: 3px solid #ccd2d7;
}
.tab-divider:last-child {
  border-right: 0;
}
.v-application .primary--text {
  color: var(--v-primary-base) !important;
  caret-color: #ffffff !important;
}
.theme--light.v-tabs > .v-tabs-bar .v-tab:not(.v-tab--active) {
  background: #e2e2e2 !important;
}
.theme--light.v-tabs > .v-tabs-bar .v-tab--active {
  border-right: 3px solid #ccd2d7;
}
.theme--light.v-tabs > .v-tabs-bar .v-tab {
  min-height: 0px !important;
  left: 0px !important;
  min-width: 0px !important;
  border: none !important;
  font-size: 15px;
  font-weight: 900;
}
.theme--light.v-tabs-items {
  background-color: white !important;
}
.v-tab span{
  font-size: x-small;
}
</style>
