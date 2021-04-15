<template>
  <v-card class="d-inline-flex pa-2" outlined tile >
    <div style="padding:10px">
      <p >
        <span
          class="white--text text-uppercase"
          style="font-size: x-small; font-weight: bold"
          >View Mode</span
        >
      </p>
      <v-row>
        <v-checkbox dense label="Zone" class="d-inline-block"></v-checkbox>
        <v-checkbox dense label="Interior" class="d-inline-block"></v-checkbox>
        <v-checkbox dense label="Text" class="d-inline-block"></v-checkbox>
        <v-checkbox dense label="Facility" class="d-inline-block"></v-checkbox>
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
      <v-list>
      <v-list-group>
        <template v-slot:activator>
          <v-list-item-title>CAD LAYER</v-list-item-title>
        </template>
        <div class="ma-2" rounded>
          <v-checkbox dense label="Layer 1"></v-checkbox>
          <v-divider></v-divider>
          <v-checkbox dense label="Layer 2"></v-checkbox>
          <v-divider></v-divider>
          <v-checkbox dense label="Layer 3"></v-checkbox>
          <v-divider></v-divider>
          <v-checkbox dense label="Layer 4"></v-checkbox>
          <v-divider></v-divider>
      </div>
      </v-list-group>
    </v-list>
          <v-divider></v-divider>
    <v-list>
      <v-list-group>
        <template v-slot:activator>
          <v-list-item-title>MINI MAP</v-list-item-title>
        </template>
        <v-textarea></v-textarea>
      </v-list-group>
    </v-list>
    </div>
  </v-card>
</template>
<style>
.theme--light.v-label {
  color: rgb(255 255 255) !important;
  font-size: small;
  left: -7px;
}
.v-btn:not(.v-btn--round).v-size--default {
  min-width: 212px;
}
.v-application .pa-2 {
    padding: 4px !important;
}
</style>
