<template>
  <div class="mb-5" @dragover.prevent @drop="dropItem">
    <div class="minimize-group">
      <v-btn class="mr-2" small v-if="!sortMode && setting.isMinimizedAirbase" @click="toggleMinimizeAirbase(false)">Land Base Air Corps</v-btn>
      <v-btn class="mr-2" small v-if="!sortMode && setting.isMinimizedFleet" @click="toggleMinimizeFleet(false)">Allied Fleet</v-btn>
      <v-btn class="mr-2" small v-if="!sortMode && setting.isMinimizedEnemy" @click="toggleMinimizeEnemy(false)">Enemy Fleet</v-btn>
      <v-btn class="mr-2" small v-if="!sortMode && setting.isMinimizedResult" @click="toggleMinimizeResult(false)">Simulation Results</v-btn>
      <v-btn class="ml-auto" small v-if="!sortMode" @click="startContentOrder" color="primary">Change Order</v-btn>
      <v-btn class="ml-auto" small v-if="sortMode" @click="commitContentOrder" color="primary">Accept</v-btn>
      <v-btn class="ml-2" dark small v-if="sortMode" @click="cancelContentOrder" color="secondary">Cancel</v-btn>
    </div>
    <draggable handle=".content-frame" animation="150" :disabled="!sortMode" id="content-container" :class="{ 'sort-mode': sortMode }">
      <div id="airbase-content" class="content-frame" v-show="sortMode || !setting.isMinimizedAirbase">
        <v-card v-if="sortMode" class="sort-container">Land Base Air Corps</v-card>
        <airbase-all
          v-else
          v-model="calcManager.airbaseInfo"
          :battle-info="calcManager.battleInfo"
          :handle-minimize="toggleMinimizeAirbase"
          :sort-mode="sortMode"
        />
      </div>
      <div id="fleet-content" class="content-frame" v-show="sortMode || (!calcManager.isDefense && !setting.isMinimizedFleet)">
        <v-card v-if="sortMode" class="sort-container">Allied Fleet</v-card>
        <fleet-all
          v-else
          v-model="calcManager.fleetInfo"
          :handle-change-formation="changeFormation"
          :handle-minimize="toggleMinimizeFleet"
          :sort-mode="sortMode"
        />
      </div>
      <div id="enemy-content" class="content-frame" v-show="sortMode || !setting.isMinimizedEnemy">
        <v-card v-if="sortMode" class="sort-container">Enemy Fleet</v-card>
        <enemy-fleet-all
          v-else
          v-model="calcManager.battleInfo"
          :airbase-info="calcManager.airbaseInfo"
          :is-defense="calcManager.isDefense"
          :handle-minimize="toggleMinimizeEnemy"
          :sort-mode="sortMode"
        />
      </div>
      <div id="result-content" class="content-frame" v-show="sortMode || !setting.isMinimizedResult">
        <v-card v-if="sortMode" class="sort-container">Simulation Results</v-card>
        <main-result
          v-else
          v-model="calcManager"
          v-show="!calcManager.isDefense"
          :handle-change-main-battle="changeMainBattle"
          :handle-change-formation="changeFormation"
          :handle-more-calculate="calculateMore"
          :handle-minimize="toggleMinimizeResult"
          :sort-mode="sortMode"
          :calculate-count="setting.simulationCount"
          ref="mainResult"
        />
      </div>
    </draggable>
    <div v-if="!sortMode" class="general-container">
      <editable-enemy-list />
    </div>
    <div class="info-area">
      <v-divider class="mb-2"></v-divider>
      <div class="caption">
        著作権法第32条に基づき画像を引用し、著作権は権利者様へ帰属します。権利者様側からの画像等の削除の依頼や警告には速やかに対処いたします。
      </div>
      <div class="caption">また、本サイトの情報、計算結果によって受けた利益・損害その他あらゆる事象については一切の責任を負いません。</div>
    </div>
  </div>
</template>

<style scoped>
.minimize-group {
  margin: 0 auto;
  max-width: 1200px;
  display: flex;
}

#content-container {
  margin: 0 auto;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
}
.sort-mode .content-frame {
  cursor: move;
}
.sort-container {
  padding: 0.75rem;
  margin-top: 0.5rem;
}
.info-area {
  margin: 2rem auto 0.5rem auto;
  max-width: 1200px;
}

.general-container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>

<script lang="ts">
import Vue from 'vue';
import draggable from 'vuedraggable';
import EnemyFleetAll from '@/components/enemy/EnemyFleetAll.vue';
import EditableEnemyList from '@/components/enemy/EditableEnemyList.vue';
import AirbaseAll from '@/components/airbase/AirbaseAll.vue';
import MainResult from '@/components/result/MainResult.vue';
import FleetAll from '@/components/fleet/FleetAll.vue';
import CalcManager from '@/classes/calcManager';
import BattleInfo from '@/classes/enemy/battleInfo';
import SaveData from '@/classes/saveData/saveData';
import ItemMaster from '@/classes/item/itemMaster';
import ShipMaster from '@/classes/fleet/shipMaster';
import EnemyMaster from '@/classes/enemy/enemyMaster';
import FleetInfo from '@/classes/fleet/fleetInfo';
import EnemyFleet from '@/classes/enemy/enemyFleet';
import SiteSetting from '@/classes/siteSetting';

export default Vue.extend({
  name: 'AirCalculator',
  components: {
    AirbaseAll,
    FleetAll,
    EnemyFleetAll,
    MainResult,
    draggable,
    EditableEnemyList,
  },
  data: () => ({
    calcManager: new CalcManager(),
    unsbscribe: undefined as unknown,
    stockData: undefined as undefined | SaveData,
    setting: new SiteSetting(),
    sortMode: false,
    saveTriggerTimer: undefined as undefined | number,
  }),
  mounted() {
    this.unsbscribe = this.$store.subscribe((mutation, state) => {
      this.setting = this.$store.state.siteSetting as SiteSetting;
      if (mutation.type === 'setMainSaveData') {
        const saveData = state.mainSaveData as SaveData;
        if (!saveData) {
          // 計算対象データがないならトップページに戻す。開いてる途中で削除されたりしたらこうなる
          this.$router.push('/');
          return;
        }
        if (!this.completed) {
          // ロード完了前だったら一時保持しておく
          this.stockData = saveData;
          return;
        }

        // マスターの再読み込み
        const items = this.$store.state.items as ItemMaster[];
        const ships = this.$store.state.ships as ShipMaster[];
        const enemies = this.$store.getters.getEnemies as EnemyMaster[];

        const manager = saveData.loadManagerData(items, ships, enemies, this.setting.admiralLevel);

        if (manager.resetAll) {
          this.calcManager = manager;
        } else {
          if (manager.airbaseInfo.airbases.some((v) => v.items.some((i) => i.data.id > 0))) {
            // 空のデータじゃなければ置き換える
            this.calcManager.airbaseInfo = manager.airbaseInfo;
          }
          if (manager.fleetInfo.fleets.some((v) => v.ships.some((s) => s.data.id > 0))) {
            // 空のデータじゃなければ置き換える
            this.calcManager.fleetInfo = manager.fleetInfo;
          }
          if (manager.battleInfo.fleets.some((v) => v.enemies.some((s) => s.data.id > 0))) {
            // 空のデータじゃなければ置き換える
            this.calcManager.battleInfo = manager.battleInfo;
          }
        }

        this.calcManager.mainBattle = manager.battleInfo.fleets.length - 1;
        // 特殊ケース -後続のwatch処理で再計算させないための苦肉の策
        this.calcManager.airbaseInfo.calculated = true;
        this.calcManager.fleetInfo.calculated = true;
        this.calcManager.battleInfo.calculated = true;

        this.calculate();
      }

      if (mutation.type === 'updateSetting') {
        // 設定情報の更新を購読 常に最新の状態を保つ
        this.setting = state.siteSetting as SiteSetting;
        this.sortContentFromSetting();
      }

      this.sortContentFromSetting();
    });

    // なんかデータがあるならそれを突っ込んで計算開始
    const saveData = this.$store.state.mainSaveData as SaveData;

    if (saveData && saveData.isActive) {
      saveData.isMain = true;
      saveData.isActive = true;
      // 計算開始
      this.$store.dispatch('setMainSaveData', saveData);
    } else {
      this.$router.push('/');
    }
  },
  beforeDestroy() {
    if (this.unsbscribe) {
      (this.unsbscribe as () => void)();
    }
  },
  computed: {
    completed() {
      return this.$store.getters.getCompletedAll;
    },
  },
  watch: {
    'calcManager.airbaseInfo': {
      handler() {
        if (!this.calcManager.airbaseInfo.calculated) {
          this.calculate();
        }
      },
    },
    'calcManager.fleetInfo': {
      handler() {
        if (!this.calcManager.fleetInfo.calculated) {
          this.calculate();
        }
      },
    },
    'calcManager.battleInfo': {
      handler(current: BattleInfo, old: BattleInfo) {
        if (!this.calcManager.battleInfo.calculated) {
          if (current.fleets.length !== old.fleets.length) {
            // 戦闘回数変更を検知
            this.calcManager.mainBattle = this.calcManager.battleInfo.fleets.length - 1;
          }
          this.calculate();
        }
      },
    },
    completed(value) {
      if (value && this.stockData) {
        // 読み込み完了まで待ってた編成を展開
        this.$store.dispatch('setMainSaveData', this.stockData);
        // 捨てる
        this.stockData = undefined;
      }
    },
  },
  methods: {
    dropItem() {
      // ドラッグ中itemをドロップ時消すフラグを建てる
      const draggingDiv = document.getElementById('dragging-item');
      if (draggingDiv) {
        draggingDiv.classList.add('delete-flg');
      }
    },
    changeMainBattle(index: number) {
      this.calcManager.mainBattle = index;
      // 編成が変更されたわけではないので履歴への追加は行わない
      this.calcManager.battleInfo.ignoreHistory = true;

      // 陣形を整える
      const formation = this.calcManager.battleInfo.fleets[index].mainFleetFormation;
      this.calcManager.fleetInfo = FleetInfo.getInfoWithChangedFormation(this.calcManager.fleetInfo, formation);
    },
    changeFormation(formation: number) {
      // 計算対象の敵編成を更新(味方陣形)
      const index = this.calcManager.mainBattle;
      const fleet = this.calcManager.battleInfo.fleets[index];
      this.calcManager.battleInfo.fleets[index] = new EnemyFleet({ fleet, mainFleetFormation: formation });

      // 陣形を整える
      this.calcManager.fleetInfo = FleetInfo.getInfoWithChangedFormation(this.calcManager.fleetInfo, formation);
    },
    calculateMore() {
      this.calculate(100000);
    },
    calculate(count = 0) {
      // ドラッグ完了までは計算を実行しない
      if (document.getElementById('dragging-item')) {
        return;
      }
      const manager = this.calcManager;

      if (count > 0) {
        manager.updateInfo(count);
      } else {
        manager.updateInfo(this.setting.simulationCount);
      }
      // 計算結果の格納
      const mainData = this.$store.state.mainSaveData as SaveData;
      const needPutHistory = !manager.fleetInfo.calculated || !manager.airbaseInfo.calculated || !manager.battleInfo.calculated;
      const isIgnoreHistory = manager.fleetInfo.ignoreHistory || manager.airbaseInfo.ignoreHistory || manager.battleInfo.ignoreHistory;
      // シミュレータ内からの更新だった場合(外部のタブ操作やundo redoでの計算処理でない場合)のみ、履歴を更新
      if (mainData && needPutHistory && !isIgnoreHistory && count === 0) {
        mainData.putHistory(manager);
      }

      // 次回計算が実行されたら履歴に入れたい
      manager.airbaseInfo.ignoreHistory = false;
      manager.fleetInfo.ignoreHistory = false;
      manager.battleInfo.ignoreHistory = false;

      // 計算結果ページの微調整
      const resultForm = this.$refs.mainResult as InstanceType<typeof MainResult>;
      if (resultForm) {
        resultForm.displayBattle = this.calcManager.mainBattle;
        resultForm.tab = `battle${this.calcManager.mainBattle}`;
        resultForm.moreCalculateRequested = count > 0;
      }

      if (this.saveTriggerTimer) {
        window.clearTimeout(this.saveTriggerTimer);
      }
      if (mainData.isUnsaved) {
        // 未保存の編成だった場合、適当なタイミングでmanagerを更新しておく
        this.saveTriggerTimer = window.setTimeout(() => {
          try {
            mainData.saveManagerData();
            const saveData = this.$store.state.saveData as SaveData;
            this.$store.dispatch('updateSaveData', saveData);
          } catch (error) {
            // 対処済み(どうせ編成はもう閉じてるのでしなくていい)
            console.error(error);
          }
        }, 100);
      }

      if (count > 0) {
        this.$emit('inform', `Simulation complete (+${count.toLocaleString()} times)`);
      }
    },
    startContentOrder() {
      this.$emit('inform', 'Rearrange the panels as you\'d like, then press Accept.');
      this.sortMode = true;

      const contents = document.querySelectorAll('#content-container .content-frame');
      for (let i = 0; i < contents.length; i += 1) {
        contents[i].className = 'content-frame';
      }
    },
    cancelContentOrder() {
      this.sortMode = false;
      // 復帰
      this.sortContentFromSetting();
    },
    commitContentOrder() {
      this.sortMode = false;

      this.setting.contentOrder = [];
      const contents = document.querySelectorAll('#content-container .content-frame');
      for (let i = 0; i < contents.length; i += 1) {
        const { id } = contents[i];
        if (id) {
          this.setting.contentOrder.push(id);
        }
      }

      this.$emit('inform', 'Changes applied.');
      this.$store.dispatch('updateSetting', this.setting);
    },
    toggleMinimizeAirbase(isMinimized: boolean) {
      this.setting.isMinimizedAirbase = isMinimized;
      this.$store.dispatch('updateSetting', this.setting);
    },
    toggleMinimizeFleet(isMinimized: boolean) {
      this.setting.isMinimizedFleet = isMinimized;
      this.$store.dispatch('updateSetting', this.setting);
    },
    toggleMinimizeEnemy(isMinimized: boolean) {
      this.setting.isMinimizedEnemy = isMinimized;
      this.$store.dispatch('updateSetting', this.setting);
    },
    toggleMinimizeResult(isMinimized: boolean) {
      this.setting.isMinimizedResult = isMinimized;
      this.$store.dispatch('updateSetting', this.setting);
    },
    sortContentFromSetting() {
      const ids = this.setting.contentOrder;
      for (let i = 0; i < ids.length; i += 1) {
        const id = ids[i];
        const content = document.getElementById(id);
        if (content) {
          content.className = 'content-frame';
          content.classList.add(`order-${i + 1}`);
        }
      }
    },
  },
});
</script>
