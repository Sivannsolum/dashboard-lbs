<template>
  <v-simple-table>
    <template v-slot:default>
      <!-- <thead>
        <tr>
          <th class="text-left">
            Name
          </th>
          <th class="text-left">
            Calories
          </th>
        </tr>
      </thead> -->
      <tbody>
        <tr
          v-for="item in dataTable"
          :key="item.key"
        >
          <td><v-checkbox v-model="checkboxes" :value="item.key"></v-checkbox></td>
          <td>{{ item.name }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>
<script>
export default {
  data () {
    return {
      checkboxes: [],
      dataTable: [
        {
          name: 'A-01',
          key: 'A-01'
        },
        {
          name: 'A-02',
          key: 'A-02'
        },
        {
          name: 'A-03',
          key: 'A-03'
        },
        {
          name: 'A-04',
          key: 'A-04'
        },
        {
          name: 'A-05',
          key: 'A-05'
        },
        {
          name: 'A-06',
          key: 'A-06'
        },
        {
          name: 'A-07',
          key: 'A-07'
        },
        {
          name: 'A-08',
          key: 'A-08'
        },
        {
          name: 'A-09',
          key: 'A-09'
        },
        {
          name: 'A-10',
          key: 'A-10'
        },
        {
          name: 'A-11',
          key: 'A-11'
        },
        {
          name: 'A-12',
          key: 'A-12'
        },
        {
          name: 'A-13',
          key: 'A-13'
        }
      ]
    }
  },
  computed: {
    totalCheckboxes () {
      console.log(this.checkboxes)
      return this.checkboxes
    }
  }
}
</script>
