<template>
  <div class="ma-2">
    <div class="d-flex ml-5">
      <div class="align-self-center pt-3">Air State:</div>
      <div class="ml-5">
        <v-radio-group v-model="airState" row @change="changeAirState" hide-details class="py-0">
          <v-radio label="AS+" :value="0"></v-radio>
          <v-radio label="AS" :value="1"></v-radio>
          <v-radio label="AD" :value="2"></v-radio>
        </v-radio-group>
      </div>
    </div>
    <div class="graph-area">
      <div class="contact-graph">
        <doughnut-chart :data="graphData" :options="options" title-text="Enemy Single Fleet" />
      </div>
      <div class="contact-graph">
        <doughnut-chart :data="unionGraphData" :options="unionOptions" title-text="Enemy Combined Fleet" />
      </div>
      <div class="total-contact">
        <div>Total Rate</div>
        <div>{{ rates[airState].sumRate.toFixed(1) }} %</div>
      </div>
      <div class="total-contact-union">
        <div>Total Rate</div>
        <div>{{ unionRates[airState].sumRate.toFixed(1) }} %</div>
      </div>
    </div>
    <div class="contact-legends">
      <div class="d-flex" v-for="(legend, i) in graphLegends" :key="`legend${i}`">
        <div class="legend-color-label" :style="`background-color: ${legend.color}`"></div>
        <div class="ml-2">{{ legend.text }}</div>
      </div>
    </div>
    <div>Enemy Single Fleet</div>
    <div class="contact-row header-row">
      <div class="text-left">Air Power</div>
      <div>Succesful Contact Rate</div>
      <div>&times;1.2 Rate</div>
      <div>&times;1.17 Rate</div>
      <div>&times;1.12 Rate</div>
      <div>Total Rate</div>
    </div>
    <div class="contact-row" v-for="(data, i) in rates" :key="i" :class="{ selected: i === airState }">
      <div class="text-left">{{ airStatus[i] }}</div>
      <div>{{ data.startRate.toFixed(1) }} %</div>
      <div>{{ data.contact120.toFixed(1) }} %</div>
      <div>{{ data.contact117.toFixed(1) }} %</div>
      <div>{{ data.contact112.toFixed(1) }} %</div>
      <div>{{ data.sumRate.toFixed(1) }} %</div>
    </div>
    <div class="mt-2">Enemy Combined Fleet</div>
    <div class="contact-row header-row">
      <div class="text-left">Air Power</div>
      <div>Succesful Contact Rate</div>
      <div>&times;1.2 Rate</div>
      <div>&times;1.17 Rate</div>
      <div>&times;1.12 Rate</div>
      <div>Total Rate</div>
    </div>
    <div class="contact-row" v-for="(data, j) in unionRates" :key="'s' + j" :class="{ selected: j === airState }">
      <div class="text-left">{{ airStatus[j] }}</div>
      <div>{{ data.startRate.toFixed(1) }} %</div>
      <div>{{ data.contact120.toFixed(1) }} %</div>
      <div>{{ data.contact117.toFixed(1) }} %</div>
      <div>{{ data.contact112.toFixed(1) }} %</div>
      <div>{{ data.sumRate.toFixed(1) }} %</div>
    </div>
  </div>
</template>

<style scoped>
.graph-area {
  display: flex;
  position: relative;
}
.contact-graph {
  width: 50%;
  z-index: 1;
}
.contact-graph > div {
  margin-left: auto;
  margin-right: auto;
}
.total-contact,
.total-contact-union {
  text-align: center;
  position: absolute;
  width: 200px;
  top: 50%;
}
.total-contact {
  left: calc(25% - 100px);
}
.total-contact-union {
  right: calc(25% - 100px);
}
.contact-legends {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  font-size: 12px;
}
.contact-legends > div {
  width: 10%;
  min-width: 120px;
  margin-top: 1rem;
}
.legend-color-label {
  display: inline-block;
  width: 42px;
  height: 18px;
  border-radius: 0.15rem;
}
.contact-row {
  display: flex;
  font-size: 0.9em;
  text-align: right;
  padding: 0 0.25rem;
  justify-content: space-between;
  border-bottom: 1px solid rgba(128, 128, 128, 0.3);
}
.contact-row.header-row {
  border-top: 1px solid rgba(128, 128, 128, 0.4);
  border-bottom: 1px solid rgba(128, 128, 128, 0.4);
  background-color: rgba(128, 128, 128, 0.2);
  padding: 0.1rem 0.25rem;
  font-size: 0.8em;
}
.contact-row:not(.header-row):hover {
  background-color: rgba(128, 128, 128, 0.1);
}
.contact-row.selected {
  background-color: rgba(255, 255, 0, 0.1) !important;
}
.contact-row.selected:hover {
  background-color: rgba(255, 255, 0, 0.2) !important;
}
.contact-row > div {
  align-self: center;
  width: 16%;
}
</style>

<script lang="ts">
import Vue from 'vue';
import Fleet from '@/classes/fleet/fleet';
import { ContactRate } from '@/classes/interfaces/contactRate';
import DoughnutChart, { DoughnutGraphData, DoughnutGraphOption, LabelCallbackArg } from '@/components/graph/Doughnut.vue';
import EnemyFleet from '@/classes/enemy/enemyFleet';
import Airbase from '@/classes/airbase/airbase';

const contactGraphLabels = ['×1.2', '×1.17', '×1.12', 'No Contact'];
const contactGraphColors = ['rgba(100, 180, 255, 0.7)', 'rgba(80, 220, 120, 0.7)', 'rgba(255, 160, 100, 0.7)', 'rgba(128, 128, 128, 0.5)'];
const labelCallback = (c: LabelCallbackArg) => `${c.dataset.labels[c.dataIndex]}: ${c.parsed.toFixed(1)} %`;

export default Vue.extend({
  name: 'ContactRates',
  components: { DoughnutChart },
  props: {
    fleet: {
      type: [Fleet, EnemyFleet, Airbase],
      required: true,
    },
  },
  data: () => ({
    airState: 0,
    airStatus: ['AS+', 'AS', 'AD'],
    graphData: {},
    unionGraphData: {},
    rates: [] as ContactRate[],
    unionRates: [] as ContactRate[],
    options: {
      plugins: {
        legend: { display: false },
        title: { display: true, text: '' },
        tooltip: { callbacks: { label: labelCallback } },
        datalabels: { formatter: (v: number) => (v > 0 ? `${v.toFixed(1)}%` : '') },
      },
    } as DoughnutGraphOption,
    unionOptions: {
      plugins: {
        legend: { display: false },
        title: { display: true, text: '' },
        tooltip: { callbacks: { label: labelCallback } },
        datalabels: { formatter: (v: number) => (v > 0 ? `${v.toFixed(1)}%` : '') },
      },
    } as DoughnutGraphOption,
    graphLegends: [] as { text: string; color: string }[],
  }),
  created() {
    // 初期化はお早めに
    this.calculate();
  },
  methods: {
    calculate() {
      this.rates = this.fleet.getContactRates();
      this.unionRates = this.fleet.getContactRates(true);

      this.graphData = this.getGraphData(this.rates[this.airState]);
      this.unionGraphData = this.getGraphData(this.unionRates[this.airState]);

      this.graphLegends = [];
      for (let i = 0; i < 4; i += 1) {
        this.graphLegends.push({ text: contactGraphLabels[i], color: contactGraphColors[i] });
      }
    },
    changeAirState(): void {
      this.graphData = this.getGraphData(this.rates[this.airState]);
      this.unionGraphData = this.getGraphData(this.unionRates[this.airState]);
    },
    getGraphData(rate: ContactRate): DoughnutGraphData {
      const data = {
        labels: contactGraphLabels,
        datasets: [
          {
            data: [0, 0, 0, 100],
            backgroundColor: contactGraphColors,
            borderColor: '#fff',
            labels: contactGraphLabels,
          },
        ],
      };
      if (rate) {
        data.datasets[0].data = [rate.contact120, rate.contact117, rate.contact112, 100 - rate.sumRate];
      }
      return data;
    },
  },
});
</script>
