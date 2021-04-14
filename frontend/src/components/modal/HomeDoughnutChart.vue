<script>
import { Doughnut } from 'vue-chartjs'
import DoughnutChart from 'chart.js'

export default {
  extends: Doughnut,
  //  props: ['chartData'],
  methods: {
    update () {
      this.$data._chart.update()
    },
    textCenter (val) {
      DoughnutChart.pluginService.register({
        beforeDraw: function (chart) {
          const width = chart.chart.width
          const height = chart.chart.height
          var ctx = chart.chart.ctx

          ctx.restore()
          const fontSize = (height / 114).toFixed(2)
          ctx.font = fontSize + 'em sans-serif'
          ctx.textBaseline = 'middle'

          const text = val
          const textX = Math.round((width - ctx.measureText(text).width) / 2)
          const textY = height / 2

          ctx.fillText(text, textX, textY)
          ctx.save()
        }
      })

      DoughnutChart.plugins.unregister(this.chartdata)
    }
  },
  data () {
    return {
      options: {
        cutoutPercentage: 80,
        rotation: 1 * Math.PI,
        circumference: 1 * Math.PI,
        animation: {
          animationRotate: true,
          duration: 2000
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: true
        }
      },
      chartData: {
        labels: ['UPDATED', 'NOT UPDATED'],
        datasets: [
          {
            backgroundColor: ['#00D8FF', '#00FFFF'],
            data: [2000, 1000]
          }
        ]
      }
    }
  },
  mounted () {
    this.addPlugin({
      id: 'my-plugin',
      beforeDraw: function (chart) {
        var width = chart.chart.width
        var height = chart.chart.height
        var ctx = chart.chart.ctx

        ctx.restore()
        var fontSize = (height / 114).toFixed(2)
        ctx.font = fontSize + 'em sans-serif'
        ctx.textBaseline = 'middle'

        var text = '79%'
        var textX = Math.round((width - ctx.measureText(text).width) / 2)
        var textY = height / 2

        ctx.fillText(text, textX, textY)
        ctx.save()
      }
    })
    this.renderChart(this.chartData, this.options)
  }
}
</script>
