<template>
  <div class="d-flex" :class="{ dense: dense }">
    <div class="mr-1 status-reuslt" v-if="!noLabel">
      <div class="status-reuslt-label">{{ result.airState.text }}</div>
      <div class="status-reuslt-rate">{{ rate }}%</div>
    </div>
    <div class="align-self-center flex-grow-1">
      <div v-if="!noLabel" class="d-flex">
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
      <div>
        <v-progress-linear :color="barColor" :value="barWidth"></v-progress-linear>
      </div>
    </div>
  </div>
</template>

<style scoped>
.status-reuslt {
  width: 28px;
  position: relative;
  opacity: 0.8;
  font-size: 12px;
}
.dense .status-reuslt {
  width: 26px;
}

.status-reuslt-label {
  text-align: center;
  position: relative;
  white-space: nowrap;
  width: 100%;
  bottom: 6px;
}
.dense .status-reuslt-label {
  font-size: 11px;
  bottom: 4px;
}

.status-reuslt-rate {
  position: absolute;
  white-space: nowrap;
  text-align: right;
  width: 100%;
  top: 10px;
}
.dense .status-reuslt-rate {
  font-size: 10px;
  top: 7px;
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
</style>

<script lang="ts">
import Vue from 'vue';
import AirCalcResult from '@/classes/airCalcResult';
import { AIR_STATE } from '@/classes/const';

export default Vue.extend({
  name: 'AirStatusResultBar',
  props: {
    result: {
      type: AirCalcResult,
      required: true,
    },
    dense: {
      type: Boolean,
      default: false,
    },
    noLabel: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    rate() {
      const r = this.result;
      return r.airState.value !== AIR_STATE.NONE ? Math.round(r.rates[r.airState.value]) : 0;
    },
    barWidth() {
      const r = this.result as AirCalcResult;
      return r.airState.value !== AIR_STATE.NONE ? r.airStateBarWidth : 0;
    },
    barColor() {
      const r = this.result as AirCalcResult;
      if (r.airState.value === AIR_STATE.NONE) {
        return 'secondary';
      }
      const value = r.airStateBarWidth;
      if (value >= 90) {
        return 'success';
      }
      if (value >= 45) {
        return 'light-green';
      }
      if (value >= 20) {
        return 'yellow';
      }
      if (value >= 10) {
        return 'orange';
      }
      return 'red';
    },
  },
});
</script>
