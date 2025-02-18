<template>
  <v-card class="my-2 px-1 py-2" id="result-container" :class="{ captured: capturing }">
    <div class="d-flex pb-1">
      <div class="pl-2 align-self-center">Simulation Results</div>
      <v-spacer></v-spacer>
      <v-tooltip bottom color="black">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon @click="reflesh" v-bind="attrs" v-on="on">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </template>
        <span>Simulate again</span>
      </v-tooltip>
      <v-tooltip bottom color="black">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon @click="captureResult" v-bind="attrs" v-on="on">
            <v-icon>mdi-camera</v-icon>
          </v-btn>
        </template>
        <span>Save screenshot</span>
      </v-tooltip>
      <v-tooltip bottom color="black">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon @click="handleMinimize(true)" v-bind="attrs" v-on="on">
            <v-icon>mdi-minus</v-icon>
          </v-btn>
        </template>
        <span>Minimize</span>
      </v-tooltip>
    </div>
    <v-divider class="mb-3"></v-divider>
    <v-alert border="left" dense outlined type="info" class="ma-3 body-2" v-if="!moreCalculateRequested && !capturing">
      <div class="d-flex">
        <div class="align-self-center">Displaying the simulation result for {{ calculateCount.toLocaleString() }} sorties.</div>
        <div class="align-self-center ml-2">
          <v-btn small color="info" @click="calculateMore()" :disabled="moreCalculateRequested">Simulate with increased accuracy</v-btn>
        </div>
      </div>
    </v-alert>
    <v-alert border="left" dense outlined type="warning" class="ma-3 body-2" v-if="existUnknownEnemy">
      <div>This simulation includes enemies who have unconfirmed AS values. The results may differ from the actual AS conditions.</div>
    </v-alert>
    <div class="px-3">
      <div class="d-flex">
        <div class="body-2 px-2">Changes on Aircraft deployed through the sortie</div>
        <div class="caption ml-auto" v-show="!capturing">※ Click on a line to show detailed calculations.</div>
      </div>
      <table>
        <thead>
          <tr>
            <th class="text-center">Shipgirl</th>
            <th class="text-center">Aircraft</th>
            <th v-for="i in battleCount" :key="i" :class="`td-battle${i - 1}`">Node {{ i }}</th>
            <th>After the Sortie</th>
            <th class="pr-1">Deplaning Rate</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(ship, i) in tableData">
            <tr v-for="(item, j) in ship.items" :key="`${i}-${j}`" class="cursor-pointer" @click="clickedShipRow(ship.index)">
              <td class="td-ship-name" v-if="j === 0" :rowspan="ship.items.length">{{ ship.name }}</td>
              <td :class="`text-left d-flex item-input type-${item.data.iconTypeId}`">
                <div class="d-none d-sm-block px-0 px-md-1">
                  <v-img :src="`./img/type/icon${item.data.iconTypeId}.png`" height="20" width="20"></v-img>
                </div>
                <div class="align-self-center item-name text-truncate">{{ item.data.name }}</div>
              </td>
              <td v-for="k in battleCount" :key="k" class="pr-md-1" :class="`td-battle${k - 1}`">{{ item.slotHistories[k - 1] }}</td>
              <td class="pr-md-1">{{ item.slotResult }}</td>
              <td class="pr-1">{{ item.deathRate > 0 ? `${item.deathRate} %` : "-" }}</td>
            </tr>
          </template>
          <tr>
            <td class="text-center" rowspan="2">Air Power (Average)</td>
            <td class="text-center py-1">Allied Fleet</td>
            <td v-for="(result, i) in results" :key="i" class="pr-md-1" :class="`td-battle${i}`">{{ result.avgAirPower }}</td>
            <td class="text-center header-td" colspan="2">Consumption Prediction</td>
          </tr>
          <tr>
            <td class="text-center py-1">Enemy Fleet</td>
            <td v-for="(result, i) in results" :key="i" class="pr-md-1" :class="`td-battle${i}`">
              <span :class="{ 'orange--text text--darken-2': result.isUnknownEnemyAirPower }">
                {{ result.avgEnemyAirPower }}
                {{ result.isUnknownEnemyAirPower ? "?" : "" }}
              </span>
            </td>
            <td colspan="2" rowspan="2">
              <div class="flex-grow-1 d-flex flex-column">
                <div class="d-flex mx-auto">
                  <div><v-img :src="`./img/util/bauxite.png`" height="20" width="20"></v-img></div>
                  <div class="ml-1">{{ calcBauxite }}</div>
                </div>
                <div class="d-flex mx-auto" v-if="calcSteel !== '0'">
                  <div><v-img :src="`./img/util/steel.png`" height="20" width="20"></v-img></div>
                  <div class="ml-1">{{ calcSteel }}</div>
                </div>
              </div>
            </td>
          </tr>
          <tr class="tr-status">
            <td class="text-center" colspan="2">Air State</td>
            <td v-for="(result, i) in results" :key="i" :class="`td-battle${i}`">
              <span :class="`state-label state-${result.airState.value}`">{{ result.airState.text }}</span>
            </td>
          </tr>
          <tr class="tr-status tr-fuel-ammo">
            <td class="text-center" colspan="2">Fuel &amp; Ammo</td>
            <td v-for="(row, i) in remainingFuelAndAmmos" :key="i" :class="`td-battle${i}`">
              <div
                class="d-flex flex-wrap justify-end"
                @mouseenter="bootTooltip(row.fuel.value, row.ammo.value, $event)"
                @mouseleave="clearTooltip"
              >
                <div class="d-flex">
                  <v-img :src="`./img/util/fuel.png`" height="20" width="20" />
                  <div class="align-self-center ml-0_5" :class="row.fuel.color">{{ row.fuel.value }}%</div>
                </div>
                <div class="d-flex">
                  <v-img :src="`./img/util/ammo.png`" height="20" width="20" />
                  <div class="align-self-center ml-0_5" :class="row.ammo.color">{{ row.ammo.value }}%</div>
                </div>
              </div>
            </td>
            <td colspan="2" class="border-top-none">
              <div class="d-flex flex-wrap justify-center">
                <div class="d-flex">
                  <v-img :src="`./img/util/fuel.png`" height="20" width="20" />
                  <div class="align-self-center ml-1">{{ sumFuelAndAmmo[0] }}</div>
                </div>
                <div class="d-flex">
                  <v-img :src="`./img/util/ammo.png`" height="20" width="20" />
                  <div class="align-self-center ml-1">{{ sumFuelAndAmmo[1] }}</div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <v-divider></v-divider>
    </div>
    <v-tabs v-model="tab" class="px-3">
      <v-tab v-for="(enemyFleet, i) in battles" :key="i" :href="`#battle${i}`" @click="changedTab(i)">Node {{ i + 1 }}</v-tab>
    </v-tabs>
    <v-divider class="mx-3"></v-divider>
    <v-card class="ma-3 py-3 pr-4 pl-2">
      <div class="d-flex mt-1">
        <div class="bar-label"></div>
        <div class="flex-grow-1 d-flex">
          <div class="status-bar-label" style="width: 10%">
            <div>AI</div>
          </div>
          <div class="status-bar-divide"></div>
          <div class="status-bar-label" style="width: 10%">
            <div>AD</div>
          </div>
          <div class="status-bar-divide"></div>
          <div class="status-bar-label" style="width: 25%">
            <div>AP</div>
          </div>
          <div class="status-bar-divide"></div>
          <div class="status-bar-label" style="width: 45%">
            <div>AS</div>
          </div>
          <div class="status-bar-divide"></div>
          <div class="status-bar-label" style="width: 10%">
            <div>AS+</div>
          </div>
        </div>
      </div>
      <div v-for="(ab, i) in airbaseWaveResults" :key="i" class="pb-1 cursor-pointer" @click="clickedAirbaseRow(ab.baseIndex)">
        <div class="d-flex">
          <div class="bar-label">{{ ab.text }}</div>
          <div class="align-self-center flex-grow-1">
            <air-status-result-bar :result="ab.result" :no-label="true"></air-status-result-bar>
          </div>
        </div>
      </div>
      <div class="d-flex mt-2">
        <div class="bar-label">Main Fleet</div>
        <div class="align-self-center flex-grow-1">
          <air-status-result-bar :result="fleet.mainResult" :no-label="true"></air-status-result-bar>
        </div>
      </div>
    </v-card>
    <v-card class="ma-3 py-3 px-2">
      <div class="body-2 px-2 mb-1">Air State probabilities for each phase</div>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Air Power</th>
            <th>Enemy Air Power ( AS+ / AS / AP / AD )</th>
            <th class="pr-sm-1">AS+</th>
            <th class="pr-sm-1">AS</th>
            <th class="pr-sm-1">AP</th>
            <th class="pr-sm-1">AD</th>
            <th class="pr-sm-1">AI</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ab, i) in airbaseWaveResults" :key="`${i}`" class="cursor-pointer" @click="clickedAirbaseRow(ab.baseIndex)">
            <td>{{ ab.text }}</td>
            <td>{{ ab.result.avgAirPower }}</td>
            <td>{{ airPowerBorders(ab.result.avgEnemyAirPower) }}</td>
            <td v-for="(rate, j) in ab.result.rates" :key="`${i}-${j}`" class="pr-sm-1 py-1">
              <span v-if="rate">{{ rate }} %</span>
              <span v-else-if="j < 5">-</span>
            </td>
          </tr>
          <tr>
            <td>Main Fleet</td>
            <td>{{ fleet.mainResult.avgAirPower }}</td>
            <td>{{ airPowerBorders(fleet.mainResult.avgEnemyAirPower) }}</td>
            <td v-for="(rate, i) in fleet.mainResult.rates" :key="i" class="pr-sm-1 py-1">
              <span v-if="rate">{{ rate }} %</span>
              <span v-else-if="i < 5">-</span>
            </td>
          </tr>
        </tbody>
      </table>
      <v-divider></v-divider>
    </v-card>
    <v-card class="ma-3 pb-3 px-2">
      <div class="d-flex mb-1">
        <div class="body-2 px-2 align-self-end">Remaining Enemy Aircraft</div>
        <div class="ml-auto">
          <v-select
            class="form-input"
            v-model="fleet.formation"
            :items="formations"
            hide-details
            dense
            @change="changedFormation(fleet.formation)"
          ></v-select>
        </div>
        <v-tooltip bottom color="black">
          <template v-slot:activator="{ on, attrs }">
            <v-icon class="align-self-center pt-2 mr-1" small v-bind="attrs" v-on="on">mdi-help-circle-outline</v-icon>
          </template>
          <div class="caption">
            <div>Select the Main Fleet's formation here</div>
          </div>
        </v-tooltip>
      </div>
      <table>
        <thead>
          <tr>
            <th class="text-center">Enemy Ship</th>
            <th class="text-center">Aircraft</th>
            <th>Initial Slot Size</th>
            <th>Average Slot Size</th>
            <th>Deplaning Rate</th>
            <th>Disabled Rate</th>
            <th class="pr-1" v-if="!capturing">Details</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(row, i) in enemyTableData">
            <tr v-for="(item, j) in row.items" :key="`${i}-${j}`">
              <td class="td-enemy-name text-truncate" v-if="j === 0" :rowspan="row.items.length">{{ row.enemy.data.name }}</td>
              <td :class="`text-left d-flex item-input type-${item.data.iconTypeId}`">
                <div class="d-none d-sm-block px-0 px-md-1">
                  <v-img :src="`./img/type/icon${item.data.iconTypeId}.png`" height="20" width="20"></v-img>
                </div>
                <div class="align-self-center item-name py-1 text-truncate">{{ item.data.name }}</div>
              </td>
              <td>{{ item.fullSlot }}</td>
              <td>{{ item.slotResult }}</td>
              <td>{{ item.deathRate > 0 ? `${item.deathRate} %` : "-" }}</td>
              <td class="pr-1" v-if="j === 0" :rowspan="row.items.length">
                {{ row.allDeathRate > 0 ? `${row.allDeathRate} %` : "-" }}
              </td>
              <td v-if="j === 0 && !capturing" :rowspan="row.items.length">
                <v-btn color="info" icon small @click="viewDetail(row.enemy, row.index)">
                  <v-icon>mdi-information-outline</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <v-divider></v-divider>
    </v-card>
    <v-card class="ma-3 py-3 px-2">
      <div class="body-2 px-2">Support Fleet</div>
      <table>
        <thead>
          <tr>
            <th class="text-left py-1 pl-3">Fleet</th>
            <th class="text-left">Support Type</th>
            <th>Air Power</th>
            <th>Enemy Air Power ( AS+ / AS / AP / AD )</th>
            <th class="pr-2">AS+</th>
            <th class="pr-2">AS</th>
            <th class="pr-2">AP</th>
            <th class="pr-2">AD</th>
            <th class="pr-2">AI</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in supportsTableRow" :key="`support_${i}`">
            <td class="text-left py-2 pl-3">{{ row.name }}</td>
            <td class="text-left">{{ row.typeName }}</td>
            <td>{{ row.airPower }}</td>
            <td>{{ row.enemyAirPower }}</td>
            <td v-for="(rate, j) in row.rates" :key="`support_row${i}_rate${j}`" class="pr-2">
              <span v-if="rate">{{ rate }} %</span>
              <span v-else>-</span>
            </td>
          </tr>
        </tbody>
      </table>
      <v-divider></v-divider>
      <div class="pl-2 caption mt-1">※ The Air Power values are exclusive to Aerial Support. It's not affected by Proficiency or Improvements.</div>
      <div class="pl-2 caption">※ The Enemy Air Power value is the average Air Power after the Main Fleet air battle.</div>
    </v-card>
    <v-dialog width="1200" v-model="detailDialog" transition="scroll-x-transition" @input="toggleDetailDialog">
      <v-card>
        <div class="d-flex pt-2 pb-1 pr-2">
          <div class="align-self-center ml-3">Detailed Calculations</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDetail">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <v-divider></v-divider>
        <plane-detail-result
          v-if="!destroyDialog && detailParent"
          :parent="detailParent"
          :index="detailIndex"
          :fleetIndex="detailFleetIndex"
        />
      </v-card>
    </v-dialog>
    <v-tooltip
      v-model="enabledTooltip"
      color="black"
      bottom
      right
      transition="slide-y-transition"
      :position-x="tooltipX"
      :position-y="tooltipY"
    >
      <div>
        <table class="border-top-none body-2">
          <tr>
            <td class="border-top-none py-1 d-flex">
              <v-img :src="`./img/util/fuel.png`" height="20px" width="20px" />
              <div class="ml-1 align-self-center">Fuel Penalty⠀⠀</div>
            </td>
            <td class="border-top-none pl-5">{{ fuelCorr }}</td>
          </tr>
          <tr>
            <td class="border-top-none py-1 d-flex">
              <v-img :src="`./img/util/ammo.png`" height="20" width="20" />
              <div class="ml-1 align-self-center">Ammo Penalty</div>
            </td>
            <td class="border-top-none pl-5">{{ ammoCorr }}</td>
          </tr>
        </table>
      </div>
    </v-tooltip>
  </v-card>
</template>

<style scoped>
.v-timeline-item {
  padding-bottom: 8px;
}
.cursor-pointer {
  cursor: pointer;
}

table {
  font-size: 0.75em;
  text-align: right;
  width: 100%;
  border-top: 1px solid rgba(128, 128, 128, 0.4);
  border-collapse: separate;
  border-spacing: 0;
}
table thead th {
  padding: 0.2rem 0;
}
table thead tr {
  background-color: rgba(128, 128, 128, 0.1);
}

table th {
  opacity: 0.8;
}
table tr td {
  border-top: 1px solid rgba(128, 128, 128, 0.25);
}
table.border-top-none,
table tr td.border-top-none {
  border-top: none;
}

table tbody tr:hover {
  background-color: rgba(128, 128, 128, 0.05);
}
.td-ship-name {
  font-size: 12px;
  text-align: center;
  width: 100px;
}
.td-enemy-name {
  font-size: 12px;
  text-align: center;
}
.td-battle0 {
  border-left: 1px solid rgba(128, 128, 128, 0.4);
}
td.item-input {
  border-left: none !important;
  border-right: none !important;
  border-bottom: none !important;
  border-top: 1px solid rgba(128, 128, 128, 0.25) !important;
  margin: 0 !important;
  padding-top: 2px;
  padding-bottom: 2px;
}
.item-name {
  flex-grow: 1;
  font-size: 0.9em;
  width: 85px;
}

.tr-status {
  height: 25px;
}
.tr-status td {
  position: relative;
}
.tr-fuel-ammo td {
  cursor: default;
}
.ml-0_5 {
  margin-left: 2px;
}
.fuel-warning {
  font-weight: 700;
  color: rgb(240, 164, 0);
}
.fuel-warning1 {
  font-weight: 700;
  color: rgb(255, 123, 0);
}
.fuel-warning2 {
  font-weight: 700;
  color: rgb(255, 94, 0);
}
.fuel-warning3 {
  font-weight: 700;
  color: rgb(255, 60, 0);
}
.fuel-warning4 {
  font-weight: 700;
  color: rgb(255, 0, 0);
}

.state-label {
  position: absolute;
  text-align: center;
  font-size: 12px;
  padding: 1px 0;
  width: 42px;
  border-radius: 0.25rem;
  right: 0px;
  bottom: 1px;
}
.state-0 {
  border: 1px solid rgba(76, 175, 80, 0.6);
  box-shadow: inset 0 0 12px rgba(76, 175, 80, 0.6);
}
.state-1 {
  border: 1px solid rgba(139, 195, 74, 0.6);
  box-shadow: inset 0 0 12px rgba(139, 195, 74, 0.6);
}
.state-2 {
  border: 1px solid rgba(249, 217, 37, 0.6);
  box-shadow: inset 0 0 12px rgba(249, 217, 37, 0.6);
}
.state-3 {
  border: 1px solid rgba(239, 143, 0, 0.6);
  box-shadow: inset 0 0 12px rgba(239, 143, 0, 0.6);
}
.state-4 {
  border: 1px solid rgba(244, 67, 54, 0.6);
  box-shadow: inset 0 0 12px rgba(244, 67, 54, 0.6);
}

.header-td {
  background-color: rgba(128, 128, 128, 0.1);
}

.bar-label {
  text-align: center;
  font-size: 12px;
  width: 78px;
  margin-right: 0.25rem;
}

.status-bar-label {
  margin-bottom: 2px;
  text-align: center;
  border-bottom: 1px solid #888;
  position: relative;
}
.status-bar-label > div {
  opacity: 0.8;
  bottom: -2px;
  width: 100%;
  font-size: 11px;
  white-space: nowrap;
  position: absolute;
}
.status-bar-divide {
  align-self: flex-end;
  height: 10px;
  border-right: 1px solid #888;
  margin-bottom: 2px;
}

.form-input {
  width: 120px;
}

#result-container.captured {
  width: 1000px !important;
  background: #fff !important;
  border: 1px solid #bbb;
  border-radius: 0.25rem;
}
.theme--dark #result-container.captured {
  background: rgb(40, 40, 45) !important;
  border: 1px solid #444;
}
.deep-sea .theme--dark #result-container.captured {
  background: rgb(8, 18, 42) !important;
}
.captured .v-card {
  box-shadow: none !important;
  border: 1px solid #bbb;
}
.theme--dark .captured .v-card {
  border: 1px solid #444;
}
</style>

<script lang="ts">
import Vue from 'vue';
import html2canvas from 'html2canvas';
import AirStatusResultBar from '@/components/result/AirStatusResultBar.vue';
import PlaneDetailResult from '@/components/result/PlaneDetailResult.vue';
import CalcManager from '@/classes/calcManager';
import EnemyFleet from '@/classes/enemy/enemyFleet';
import Fleet from '@/classes/fleet/fleet';
import AirCalcResult from '@/classes/airCalcResult';
import Item from '@/classes/item/item';
import Const, { AB_MODE, Formation, SUPPORT_TYPE } from '@/classes/const';
import CommonCalc from '@/classes/commonCalc';
import Airbase from '@/classes/airbase/airbase';
import Enemy from '@/classes/enemy/enemy';
import Ship from '@/classes/fleet/ship';
import Convert from '@/classes/convert';

export default Vue.extend({
  name: 'MainResult',
  components: {
    AirStatusResultBar,
    PlaneDetailResult,
  },
  props: {
    value: {
      type: CalcManager,
      required: true,
    },
    handleChangeMainBattle: {
      type: Function,
      required: true,
    },
    handleChangeFormation: {
      type: Function,
      required: true,
    },
    handleMoreCalculate: {
      type: Function,
      required: true,
    },
    handleMinimize: {
      type: Function,
      required: true,
    },
    calculateCount: {
      type: Number,
      default: 5000,
    },
  },
  data: () => ({
    tab: 'battle0',
    displayBattle: 0,
    destroyDialog: false,
    detailDialog: false,
    detailParent: undefined as Ship | Enemy | Airbase | undefined,
    detailIndex: 0,
    detailFleetIndex: 0,
    capturing: false,
    moreCalculateRequested: false,
    enabledTooltip: false,
    tooltipTimer: undefined as undefined | number,
    tooltipX: 0,
    tooltipY: 0,
    fuelCorr: '',
    ammoCorr: '',
  }),
  computed: {
    formations(): Formation[] {
      return Const.FORMATIONS;
    },
    airbaseWaveResults(): { text: string; result: AirCalcResult; baseIndex: number }[] {
      const waveResults: { text: string; result: AirCalcResult; baseIndex: number }[] = [];
      for (let i = 0; i < this.value.airbaseInfo.airbases.length; i += 1) {
        const airbase = this.value.airbaseInfo.airbases[i];

        if (airbase.mode !== AB_MODE.BATTLE) {
          continue;
        }

        if (airbase.battleTarget[0] === this.displayBattle) {
          waveResults.push({ text: `Land Base ${i + 1} 1st Wave`, result: airbase.resultWave1, baseIndex: i });
        }
        if (airbase.battleTarget[1] === this.displayBattle) {
          waveResults.push({ text: `Land Base ${i + 1} 2nd Wave`, result: airbase.resultWave2, baseIndex: i });
        }
      }

      return waveResults;
    },
    fleet(): Fleet {
      return this.value.fleetInfo.mainFleet;
    },
    airbases(): Airbase[] {
      return this.value.airbaseInfo.airbases;
    },
    enabledAirbase(): { airbase: Airbase; index: number }[] {
      const target = this.value.mainBattle;
      const airbases = [];
      for (let i = 0; i < this.value.airbaseInfo.airbases.length; i += 1) {
        const airbase = this.value.airbaseInfo.airbases[i];
        if (airbase.mode === AB_MODE.BATTLE && airbase.battleTarget.includes(target)) {
          airbases.push({ airbase, index: i });
        }
      }
      return airbases;
    },
    tableData(): { name: string; items: Item[]; index: number }[] {
      const fleet = this.value.fleetInfo.mainFleet;
      const ships = [];

      const activeShips = fleet.ships.filter((v) => v.isActive && !v.isEmpty);
      for (let i = 0; i < activeShips.length; i += 1) {
        const planes = activeShips[i].items.filter((v) => v.data.isPlane);
        if (planes.length) {
          ships.push({ name: activeShips[i].data.name, items: planes, index: i });
        }
      }
      return ships;
    },
    enemyTableData(): { enemy: Enemy; items: Item[]; allDeathRate: number; index: number }[] {
      const fleet = this.value.battleInfo.fleets[this.value.mainBattle];
      const enemies = [];

      for (let i = 0; i < fleet.enemies.length; i += 1) {
        const enemy = fleet.enemies[i];
        const planes = enemy.items.filter((v) => v.data.isPlane && !v.data.isRecon);
        if (planes.length) {
          let allDeathRate = 1;
          for (let j = 0; j < planes.length; j += 1) {
            const plane = planes[j];
            if (plane.data.isAttacker) {
              allDeathRate *= plane.deathRate / 100;
              plane.deathRate = Math.round(plane.deathRate);
            }
          }
          enemies.push({
            enemy,
            items: planes,
            allDeathRate: Math.floor(1000 * allDeathRate) / 10,
            index: i,
          });
        }
      }
      return enemies;
    },
    supportsTableRow(): { name: string }[] {
      const rows = [];
      const fleets = this.value.fleetInfo.fleets.filter((v, i) => i < 4);
      const mainIndex = this.value.fleetInfo.mainFleetIndex;
      for (let i = 0; i < fleets.length; i += 1) {
        // 出撃中のやつは出撃中フラグを建てる
        let isMainFleet = false;
        if (i === mainIndex || (this.value.fleetInfo.isUnion && mainIndex <= 1 && i <= 1)) {
          isMainFleet = true;
        }

        const fleet = fleets[i];
        const types = fleet.supportTypes;

        const needResult = types.includes(SUPPORT_TYPE.AIRSTRIKE) || types.includes(SUPPORT_TYPE.ANTI_SUBMARINE);
        const result = fleet.results.find((v) => v.supportRates.some((w) => w > 0));

        const rates = needResult && result ? result.supportRates.map((v) => Math.round(10 * v) / 10) : [0, 0, 0, 0, 0];
        const avg = needResult && result ? Math.round(result.loopSumEnemySupportAirPower) : 0;
        const enemyAirPower = avg ? `${avg}（ ${CommonCalc.getAirStatusBorder(avg).slice(0, 4).join(' / ')} ）` : '';
        rows.push({
          name: `Fleet ${i + 1}`,
          typeName: fleet.getSupportTypeName(),
          airPower: fleet.supportAirPower,
          enemyAirPower,
          rates: rates.slice(0, 5),
          isMainFleet,
        });
      }

      return rows;
    },
    battles(): EnemyFleet[] {
      return this.value.battleInfo.fleets;
    },
    battleCount(): number {
      return this.value.battleInfo.battleCount;
    },
    results(): AirCalcResult[] {
      return this.value.fleetInfo.mainFleet.results;
    },
    calcBauxite(): string {
      return (5 * this.value.fleetInfo.mainFleet.mainResult.avgDownSlot).toFixed();
    },
    calcSteel(): string {
      return this.value.fleetInfo.mainFleet.mainResult.avgUsedSteels.toFixed();
    },
    airPowerBorders: () => (airPower: number) => `${airPower}（ ${CommonCalc.getAirStatusBorder(airPower).slice(0, 4).join(' / ')} ）`,
    consumptions(): number[][] {
      return this.value.battleInfo.getResourceConsumptions(this.$store.state.maps);
    },
    remainingFuelAndAmmos(): { fuel: { value: number; color: string }; ammo: { value: number; color: string } }[] {
      // 残りの燃料弾薬を計算 表示用
      const values = [[100, 100]];
      const array = this.consumptions;
      for (let i = 0; i < array.length - 1; i += 1) {
        values.push([Math.max(values[i][0] - array[i][0], 0), Math.max(values[i][1] - array[i][1], 0)]);
      }

      const remainings = [];
      for (let i = 0; i < values.length; i += 1) {
        const fuel = values[i][0];
        const ammo = values[i][1];
        remainings.push({
          fuel: { value: fuel, color: this.getFuelTextColor(fuel) },
          ammo: { value: ammo, color: this.getAmmoTextColor(ammo) },
        });
      }
      return remainings;
    },
    sumFuelAndAmmo(): number[] {
      const ships = this.fleet.ships
        .filter((v) => v.isActive && !v.isEmpty)
        .map((v) => Object.assign(v, { consumptionFuel: 0, consumptionAmmo: 0, consumptionAmmo2: 0 }));
      const array = this.consumptions;
      for (let i = 0; i < array.length; i += 1) {
        const isLast = i === array.length - 1;
        // この戦闘で消費する燃料弾薬 %
        const fuelConsumptionRate = array[i][0] / 100;
        const ammoConsumptionRate = array[i][1] / 100;
        for (let j = 0; j < ships.length; j += 1) {
          const { fuel, ammo } = ships[j].data;
          // 消費記録
          if (fuelConsumptionRate) {
            ships[j].consumptionFuel += Math.max(Math.floor(fuel * fuelConsumptionRate), 1);
          }
          if (ammoConsumptionRate) {
            ships[j].consumptionAmmo += Math.max(Math.floor(ammo * ammoConsumptionRate), 1);
            if (isLast) {
              // todo 最終戦闘 夜戦した時の消費の仕様
              ships[j].consumptionAmmo2 += Math.max(Math.floor(ammo * ammoConsumptionRate), 1);
            } else {
              ships[j].consumptionAmmo2 += Math.max(Math.floor(ammo * ammoConsumptionRate), 1);
            }
          }
        }
      }

      let sumFuel = 0;
      let sumAmmo = 0;
      for (let j = 0; j < ships.length; j += 1) {
        const isMarige = ships[j].level > 99;
        const { consumptionFuel, consumptionAmmo, data } = ships[j];
        // 消費記録
        if (consumptionFuel) {
          if (consumptionFuel < data.fuel) {
            sumFuel += Math.max(Math.floor(consumptionFuel * (isMarige ? 0.85 : 1)), 1);
          } else {
            sumFuel += Math.max(Math.floor(data.fuel * (isMarige ? 0.85 : 1)), 1);
          }
        }

        if (consumptionAmmo) {
          if (consumptionAmmo < data.ammo) {
            sumAmmo += Math.max(Math.floor(consumptionAmmo * (isMarige ? 0.85 : 1)), 1);
          } else {
            sumAmmo += Math.max(Math.floor(data.ammo * (isMarige ? 0.85 : 1)), 1);
          }
        }
      }
      return [sumFuel, sumAmmo];
    },
    existUnknownEnemy(): boolean {
      return this.value.battleInfo.fleets.some((v) => v.existUnknownEnemy);
    },
  },
  methods: {
    reflesh() {
      this.handleChangeMainBattle(this.displayBattle);
    },
    changedTab(index: number) {
      if (this.displayBattle === index) {
        return;
      }

      if (index >= 0) {
        this.displayBattle = index;
      } else {
        this.displayBattle = this.battles.length - 1;
      }

      this.handleChangeMainBattle(this.displayBattle);
    },
    changedFormation(formation: number) {
      this.handleChangeFormation(formation);
    },
    calculateMore() {
      this.moreCalculateRequested = true;
      this.handleMoreCalculate();
    },
    clickedAirbaseRow(index: number) {
      this.viewDetail(this.airbases[index], index);
    },
    clickedShipRow(index: number) {
      const fleet = this.value.fleetInfo.mainFleet;
      const activeShips = fleet.ships.filter((v) => v.isActive && !v.isEmpty);
      const ship = activeShips[index];

      const shipIndex = fleet.ships.findIndex((v) => v === ship);
      if (shipIndex >= 0) {
        this.detailFleetIndex = this.value.fleetInfo.mainFleetIndex;
        this.viewDetail(ship, shipIndex);
      }
    },
    viewDetail(parent: Enemy | Ship | Airbase, index: number): void {
      this.detailParent = parent;
      this.detailIndex = index;
      if (parent instanceof Enemy) {
        this.detailFleetIndex = this.displayBattle;
      }
      this.destroyDialog = false;
      this.detailDialog = true;
    },
    closeDetail() {
      this.detailDialog = false;
      setTimeout(() => {
        this.detailParent = undefined;
      }, 100);
    },
    toggleDetailDialog() {
      if (!this.detailDialog) {
        this.closeDetail();
      } else {
        this.destroyDialog = false;
      }
    },
    captureResult() {
      // 背景色とかを塗るフラグ立て
      this.capturing = true;
      const div = document.getElementById('result-container') as HTMLDivElement;
      setTimeout(() => {
        html2canvas(div, { scale: 2 }).then((canvas) => {
          const link = document.createElement('a');
          link.href = canvas.toDataURL();
          link.download = `result_${Convert.formatDate(new Date(), 'yyyyMMdd-HHmmss')}.jpg`;
          link.click();
          this.capturing = false;
        });
      }, 10);
    },
    getFuelTextColor(value: number): string {
      if (value <= 10) {
        return 'fuel-warning4';
      }
      if (value <= 20) {
        return 'fuel-warning3';
      }
      if (value <= 30) {
        return 'fuel-warning2';
      }
      if (value <= 50) {
        return 'fuel-warning1';
      }
      if (value < 75) {
        return 'fuel-warning';
      }
      return 'fuel-normal';
    },
    getAmmoTextColor(value: number): string {
      if (value <= 15) {
        return 'fuel-warning4';
      }
      if (value <= 25) {
        return 'fuel-warning3';
      }
      if (value <= 35) {
        return 'fuel-warning2';
      }
      if (value <= 40) {
        return 'fuel-warning1';
      }
      if (value < 50) {
        return 'fuel-warning';
      }
      return 'fuel-normal';
    },
    bootTooltip(fuel: number, ammo: number, e: MouseEvent) {
      this.tooltipTimer = window.setTimeout(() => {
        this.tooltipX = e.clientX;
        this.tooltipY = e.clientY;
        this.enabledTooltip = true;

        this.fuelCorr = fuel < 75 ? `Evasion -${75 - fuel}` : 'None';
        this.ammoCorr = ammo < 50 ? `Damage x${(ammo * 2) / 100}` : 'None';
      }, 400);
    },
    clearTooltip() {
      this.enabledTooltip = false;
      window.clearTimeout(this.tooltipTimer);
    },
  },
});
</script>
