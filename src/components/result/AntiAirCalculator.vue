<template>
  <div class="mt-2">
    <div class="d-flex flex-wrap">
      <div class="form-control">
        <v-select label="Formation" v-model="formation" :items="formations" hide-details outlined dense @change="updateTable"></v-select>
      </div>
      <div class="form-control">
        <v-select label="AACI" v-model="cutInId" :items="antiAirItems" hide-details outlined dense @change="updateTable"></v-select>
      </div>
      <div class="form-control">
        <v-text-field
          type="number"
          v-model.number="attackerSlot"
          min="0"
          max="999"
          label="Slot Size"
          hide-details
          outlined
          dense
          @input="updateTable"
        ></v-text-field>
      </div>
      <div class="form-control">
        <v-select label="AA Resist" v-model="avoid" :items="avoids" hide-details outlined dense @change="updateTable"></v-select>
      </div>
      <div class="form-control">
        <v-text-field
          type="number"
          min="0"
          max="2"
          step="0.1"
          v-model.number="adj1"
          label="Ship AA Resist"
          hide-details
          outlined
          dense
          :disabled="!isManual"
          @input="updateTable"
        ></v-text-field>
      </div>
      <div class="form-control">
        <v-text-field
          type="number"
          min="0"
          max="2"
          step="0.1"
          v-model.number="adj2"
          label="Fleet AA Resist"
          hide-details
          outlined
          dense
          :disabled="!isManual"
          @input="updateTable"
        ></v-text-field>
      </div>
    </div>
    <div class="mb-1 d-flex px-1">
      <div class="align-self-end">
        <span class="text--secondary mr-2">Fleet Adjusted AA:</span>
        <span>{{ fleetAntiAir }}</span>
      </div>
      <div class="ml-auto d-flex">
        <v-checkbox class="mr-3" label="Air Raid" v-model="isAirRaid" dense hide-details @change="updateTable"></v-checkbox>
        <v-checkbox label="Enemy" v-model="isEnemy" dense hide-details @change="updateTable"></v-checkbox>
      </div>
    </div>
    <div class="stage2-row header px-1 px-md-2">
      <div class="flex-grow-1">Ship</div>
      <div class="stage2-col">Proportional Shotdown</div>
      <div class="stage2-col">Fixed Shotdown</div>
      <div class="stage2-col">Minimum Shotdown</div>
      <div class="stage2-col">Prop + Fixed</div>
    </div>
    <div
      v-for="(item, i) in stage2Data"
      :key="i"
      class="stage2-row pr-1"
      :class="{ warn: item.sum >= attackerSlot / 2, danger: item.sum >= attackerSlot }"
    >
      <div class="d-flex flex-grow-1">
        <div class="align-self-center mr-2">
          <v-img :src="`./img/ship/${item.id}.png`" height="30" width="120"></v-img>
        </div>
        <div class="align-self-center d-none d-sm-block flex-grow-1">
          <div class="stage2-id primary--text" v-if="item.isEnemy">id:{{ item.id }}</div>
          <div class="d-flex">
            <div class="stage2-name text-truncate">{{ item.name }}</div>
          </div>
        </div>
      </div>
      <div class="stage2-col">{{ item.rate }} ({{ item.rateDown }} planes)</div>
      <div class="stage2-col">{{ item.fix }}</div>
      <div class="stage2-col">{{ item.min }}</div>
      <div class="stage2-col">{{ item.sum }}</div>
    </div>
  </div>
</template>

<style scoped>
.form-control {
  width: 136px;
  align-self: center;
  margin-top: 0.5rem;
  margin-right: 0.25rem;
}

.stage2-row {
  display: flex;
  padding-top: 1px;
  padding-bottom: 1px;
  transition: 0.1s;
  border-bottom: 1px solid rgba(128, 128, 128, 0.4);
}
.header.stage2-row {
  border-top: 1px solid rgba(128, 128, 128, 0.4);
  background-color: rgba(128, 128, 128, 0.1);
  font-size: 12px !important;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
.stage2-row:not(.header):hover {
  background-color: rgba(128, 128, 128, 0.1);
}
.stage2-row > div {
  align-self: center;
}
.stage2-col {
  width: 18%;
  text-align: right;
}
.stage2-row:not(.header) .stage2-col {
  font-size: 0.9em;
}
.stage2-id {
  font-size: 11px;
  height: 13px;
}
.stage2-name {
  flex-grow: 1;
  font-size: 12px;
  width: 10px;
}
.stage2-row.warn {
  background-color: rgba(255, 255, 10, 0.1);
}
.stage2-row.warn:hover {
  background-color: rgba(255, 255, 10, 0.2);
}
.stage2-row.danger {
  background-color: rgba(255, 0, 0, 0.1);
}
.stage2-row.danger:hover {
  background-color: rgba(255, 0, 0, 0.2);
}
</style>

<script lang="ts">
import Vue from 'vue';
import EnemyFleet from '@/classes/enemy/enemyFleet';
import Const, { AvoidType, Formation } from '@/classes/const';
import ShootDownInfo from '@/classes/aerialCombat/shootDownInfo';
import AntiAirCutIn from '@/classes/aerialCombat/antiAirCutIn';
import Enemy from '@/classes/enemy/enemy';
import Fleet from '@/classes/fleet/fleet';
import Ship from '@/classes/fleet/ship';

interface Stage2Row {
  id: number;
  name: string;
  rate: string;
  rateDown: number;
  fix: number;
  min: number;
  sum: number;
  isEnemy: boolean;
}

export default Vue.extend({
  name: 'AntiAirCalculator',
  props: {
    fleet: {
      type: [Fleet, EnemyFleet],
      required: true,
    },
  },
  data: () => ({
    formations: Const.FORMATIONS,
    formation: 1,
    avoids: Const.AVOID_TYPE,
    avoid: 0,
    attackerSlot: 18,
    adj1: 1,
    adj2: 1,
    fleetAntiAir: '0.00',
    cutInId: 0,
    isEnemy: false,
    isAirRaid: false,
    stage2Data: [] as Stage2Row[],
    colorTable: ['255, 64, 64', '64, 255, 64', '64, 64, 255', '255, 255, 64', '255, 64, 255'],
  }),
  computed: {
    ships(): Ship[] | Enemy[] {
      if (this.fleet instanceof EnemyFleet) {
        return this.fleet.enemies.filter((v) => v.data.id > 0);
      }
      return this.fleet.ships.filter((v) => v.isActive && !v.isEmpty);
    },
    isManual(): boolean {
      return this.avoid === Const.MANUAL_AVOID;
    },
    antiAirItems(): { text: string; value: number }[] {
      const items = [
        {
          text: 'None',
          value: 0,
          rate: 0,
          detail: '',
        },
      ];
      // 使えるCIだけ
      const cutIns = this.fleet.allAntiAirCutIn;
      const borders = this.fleet.shootDownList.map((v) => v.border);
      let sumRate = 0;
      for (let i = 0; i < borders.length; i += 1) {
        const border = borders[i];
        if (border === 1) {
          break;
        }

        const { id } = cutIns[i];
        // 何種CIかのテキストが欲しいがために
        const cutin = Const.ANTIAIR_CUTIN.find((v) => v.id === id);
        const rate = 100 * border - sumRate;
        sumRate += rate;

        const item = items.find((v) => v.value === id);
        if (cutin && item) {
          item.rate += rate;
        } else if (cutin) {
          items.push({
            text: cutin.text,
            value: cutin.id,
            rate,
            detail: `[ ${cutin.remarks} ]`,
          });
        }
      }

      items[0].rate = 100 - sumRate;

      const resultItems = [];
      for (let i = 0; i < items.length; i += 1) {
        const data = items[i];
        resultItems.push({ text: `${data.text}(${Math.floor(10 * data.rate) / 10}%) ${data.detail}`, value: data.value });
      }
      return resultItems;
    },
  },
  mounted() {
    this.isEnemy = this.ships[0] instanceof Enemy;
    this.formation = this.fleet.formation;
    this.updateTable();
  },
  methods: {
    updateTable(): void {
      let adj3 = 1;
      let adj4 = 1;
      const avoid = Const.AVOID_TYPE.find((v) => v.value === this.avoid);
      if (this.avoid !== Const.MANUAL_AVOID && avoid) {
        this.adj1 = avoid.c1;
        this.adj2 = avoid.c2;
        adj3 = avoid.c3;
        adj4 = avoid.c4;
      } else {
        this.adj1 = Math.min(Math.abs(this.adj1), 2);
        this.adj2 = Math.min(Math.abs(this.adj2), 2);
      }

      let formation = Const.FORMATIONS.find((v) => v.value === this.formation) as Formation;
      if (!formation) {
        // 保険で単縦を入れる
        formation = Const.FORMATIONS.find(() => true) as Formation;
      }
      const manualAvoid: AvoidType = {
        text: '',
        value: 0,
        c1: this.adj1,
        c2: this.adj2,
        c3: adj3,
        c4: adj4,
      };

      // 対空砲火テーブルを取得
      let aaci = new AntiAirCutIn();
      const cutIn = Const.ANTIAIR_CUTIN.find((v) => v.id === this.cutInId);
      if (cutIn) {
        aaci = new AntiAirCutIn(cutIn.id, cutIn.rateBonus, cutIn.c1, cutIn.c2, cutIn.rate);
      }
      const stage2 = ShootDownInfo.getStage2(this.ships, this.isEnemy, this.fleet.isUnion, formation, aaci, this.isAirRaid, manualAvoid);
      const d = stage2[stage2.length - 1];
      this.stage2Data = [];
      for (let i = 0; i < this.ships.length; i += 1) {
        const ship = this.ships[i];
        const rate = d.rateDownList[i];
        const rateDown = Math.floor(this.attackerSlot * rate);
        const fix = d.fixDownList[i];
        const min = d.minimumDownList[i];
        const isEnemy = ship instanceof Enemy;
        this.stage2Data.push({
          id: ship.data.id,
          name: ship.data.name,
          rate: `${(100 * rate).toFixed(2)}%`,
          rateDown,
          fix,
          min,
          sum: rateDown + fix + min,
          isEnemy,
        });
      }
      // 現在選択されている条件での艦隊防空値
      this.fleetAntiAir = this.fleet.getFleetAntiAir(formation, manualAvoid).toFixed(2);
    },
  },
});
</script>
