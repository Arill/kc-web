<template>
  <v-card class="my-2 px-1 py-2">
    <div class="d-flex pb-1 flex-wrap">
      <div class="pl-2 align-self-center">Enemy Fleet</div>
      <v-spacer></v-spacer>
      <v-btn icon @click="resetFleetAll">
        <v-icon>mdi-trash-can-outline</v-icon>
      </v-btn>
      <v-tooltip bottom color="black">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon @click="captureEnemy" v-bind="attrs" v-on="on">
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
    <v-divider></v-divider>
    <div id="enemies-container" :class="{ captured: capturing }">
      <div class="d-flex mx-1 mt-3" v-if="!isDefense">
        <div class="align-self-center mr-3 pb-2" v-if="!capturing">
          <v-btn color="primary" @click.stop="showWorldListContinuous">Batch Node Selection</v-btn>
        </div>
        <div class="align-self-center mr-4 pb-2" v-if="!capturing" v-show="battleInfo.battleCount > 1 && existsBattleAirbase">
          <v-tooltip bottom color="red" :disabled="!alertAirbaseTarget">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                :outlined="!alertAirbaseTarget"
                :color="airbaseTargetButtonColor"
                @click.stop="targetDialog = true"
                v-bind="attrs"
                v-on="on"
              >
                Land Base destination
              </v-btn>
            </template>
            <span>The number of Nodes may have changed. Please check the Land Base destinations.</span>
          </v-tooltip>
        </div>
        <div class="align-self-center mr-4" id="battle-count-select">
          <v-select dense hide-details v-model="battleInfo.battleCount" :items="items" label="Number of Nodes" @change="setInfo()"></v-select>
        </div>
        <div class="align-self-center body-2" v-if="nodeString">
          <span class="text--secondary mr-3">Route:</span>
          <span>{{ nodeString }}</span>
        </div>
      </div>
      <div v-if="isDefense" class="d-flex flex-wrap air-power-info ma-1">
        <div>
          <v-chip class="mr-1" color="green" label outlined>
            <span>AS+:</span>
            <span class="chip-value">{{ defenseAirPowerBorders[0] }}</span>
          </v-chip>
          <v-chip class="mr-1" color="light-green" label outlined>
            <span>AS:</span>
            <span class="chip-value">{{ defenseAirPowerBorders[1] }}</span>
          </v-chip>
          <v-chip class="mr-1" color="orange" label outlined>
            <span>AP:</span>
            <span class="chip-value">{{ defenseAirPowerBorders[2] }}</span>
          </v-chip>
          <v-chip class="mr-1" color="deep-orange" label outlined>
            <span>AD:</span>
            <span class="chip-value">{{ defenseAirPowerBorders[3] }}</span>
          </v-chip>
        </div>
      </div>
      <div v-if="!isDefense">
        <draggable v-model="battleInfo.fleets" handle=".battle-title" animation="150" @end="setInfo()" class="d-flex flex-wrap">
          <enemy-fleet-component
            v-for="(i, index) in battleInfo.battleCount"
            :key="i"
            v-model="battleInfo.fleets[index]"
            :index="index"
            :handle-show-enemy-list="showEnemyList"
            :handle-show-item-list="showItemList"
            :handle-show-world-list="showWorldList"
            :capturing="capturing"
            @input="setInfo()"
          ></enemy-fleet-component>
        </draggable>
      </div>
      <div class="d-flex flex-wrap" v-else>
        <enemy-fleet-component
          v-model="battleInfo.airRaidFleet"
          :index="0"
          :handle-show-enemy-list="showEnemyList"
          :handle-show-item-list="showItemList"
          :handle-show-world-list="showWorldList"
          :capturing="capturing"
          @input="setInfo()"
        ></enemy-fleet-component>
      </div>
    </div>
    <v-dialog v-model="enemyListDialog" transition="scroll-x-transition" width="1200">
      <enemy-list :handle-decide-enemy="putEnemy" :handleClose="closeEnemyList" />
    </v-dialog>
    <v-dialog v-model="itemListDialog" :width="itemDialogWidth">
      <item-list ref="itemList" :handle-equip-item="equipItem" :handle-close="closeItemList" :handle-change-width="changeWidth" />
    </v-dialog>
    <v-dialog v-model="worldListDialog" transition="scroll-x-transition" width="600" @input="toggleWorldList">
      <world-list ref="worldList" :handle-set-enemy="setEnemyFleet" :handleClose="closeWorldList" />
    </v-dialog>
    <v-dialog v-model="targetDialog" width="600" transition="scroll-x-transition" @input="toggleTargetDialog">
      <airbase-target v-model="airbaseInfo" :battleCount="battleInfo.battleCount" :handle-close="closeTargetDialog" />
    </v-dialog>
  </v-card>
</template>

<style scoped>
#battle-count-select {
  width: 100px;
}

#enemies-container.captured {
  width: 1160px !important;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 0.2rem;
  padding: 0.75rem 0.5rem;
}
#enemies-container.captured * {
  box-shadow: none !important;
}
.theme--dark #enemies-container.captured {
  background: rgb(40, 40, 45);
  border: 1px solid #444;
}
.deep-sea .theme--dark #enemies-container.captured {
  background: rgb(8, 18, 42);
}
#enemies-container.captured .v-card {
  border: 1px solid #ddd;
}
.theme--dark #enemies-container.captured .v-card {
  border: 1px solid rgb(28, 28, 34);
}

.air-power-info > * {
  align-self: center;
}
.air-power-info .value-text {
  width: 40px;
  text-align: right;
}
</style>

<script lang="ts">
import Vue from 'vue';
import draggable from 'vuedraggable';
import html2canvas from 'html2canvas';
import AirbaseTarget from '@/components/airbase/AirbaseTarget.vue';
import EnemyFleetComponent from '@/components/enemy/EnemyFleet.vue';
import EnemyList from '@/components/enemy/EnemyList.vue';
import WorldList from '@/components/map/WorldList.vue';
import ItemList from '@/components/item/ItemList.vue';
import EnemyMaster from '@/classes/enemy/enemyMaster';
import BattleInfo, { BattleInfoBuilder } from '@/classes/enemy/battleInfo';
import AirbaseInfo from '@/classes/airbase/airbaseInfo';
import ItemMaster from '@/classes/item/itemMaster';
import Enemy from '@/classes/enemy/enemy';
import EnemyFleet, { EnemyFleetBuilder } from '@/classes/enemy/enemyFleet';
import CommonCalc from '@/classes/commonCalc';
import { AB_MODE } from '@/classes/const';
import Convert from '@/classes/convert';

const BattleCountItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default Vue.extend({
  name: 'EnemyFleetAll',
  components: {
    draggable,
    EnemyFleetComponent,
    EnemyList,
    WorldList,
    ItemList,
    AirbaseTarget,
  },
  props: {
    value: {
      type: BattleInfo,
      required: true,
    },
    airbaseInfo: {
      type: AirbaseInfo,
      required: true,
    },
    isDefense: {
      type: Boolean,
      required: true,
    },
    handleMinimize: {
      type: Function,
      required: true,
    },
  },
  data: () => ({
    items: BattleCountItems,
    enemyListDialog: false,
    itemListDialog: false,
    worldListDialog: false,
    targetDialog: false,
    dialogTarget: [-1, -1],
    itemDialogTarget: [-1, -1, -1],
    fleetStock: [] as EnemyFleet[],
    itemDialogWidth: 1200,
    capturing: false,
    alertAirbaseTarget: false,
  }),
  computed: {
    battleInfo(): BattleInfo {
      return this.value;
    },
    nodeString(): string {
      const nodeList = this.value.fleets.map((v) => v.nodeName);
      if (nodeList.some((v) => v !== '')) {
        let map = '';
        const lastBattle = this.value.fleets[this.value.fleets.length - 1];
        if (lastBattle && lastBattle.area) {
          const world = Math.floor(lastBattle.area / 10);
          map = `${world > 40 ? 'E' : world}-${lastBattle.area % 10}`;
        }
        return `${map} : ${nodeList.map((v) => (v === '' ? '?' : v)).join(' → ')}`;
      }
      return '';
    },
    defenseAirPowerBorders(): number[] {
      if (this.isDefense) {
        return CommonCalc.getAirStatusBorder(this.battleInfo.airRaidFleet.airbaseAirPower);
      }
      return [];
    },
    existsBattleAirbase(): boolean {
      return this.airbaseInfo.airbases.some((v) => v.mode === AB_MODE.BATTLE);
    },
    airbaseTargetButtonColor(): string {
      return this.alertAirbaseTarget ? 'error' : 'success';
    },
  },
  methods: {
    setInfo(builder = undefined as BattleInfoBuilder | undefined) {
      let newBattleInfo: BattleInfo;
      if (builder) {
        newBattleInfo = new BattleInfo(builder);
      } else {
        newBattleInfo = new BattleInfo({ info: this.battleInfo });
      }
      // 基地派遣先の整合性チェック
      const { airbases } = this.airbaseInfo;
      for (let i = 0; i < airbases.length; i += 1) {
        const targets = airbases[i].battleTarget;
        for (let j = 0; j < targets.length; j += 1) {
          const target = targets[j];
          if (target >= newBattleInfo.battleCount) {
            targets[j] = newBattleInfo.battleCount - 1;
          }
        }
      }
      this.$emit('input', newBattleInfo);
    },
    async showItemList(fleetIndex: number, enemyIndex: number, slotIndex: number) {
      this.itemDialogTarget = [fleetIndex, enemyIndex, slotIndex];
      const enemy = this.battleInfo.fleets[fleetIndex].enemies[enemyIndex];
      await (this.itemListDialog = true);
      (this.$refs.itemList as InstanceType<typeof ItemList>).initialFilter(enemy, slotIndex);
    },
    showEnemyList(battle: number, index: number) {
      this.dialogTarget = [battle, index];
      this.enemyListDialog = true;
    },
    async showWorldListContinuous() {
      this.fleetStock = [];
      await (this.worldListDialog = true);
      const ref = this.$refs.worldList as InstanceType<typeof WorldList>;
      ref.continuousMode = true;
      ref.selectedNodeName = '';
      ref.selectedNodeNames = [];
      ref.snackbar = false;
    },
    async showWorldList(index: number) {
      this.fleetStock = [];
      this.dialogTarget = [index, 0];
      await (this.worldListDialog = true);
      const ref = this.$refs.worldList as InstanceType<typeof WorldList>;
      ref.continuousMode = false;
      ref.selectedNodeName = '';
      ref.selectedNodeNames = [];
      ref.snackbar = false;
      if (ref.allCells.length) {
        ref.cellChanged();
      }
    },
    putEnemy(enemy: EnemyMaster) {
      this.enemyListDialog = false;
      const fleetIndex = this.dialogTarget[0];
      const index = this.dialogTarget[1];
      const fleet = this.isDefense ? this.battleInfo.airRaidFleet : this.battleInfo.fleets[fleetIndex];

      // マスタから敵艦を解決
      const masterEnemies = this.$store.getters.getEnemies as EnemyMaster[];
      const masterEnemy = masterEnemies.find((v) => v.id === enemy.id);
      if (!masterEnemy) {
        return;
      }

      // 装備マスタより装備を解決
      const allItems = this.$store.state.items as ItemMaster[];
      // 6隻目以降なら連合随伴とする
      const isEscort = fleet.isUnion && index >= 6;
      const newEnemy = Enemy.createEnemyFromMaster(masterEnemy, isEscort, allItems);
      const enemies = fleet.enemies.concat();
      enemies[index] = newEnemy;
      const builder: EnemyFleetBuilder = { fleet, enemies };

      // 敵編成が更新されたため、敵艦隊を再インスタンス化し更新
      if (this.isDefense) {
        // 空襲モード用敵編成に追加 それ以外は据え置き
        this.setInfo({ info: this.battleInfo, airRaidFleet: new EnemyFleet(builder) });
      } else {
        this.battleInfo.fleets[fleetIndex] = new EnemyFleet(builder);
        this.setInfo();
      }
    },
    equipItem(item: ItemMaster) {
      console.log(item);
      console.log(this.itemDialogTarget);
    },
    setEnemyFleet(fleet: EnemyFleet, isCoutinue = false) {
      if (fleet.nodeName === 'Air Raid' || this.isDefense) {
        this.airbaseInfo.isDefense = true;
        // 空襲モード用敵編成に追加して終了
        this.setInfo({ info: this.battleInfo, airRaidFleet: fleet });
        this.worldListDialog = false;
      } else if (isCoutinue && this.fleetStock.length < 9) {
        this.fleetStock.push(fleet);
      } else if (isCoutinue) {
        // 10制限 閉じる
        this.fleetStock.push(fleet);
        this.closeWorldList();
      } else {
        const index = this.dialogTarget[0];
        this.battleInfo.fleets[index] = new EnemyFleet({ fleet });
        this.setInfo();
        this.worldListDialog = false;
      }
    },
    closeWorldList() {
      this.worldListDialog = false;
      this.toggleWorldList();
    },
    closeEnemyList() {
      this.enemyListDialog = false;
    },
    toggleWorldList() {
      if (!this.worldListDialog && this.fleetStock.length) {
        // 連続入力モード データがあればそれを登録
        const battleCount = this.fleetStock.length;
        const builder: BattleInfoBuilder = {
          info: this.battleInfo,
          fleets: this.fleetStock,
          battleCount,
        };

        // setInfoによって更新されてしまう前に退避
        const prevBattleCount = this.battleInfo.battleCount;
        this.setInfo(builder);

        // 戦闘回数がsetInfoによる更新前後で変わっていたら基地ターゲットにアラートを出す
        if (battleCount > 1 && prevBattleCount !== battleCount && this.existsBattleAirbase) {
          this.alertAirbaseTarget = true;
        }
      }
    },
    resetFleetAll() {
      if (this.isDefense) {
        this.setInfo({ info: this.battleInfo, airRaidFleet: new EnemyFleet() });
      } else {
        this.setInfo({ info: this.battleInfo, fleets: [], battleCount: 1 });
      }
    },
    toggleTargetDialog() {
      if (!this.targetDialog) {
        this.alertAirbaseTarget = false;
        this.setInfo();
      }
    },
    closeTargetDialog() {
      this.targetDialog = false;
      this.setInfo();
    },
    closeItemList() {
      this.itemListDialog = false;
    },
    changeWidth(width: number) {
      this.itemDialogWidth = width;
    },
    captureEnemy() {
      // 背景色とかを塗るフラグ立て
      this.capturing = true;
      const div = document.getElementById('enemies-container') as HTMLDivElement;
      setTimeout(() => {
        html2canvas(div, { scale: 2, width: 1160 }).then((canvas) => {
          const link = document.createElement('a');
          link.href = canvas.toDataURL();
          link.download = `enemy_${Convert.formatDate(new Date(), 'yyyyMMdd-HHmmss')}.jpg`;
          link.click();
          this.capturing = false;
        });
      }, 10);
    },
  },
});
</script>
