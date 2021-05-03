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
        <div class="checkboxes">
          <label for="Zone">
            <input type="checkbox" style="margin-left: 20px" id="Zone" />
            <span class="span-class">Zone</span>
          </label>
          <label for="Interior">
            <input type="checkbox" id="Interior" />
            <span class="span-class">Interior</span>
          </label>
          <label for="Text">
            <input type="checkbox" id="Text" />
            <span class="span-class">Text</span>
          </label>
          <label for="Facility">
            <input type="checkbox" id="Facility" />
            <span class="span-class">Facility</span>
          </label>
        </div>
      </v-row>

      <div class="text-center">
        <router-link to="/Lbs/Management">
          <v-btn
            class="ma-2"
            @click="isActive('m')"
            :outlined="isActiveeBtn !== 'm'"
            color="white"
          >
            Management
          </v-btn>
        </router-link>
      </div>
      <div class="text-center">
        <router-link to="/Lbs/MapDesign">
          <v-btn
            class="ma-2"
            @click="isActive('md')"
            :outlined="isActiveeBtn !== 'md'"
            color="white"
          >
            Map Design
          </v-btn>
          <div class="map-design-selection" v-if="isActiveBtn === 'md'">
            <div class="icons-background">
              <ul class="icons-ul">
                <li class="icons-li">
                  <img
                    src="@/assets/img/plus_icon.png"
                    alt=""
                    class="icon-class"
                    style="margin-left: -30px; margin-top: 15px"
                  /><img
                    src="@/assets/img/plus_icon.png"
                    alt=""
                    class="icon-class"
                    style="margin-left: -30px; margin-top: 15px"
                  />
                </li>
                <li class="icons-li">
                  <img
                    src="@/assets/img/minus_icon.png"
                    alt=""
                    class="icon-class margin-class"
                  /><img
                    src="@/assets/img/minus_icon.png"
                    alt=""
                    class="icon-class margin-class"
                  />
                </li>
                <li class="icons-li">
                  <img
                    src="@/assets/img/on_icon.png"
                    alt=""
                    class="icon-class margin-class"
                  /><img
                    src="@/assets/img/on_icon.png"
                    alt=""
                    class="icon-class margin-class"
                  />
                </li>
                <li class="icons-li">
                  <img
                    src="@/assets/img/vibrate_icon.png"
                    alt=""
                    class="icon-class"
                    style="margin-left: -30px; margin-top: -15px"
                  /><img
                    src="@/assets/img/vibrate_icon.png"
                    alt=""
                    class="icon-class margin-class"
                  />
                </li>
                <li class="icons-li">
                  <img
                    src="@/assets/img/plus_icon.png"
                    alt=""
                    class="icon-class margin-class"
                  /><img
                    src="@/assets/img/plus_icon.png"
                    alt=""
                    class="icon-class margin-class"
                  />
                </li>
                <li class="icons-li">
                  <img
                    src="@/assets/img/minus_icon.png"
                    alt=""
                    class="icon-class margin-class"
                  /><img
                    src="@/assets/img/minus_icon.png"
                    alt=""
                    class="icon-class margin-class"
                  />
                </li>
                <li class="icons-li">
                  <img
                    src="@/assets/img/on_icon.png"
                    alt=""
                    class="icon-class margin-class"
                  /><img
                    src="@/assets/img/on_icon.png"
                    alt=""
                    class="icon-class margin-class"
                  />
                </li>
                <li class="icons-li">
                  <img
                    src="@/assets/img/vibrate_icon.png"
                    alt=""
                    class="icon-class margin-class"
                  /><img
                    src="@/assets/img/vibrate_icon.png"
                    alt=""
                    class="icon-class margin-class"
                  />
                </li>
              </ul>
            </div>
          </div>
        </router-link>
      </div>
      <div class="text-center">
        <router-link to="/Lbs/SelfLocationLink">
          <v-btn
            class="ma-2"
            @click="isActive('sll')"
            :outlined="isActiveeBtn !== 'sll'"
            color="white"
          >
            Self Location Link
          </v-btn>
        </router-link>
      </div>
      <div class="text-center">
        <router-link to="/Lbs/StockingAndPricing">
          <v-btn
            class="ma-2"
            @click="isActive('sp')"
            :outlined="isActiveeBtn !== 'sp'"
            color="white"
          >
            Stocking &#38; Pricing
          </v-btn>
        </router-link>
      </div>
      <div class="text-center">
        <router-link to="/Lbs/Setting">
          <v-btn
            class="ma-2"
            @click="isActive('s')"
            :outlined="isActiveBtn !== 's'"
            color="white"
          >
            Setting
          </v-btn>
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
              max-height: 130px;
            "
          >
            <div style="margin: 15px">
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
        <v-list-group style="margin: 3px">
          <template v-slot:activator>
            <v-list-item-title
              style="color: white; font-size: small; font-weight: bold"
              >MINI MAP</v-list-item-title
            >
          </template>
          <v-container
            style="
              height: 120px;
              background: white;
              border-radius: 6px;
              padding: 0px;
              width: 211px;
            "
            ><span
              ><img
                style="height: 118px; width: 209px"
                src="@/assets/img/lbsminimap.png"
                alt=""
            /></span>
          </v-container>
        </v-list-group>
      </v-list>
    </div>
  </v-card>
</template>
<script>
import EventBus from '@/plugins/eventBus'
// import { setTempObj, getTempObj } from '@/plugins/sessionStorageManager'
export default {
  data () {
    return {
      isActiveBtn: 'm'
    }
  },
  computed: {
    isActiveeBtn () {
      return this.isActiveBtn
    }
  },
  methods: {
    isActive (btn) {
      this.isActiveBtn = btn
      sessionStorage.setItem('isActive', btn)
    }
  },
  mounted () {
    const isActive = sessionStorage.getItem('isActive')
    this.isActiveBtn = isActive !== null ? isActive : 'm'
    this.isActive(this.isActiveBtn)
    this.$store.commit('lbs/setTabUrl', 'lbs')
    EventBus.$on('resetLbsBtn', () => {
      this.isActiveBtn = 'm'
      this.isActive(this.isActiveBtn)
      this.$store.commit('lbs/setTabUrl', 'lbs')
    })
  }
}
</script>
<style scoped>
.margin-class {
  margin-left: -30px;
  margin-top: -15px;
}
.icons-background {
  background: #ffffff;
  box-shadow: 0px 12px 16px #455b631a;
  border-radius: 0px 12px 12px 0px;
  opacity: 0.9;
}
.icons-li {
  margin-bottom: -20px;
  display: flex;
}
::v-deep .v-application ul {
  padding-left: 0px !important;
}
.icon-class {
  height: 80px;
  width: 80px;
}
.map-design-selection {
  background: transparent;
  height: 400px;
  margin-top: -140px;
  width: 117px;
  position: absolute;
  margin-left: 257px;
}
.checkboxes {
  margin-bottom: 15px;
}
.checkboxes label {
  display: inline-block;
  padding-right: 10px;
  white-space: nowrap;
}
.checkboxes input {
  vertical-align: middle;
}
.checkboxes label span {
  vertical-align: middle;
  font-size: 12px;
}
input[type="checkbox"] {
  margin-right: 4px;
  cursor: pointer;
  font-size: 14px;
  width: 14px;
  position: relative;
}
input[type="checkbox"]:after {
  position: absolute;
  width: 14px;
  height: 14px;
  top: 0;
  content: " ";
  background-color: #001e38;
  color: #001d37;
  display: inline-block;
  visibility: visible;
  border-radius: 3px;
  border: 2px solid grey;
  padding: 0px 1px 0px 1px;
}
input[type="checkbox"]:checked:after {
  content: "✔";
  font-size: 12px;
  background-color: #ffffff;
  font-weight: 1000;
  line-height: 12px;
  padding-right: 10px;
}
.span-class {
  margin-top: -5px;
  color: #ffffff;
}

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
