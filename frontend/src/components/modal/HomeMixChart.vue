<script>
// 1. Import Chart.js so you can use the global Chart object
import Chart from 'chart.js'
// 2. Import the `generateChart()` method to create the vue component.
import { generateChart } from 'vue-chartjs'

// 3. Extend on of the default charts
// http://www.chartjs.org/docs/latest/developers/charts.html
Chart.defaults.LineWithBar = Chart.defaults.bar
Chart.controllers.LineWithBar = Chart.controllers.line.extend({
  /* custom magic here */
})

// 4. Generate the vue-chartjs component
// First argument is the chart-id, second the chart type.
const CustomLine = generateChart('custom-line')

// 5. Extend the CustomLine Component just like you do with the default vue-chartjs charts.
export default {
  extends: CustomLine,
  props: {
    updateStatus: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  computed: {
  },
  watch: {
    updateStatus () {
      this.setMixChart()
    }
  },
  data () {
    return {
      // updateStatus: props.updateStatus
    }
  },
  methods: {
    getChartlabels () {
      const labels = []
      this.updateStatus.forEach(row => {
        labels.push(row.updateDate)
      })
      return labels
    },
    getChartData () {
      const data = []
      this.updateStatus.forEach(row => {
        data.push(row.updateCount)
      })
      return data
    },
    setMixChart () {
      const getLabels = this.getChartlabels()
      const getDatas = this.getChartData()

      this.renderChart(
        {
          labels: getLabels,
          datasets: [
            {
              type: 'line',
              data: getDatas,
              borderColor: '#9ac7db',
              backgroundColor: 'rgba(154,199,219,0.5)',
              lineTension: 0
            }
          ]
        },
        {
          maintainAspectRatio: false, // option 추가
          legend: false,
          tooltips: {
            enabled: true
          },
          scales: {
            xAxes: [{
              gridLines: {
                display: false
              },
              ticks: {
                fontColor: '#4d4f5c', // 폰트컬러
                fontSize: 11 // 폰트사이즈,
              }
            }],
            yAxes: [{
              gridLines: {
                color: '#c6c6c6',
                zeroLineWidth: 0
              },
              ticks: {
                fontColor: '#4d4f5c',
                fontSize: 11,
                suggestedMax: 80
              }
            }]
          }
        }
      )
    }
  },
  mounted () {
    if (this.updateStatus !== undefined) {
      this.setMixChart()
    } else {
    }
  }
}
</script>
