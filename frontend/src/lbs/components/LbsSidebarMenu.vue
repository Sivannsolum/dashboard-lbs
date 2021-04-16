<template>
  <v-card class="d-inline-flex pa-2" outlined tile>
    <div style="padding: 10px">
      <p>
        <span
          class="white--text text-uppercase"
          style="
            color: white;
            font-size: small;
            font-weight: bold;
            margin-left: 7px;
          "
          >View Mode</span
        >
      </p>
      <v-row>
        <v-checkbox
          dark
          label="Zone"
          class="my-checkbox"
          style="margin-left: 24px"
        ></v-checkbox>
        <v-checkbox dark label="Interior" class="my-checkbox"></v-checkbox>
        <v-checkbox dark label="Text" class="my-checkbox"></v-checkbox>
        <v-checkbox dark label="Facility" class="my-checkbox"></v-checkbox>
      </v-row>

      <div class="text-center">
        <router-link to="/Lbs/Management">
        <v-btn class="ma-2" outlined color="white"> Management </v-btn>
        </router-link>
      </div>
      <div class="text-center">
        <router-link to="/Lbs/MapDesign">
        <v-btn class="ma-2" outlined color="white"> Map Design </v-btn>
        </router-link>
      </div>
      <div class="text-center">
        <router-link to="/Lbs/SelfLocationLink">
        <v-btn class="ma-2" outlined color="white"> Self Location Link </v-btn>
        </router-link>
      </div>
      <div class="text-center">
        <router-link to="/Lbs/StockingAndPricing">
          <v-btn class="ma-2" outlined color="white">
          Stocking &#38; Pricing
        </v-btn>
        </router-link>
      </div>
      <div class="text-center">
        <router-link to="/Lbs/Setting">
        <v-btn class="ma-2" outlined color="white"> Setting </v-btn>
        </router-link>
      </div>
      <br />

      <v-divider></v-divider>
      <v-list style="background: transparent">
        <v-list-group style="overflow-y: auto">
          <template v-slot:activator>
            <v-list-item-title
              style="color: white; font-size: small; font-weight: bold"
              >CAD LAYER</v-list-item-title
            >
          </template>
          <div
            class="ma-2"
            rounded
            style="
              background: white;
              border-radius: 6px;
              overflow-y: scroll;
              max-height: 170px;
            "
          >
            <div style="padding: 10px">
              <v-checkbox dense label="Layer 1"></v-checkbox>
              <v-divider></v-divider>
              <v-checkbox dense label="Layer 2"></v-checkbox>
              <v-divider></v-divider>
              <v-checkbox dense label="Layer 3"></v-checkbox>
              <v-divider></v-divider>
              <v-checkbox dense label="Layer 4"></v-checkbox>
              <v-divider></v-divider>
            </div>
          </div>
        </v-list-group>
      </v-list>
      <v-divider></v-divider>
      <v-list style="background: transparent">
        <v-list-group>
          <template v-slot:activator>
            <v-list-item-title
              style="color: white; font-size: small; font-weight: bold"
              >MINI MAP</v-list-item-title
            >
          </template>
          <v-container
            style="height: 120px; background: white; border-radius: 6px"
            ><span
              ><img
                style="height: 95px; width: 206px"
                src="@/assets/img/lbsminimap.png"
                alt=""
            /></span>
          </v-container>
        </v-list-group>
      </v-list>
    </div>
  </v-card>
</template>
<style scoped>
::v-deep.theme--dark.v-label {
  color: #001e38 !important;
  font-size: small;
  left: -7px;
  font-weight: bold;
}
.v-btn:not(.v-btn--round).v-size--default {
  min-width: 212px;
}
::v-deep.v-application .pa-2 {
  padding: 4px !important;
}

.v-divider {
  display: block;
  flex: 1 1 0px;
  max-width: 100%;
  height: 0px;
  max-height: 0px;
  border: solid;
  border-width: thin 0 0 0;
  transition: inherit;
  color: #c1c1c1 !important;
}
::v-deep.v-list .v-list-item--active .v-icon {
  color: white !important;
}
::v-deep .v-list .v-list-item .v-icon {
  color: white;
}

::v-deep .v-input--selection-controls__input {
  height: 0px !important;
  width: 0px !important;
  margin-right: 24px !important;
}
::v-deep .my-checkbox .v-label {
  font-size: 13px;
  left: -14px !important;
}

::v-deep .v-icon.v-icon {
  color: #c1c1c1;
  font-size: var(--font20);
}

::-webkit-scrollbar {
  width: 10px;
  height: 2px;
}
/* Track */
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-border-radius: 6px;
  border-radius: 6px;
}
/* Handle */
::-webkit-scrollbar-thumb {
  -webkit-border-radius: 6px;
  border-radius: 6px;
  background: grey;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
}
::-webkit-scrollbar-thumb:window-inactive {
  background: darkgrey;
}
</style>
