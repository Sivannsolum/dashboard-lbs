<template>
  <v-card
    class="d-inline-flex pa-2"
    outlined
    tile
  >
    <div>
        <p><span class="white--text text-uppercase">View Mode</span></p>
        <v-checkbox dense label="Zone" class="d-inline-block"></v-checkbox>
        <v-checkbox dense label="Interior" class="d-inline-block"></v-checkbox>
        <v-checkbox dense label="Text" class="d-inline-block"></v-checkbox>
        <v-checkbox dense label="Facility" class="d-inline-block"></v-checkbox>

    <div class="text-center">
    <v-btn
      class="ma-2"
      outlined
      color="indigo"
    >
      Management
    </v-btn>
    </div>
    <div class="text-center">
    <v-btn
      class="ma-2"
      outlined
      color="indigo"
    >
      Map Design
    </v-btn>
    </div>
    <div class="text-center">
    <v-btn
      class="ma-2"
      outlined
      color="indigo"
    >
      Self Location Link
    </v-btn>
    </div>
    <div class="text-center">
    <v-btn
      class="ma-2"
      outlined
      color="indigo"
    >
      Stocking &#38; Pricing
    </v-btn>
    </div>
    <div class="text-center">
    <v-btn
      class="ma-2"
      outlined
      color="indigo"
    >
      Setting
    </v-btn>
    </div>
    </div>
  </v-card>
</template>
<style>
.theme--light.v-label {
    color: rgb(255 255 255);
}
.v-btn:not(.v-btn--round).v-size--default {
    min-width: 199px;
}
</style>
