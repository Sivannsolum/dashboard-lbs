<template>
  <v-card class="d-inline-flex pa-2" outlined tile>
    <div style="padding: 10px">
      <p>
        <span
          class="white--text text-uppercase"
          style="font-size: x-small; font-weight: bold"
          >View Mode</span
        >
      </p>
      <v-row>
        <v-checkbox dark label="Zone" class="d-inline-block"></v-checkbox>
        <v-checkbox dark label="Interior" class="d-inline-block"></v-checkbox>
        <v-checkbox dark label="Text" class="d-inline-block"></v-checkbox>
        <v-checkbox dark label="Facility" class="d-inline-block"></v-checkbox>
      </v-row>

      <div class="text-center">
        <v-btn class="ma-2" outlined color="white"> Management </v-btn>
      </div>
      <div class="text-center">
        <v-btn class="ma-2" outlined color="white"> Map Design </v-btn>
      </div>
      <div class="text-center">
        <v-btn class="ma-2" outlined color="white"> Self Location Link </v-btn>
      </div>
      <div class="text-center">
        <v-btn class="ma-2" outlined color="white">
          Stocking &#38; Pricing
        </v-btn>
      </div>

      <div class="text-center">
        <v-btn class="ma-2" outlined color="white"> Setting </v-btn>
      </div>
      <br />
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
.theme--light.v-label {
  color: #001e38 !important;
  font-size: small;
  left: -7px;
  font-weight: bold;
}
.v-btn:not(.v-btn--round).v-size--default {
  min-width: 212px;
}
.v-application .pa-2 {
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
</style>
