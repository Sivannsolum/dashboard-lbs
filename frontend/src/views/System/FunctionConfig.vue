<template>
  <div>
    <h2 class="page-title-bar"><i class="ico ico-system"></i>{{$t('Function Config')}}</h2>

    <h3 class="tit-group mt-10">{{$t('System Function')}}</h3>
    <div class="system-function-box">
      <div>
        <h4 class="label-txt">{{$t('Management')}}</h4>
        <v-switch inset hide-details
          label="Area Mangement"
          class="form-switch"
        ></v-switch>
      </div>
      <div>
        <h4 class="label-txt">{{$t('Menu')}}</h4>
        <v-switch inset hide-details
          label="Template Grouping &amp; Mapping"
          class="form-switch"
        ></v-switch>
        <v-switch inset hide-details
          label="LBS(Location Based Service, Anchor Info)"
          class="form-switch"
        ></v-switch>
      </div>
      <div>
        <h4 class="label-txt">{{ $t('Alive Interval') }}</h4>
        <v-text-field
          outlined dense hide-details solo
          value="24"
          class="form-input mt-5"
          clearable
        ></v-text-field>
      </div>
    </div>
    <v-btn text class="btn t-bottom">{{$t('Save')}}</v-btn>

    <h3 class="tit-group mt-10">{{$t('Report Function')}}</h3>
    <!-- data table -->
    <table class="tbl-custom-type01 max-80">
      <colgroup>
        <col style="width:25%">
        <col style="width:25%">
        <col style="width:25%">
        <col>
      </colgroup>
      <thead>
        <tr>
          <th>{{$t('Range')}}</th>
          <th>{{$t('On/Off')}}</th>
          <th>{{$t('Cycle')}}</th>
          <th>{{$t('Reported Time')}}<span>({{$t('Account Time Zone')}})</span></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>All</td>
          <td>
            <v-switch inset hide-details solo
              class="form-switch"
            ></v-switch>
          </td>
          <td>
            <v-select
              dense hide-details solo
              :items="['Monthly', 'Weekly', 'Daily']"
              width="50"
              class="form-select"
              clearable
            ></v-select>
          </td>
          <td>
            <v-select
              dense hide-details solo
              :items="['00', '01', '02']"
              class="form-select"
              clearable
            ></v-select>
          </td>
        </tr>
      </tbody>
    </table>

    <v-btn text class="btn mt-5">{{$t('Save')}}</v-btn>
  </div>
</template>

<script>

export default {
  name: 'FunctionConfig'
}
</script>

<style scoped>
  .system-function-box{display:flex; max-width:80%; border:1px solid #f3f3f3;}
  .system-function-box>div{padding:25px;}
  .system-function-box>div+div{border-left:1px solid #f3f3f3;}
  .system-function-box>div:nth-of-type(1){width:30%;}
  .system-function-box>div:nth-of-type(2){width:40%;}
  .system-function-box>div:nth-of-type(3){width:30%;}
</style>
