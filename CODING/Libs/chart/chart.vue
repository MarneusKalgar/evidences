<template>
  <div>
    <div
      ref="chart"
      class="pln__duration-chart"
    />
    <chart-legend :legend="legend" />
  </div>
</template>

<script>
import ChartLegend from './chart-legend'
import colors from '@/colors'

const { white, graphite, darkGraphite } = colors
const ONE_DAY_MILISECONDS = 24 * 3600 * 1000

export default {
  name: 'chart',

  inject: ['$highcharts'],

  components: {
    ChartLegend
  },

  props: {
    milestones: {
      type: Array,
      default: () => []
    },
    categories: {
      type: Array,
      default: () => []
    },
  },

  data() {
    return {
      chart: {},
      periods: {
        StartDate: {
          name: 'pln_Project_periods_rfi',
          color: colors.violet.hex
        },
        PubDate: {
          name: 'pln_Project_periods_preparation',
          color: colors.purple.hex
        },
        OfferDate: {
          name: 'pln_Project_periods_publication',
          color: colors.darkBlue.hex
        },
        AuctionDate: {
          name: 'pln_Project_periods_auction',
          color: colors.cyan.hex
        },
        SelectDate: {
          name: 'pln_Project_periods_selection',
          color: colors.lightBlue.hex
        },
        AwardDate: {
          name: 'pln_Project_periods_contracting',
          color: colors.cadetblue.hex
        }
      }
    }
  },

  computed: {
    series() {
      return this.milestones.reduce((accum, milestone, index, arr) => {
        if (index === 0) return accum

        const {color, name} = this.periods[milestone.id]
        const prev = arr[index - 1]

        accum.push({
          x: prev.dates[0].getTime(),
          x2: milestone.dates[0].getTime(),
          y: 0,
          color,
          name,
        })

        accum.push({
          x: prev.dates[1].getTime(),
          x2: milestone.dates[1].getTime(),
          y: 1,
          color,
          name,
        })

        return accum
      }, [])
    },

    legend() {
      return this.milestones
        .filter((a, i) => i !== 0) //drop first array item
        .map(milestone => {
          return this.periods[milestone.id]
        })
    },
  },

  watch: {
    series(newData) {
      this.chart.series[0].setData(newData, true, true, !true)
    },
  },

  mounted() {
    this.chartInit()
  },

  methods: {
    chartInit() {
      const moment = this.$moment
      const vm = this
      const today = this.getToday()

      const axisOpts = {
        type: 'datetime',
        gridLineWidth: 1,
        title: {
          text: ''
        },
      }

      this.chart = this.$highcharts.chart({
        chart: {
          renderTo: this.$refs.chart,
          type: 'xrange',
          zoomType: 'x'
        },

        title: {
          text: ''
        },

        xAxis: [
          {
            ...axisOpts,
            tickInterval: ONE_DAY_MILISECONDS,
            labels: {
              formatter() {
                return vm.labelFormatter(this.value)
              }
            },
            plotLines: [{
              value: today.date,
              color: darkGraphite.toRgbaString(0.6),
              width: 4,
              zIndex: 4
            }],
            plotBands: [{
              color: graphite.toRgbaString(0.2),
              from: vm.milestones[vm.milestones.length - 1].dates[0],
              to: Infinity,
              zIndex: 4,
              label: {
                text: vm.$ut('pln_Project_chart_overduePeriod'),
                verticalAlign: 'middle',
                x: 1,
                color: white.hex
              }
            }]
          },
          {
            ...axisOpts,
            linkedTo: 0,
            opposite: true,
            labels: {
              useHTML: true,
              formatter() {
                return vm.labelFormatter(this.value)
              },
            }
          },
          {
            ...axisOpts,
            tickInterval: 365 * ONE_DAY_MILISECONDS,
            offset: 40,
            linkedTo: 0,
            opposite: true,
            labels: {
              useHTML: true,
              formatter() {
                return moment(this.value).format('YYYY')
              },
            }
          }
        ],

        yAxis: {
          gridLineWidth: 0,
          title: {
            text: ''
          },
          categories: this.categories,
          reversed: true,
          tickPixelInterval: 48
        },

        series: [{
          data: [...this.series]
        }],

        plotOptions: {
          series: {
            animation: true,
            borderRadius: 4,
            dataLabels: {
              enabled: true,
              formatter() { // calc period duration
                const {x, x2} = this
                const start = x / ONE_DAY_MILISECONDS
                const end = x2 / ONE_DAY_MILISECONDS

                if ((x2 - x) < ONE_DAY_MILISECONDS) {
                  return ''
                }

                return `${Math.round(end - start)} ${vm.$ut('pln_Project_chart_days')}`
              },
              style: {
                color: white.hex,
                textOutline: 'none',
                fontWeight: 'normal'
              }
            }
          },
        },

        tooltip: {
          useHTML: true,
          backgroundColor: darkGraphite.toRgbaString(0.5),
          borderColor: darkGraphite.toRgbaString(0.1),
          formatter() {
            return `
              <div style='color: ${white.hex}'>
                ${vm.categories[this.y]}: <b>${vm.$ut(this.key)}</b>
              </div>
              <div style='color: ${white.hex}'>
                ${vm.$ut('pln_Project_chart_from')} <b>${moment(this.x).format('DD.MM.YYYY')}</b>
              </div>
              <div style='color: ${white.hex}'>
                ${vm.$ut('pln_Project_chart_to')} <b>${moment(this.x2).format('DD.MM.YYYY')}</b>
              </div>
            `
          }
        },

        legend: {
          enabled: false
        },

        credits: {
          enabled: false
        },

        time: {
          useUTC: false
        }
      })
    },

    getToday() {
      const today = this.$moment()
      return {
        date: today.startOf('day'),
        ms: today.valueOf()
      }
    },

    labelFormatter(value) {
      let label = null
      const today = this.getToday()

      this.milestones.forEach(milestone => {
        if (milestone.dates[0].getTime() === value || milestone.dates[1].getTime() === value) {
          label = value
        }
      })

      if (today.ms === value) {
        return this.$ut('pln_Project_chart_today').bold()
      }

      if (label) {
        return this.$moment(label).format('DD.MM')
      }
    },
  }
}
</script>
