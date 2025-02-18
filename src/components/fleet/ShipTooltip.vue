<template>
  <div>
    <div class="d-flex mt-1">
      <div class="align-self-center">
        <v-img :src="`./img/ship/${value.data.id}.png`" height="30" width="120"></v-img>
      </div>
      <div class="ml-3 align-self-center">
        <div class="caption">Lv: {{ value.level }}</div>
        <div class="body-2">
          <span>{{ value.data.name }}</span>
        </div>
      </div>
    </div>
    <div>
      <table>
        <tr>
          <td class="text-left">HP</td>
          <td>{{ baseHP }}</td>
          <td class="text-right">
            <template v-if="buffHP">
              <span>(</span>
              <span class="mx-1 bonus">+{{ buffHP }}</span>
              <span>)</span>
            </template>
          </td>
          <td class="text-center">/</td>
          <td>{{ value.data.maxHp }}</td>
        </tr>
        <tr v-if="value.asw">
          <td class="text-left">ASW</td>
          <td>{{ baseAsw }}</td>
          <td class="text-right">
            <template v-if="buffAsw > 0">
              <span>(</span>
              <span class="mx-1 bonus">+{{ buffAsw }}</span>
              <span>)</span>
            </template>
          </td>
          <td class="text-center">/</td>
          <td>{{ maxAsw }}</td>
        </tr>
        <tr>
          <td class="text-left">Luck</td>
          <td>{{ baseLuck }}</td>
          <td class="text-right">
            <template v-if="buffLuck">
              <span>(</span>
              <span class="mx-1 bonus">+{{ buffLuck }}</span>
              <span>)</span>
            </template>
          </td>
          <td class="text-center">/</td>
          <td>{{ maxLuck }}</td>
        </tr>
        <tr>
          <td class="text-left" colspan="3">Overkill (Taiha)</td>
          <td colspan="2">{{ taihaRate }}</td>
        </tr>
        <tr>
          <td class="text-left" colspan="3">Overkill (Chuuha)</td>
          <td colspan="2">{{ chuhaRate }}</td>
        </tr>
      </table>
      <template v-if="specialAttacks.length">
        <v-divider class="my-3"></v-divider>
        <table>
          <tr>
            <td class="caption text--secondary text-left">Special Attack</td>
            <td class="caption text--secondary px-8">AS+</td>
            <td class="caption text--secondary">AS</td>
          </tr>
          <tr v-for="(row, i) in specialAttacks" :key="`sp${i}`">
            <td class="text-left">
              <span :class="{ 'orange--text text--lighten-2': row.text !== '合計' }" label outlined>{{ row.text }}</span>
            </td>
            <td class="px-8">{{ row.rate[0] }} %</td>
            <td>{{ row.rate[1] }} %</td>
          </tr>
        </table>
      </template>
    </div>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  text-align: right;
}

.bonus {
  color: #00bfa5;
}
</style>

<script lang="ts">
import Vue from 'vue';
import sum from 'lodash/sum';
import Ship from '@/classes/fleet/ship';

export default Vue.extend({
  name: 'ShipTooltip',
  props: {
    value: {
      type: Ship,
      required: true,
    },
    fleetRosCorr: {
      type: Number,
      default: 0,
    },
    isFragship: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    baseHP(): number {
      const ship = this.value;
      return ship.level > 99 ? ship.data.hp2 : ship.data.hp;
    },
    buffHP(): number {
      return this.value.hp - this.baseHP;
    },
    baseAsw(): number {
      const ship = this.value;
      return ship.level === 99 ? ship.data.maxAsw : Ship.getStatusFromLevel(ship.level, ship.data.maxAsw, ship.data.minAsw);
    },
    buffAsw(): number {
      return this.value.asw - this.baseAsw;
    },
    maxAsw(): number {
      const ship = this.value;
      return Ship.getStatusFromLevel(ship.level, ship.data.maxAsw, ship.data.minAsw) + 9;
    },
    baseLuck(): number {
      return this.value.data.luck;
    },
    buffLuck(): number {
      return this.value.luck - this.baseLuck;
    },
    maxLuck(): number {
      return this.value.data.maxLuck;
    },
    taihaRate(): string {
      // ワンパン大破率
      let count = 0;
      const curHP = this.baseHP + this.buffHP;
      const border = Math.floor(curHP / 4);
      for (let i = 0; i < curHP; i += 1) {
        const damage = Math.floor(curHP * 0.5 + i * 0.3);
        const hp = curHP - damage;
        if (hp <= border) {
          count += 1;
        }
      }
      return `${((100 * count) / curHP).toFixed(1)} %`;
    },
    chuhaRate(): string {
      // ワンパン中破率
      let count = 0;
      const curHP = this.baseHP + this.buffHP;
      const border = Math.floor(curHP / 4);
      const border2 = Math.floor(curHP / 2);
      for (let i = 0; i < curHP; i += 1) {
        const damage = Math.floor(curHP * 0.5 + i * 0.3);
        const hp = curHP - damage;
        if (border < hp && hp <= border2) {
          count += 1;
        }
      }
      return `${((100 * count) / curHP).toFixed(1)} %`;
    },
    specialAttacks(): { text: string; rate: number[] }[] {
      if (this.fleetRosCorr) {
        const array = this.value.getDayBattleSpecialAttackRate(this.fleetRosCorr, this.isFragship);
        if (array.length) {
          array.push({ text: 'Total', rate: [sum(array.map((v) => v.rate[0])), sum(array.map((v) => v.rate[1]))] });
        }

        array.forEach((v) => {
          v.rate = v.rate.map((x) => Math.round(1000 * x) / 10);
        });
        return array;
      }
      return [];
    },
  },
});
</script>
