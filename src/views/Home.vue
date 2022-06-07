<template>
  <div class="site-top-container">
    <div class="site-title content">
      Air Power Simulator <span class="body-1">v{{ $store.state.siteVersion }}</span>
    </div>
    <v-card class="site-body content">
      <div class="menu-buttons">
        <div class="my-2 mx-4">
          <v-btn x-large color="green" dark @click="goAirCalcPage">
            <v-icon>mdi-calculator</v-icon>
            <span class="ml-1">Air Power Simulator</span>
          </v-btn>
          <div class="mt-2 body-2">
            <div>This is main function of this site.</div>
            <div class="mt-2">
              By selecting Land Base Air Corps, Allied and Enemy Fleets, it's possible to simulate the Air State of all battles -- including the route -- the loss of aircraft, and the deplaning rates.
            </div>
          </div>
        </div>
        <div class="my-2 mx-4">
          <v-btn x-large dark color="blue" @click="$router.push('manager')">
            <v-icon>mdi-database-cog</v-icon>
            <span class="ml-1">Shipgirl / Equipment Management</span>
          </v-btn>
          <div class="mt-2 body-2">
            <div>This is a sub-function.</div>
            <div class="mt-2">
              Use this to designate ship and equipment information to reflet the ones in your own game. Do I have that ship or equipment..? You no longer have to remember.
            </div>
          </div>
        </div>
        <div class="mt-4 mx-4">
          <v-btn x-large dark color="blue darken-4" @click="$router.push('list')">
            <v-icon>mdi-human-greeting-variant</v-icon>
            <span class="ml-1">Public Fleets</span>
          </v-btn>
          <div class="mt-2 body-2">
            <div>You can check the fleets uploaded by other people</div>
          </div>
        </div>
      </div>
      <v-divider class="my-4"></v-divider>
      <div class="ma-2">
        <div class="ml-2">Data Transfer</div>
        <div class="ml-4 mt-2 body-2">
          The data from <a href="https://noro6.github.io/kcTools" target="_blank">the older simulator</a>, such as registered equipment and ships will be retrieved automatically.
        </div>
        <div class="d-flex flex-wrap ml-2">
          <v-btn class="ma-2" color="teal" @click="checkOldData()" :dark="!imported" :disabled="imported">Data transfer (Sortie Presets)</v-btn>
          <v-btn class="ma-2" color="teal" @click="checkOldStockData()" :dark="!importedStock" :disabled="importedStock">
            Data transfer (Ships/Equipment)
          </v-btn>
        </div>
      </div>
      <v-divider class="my-4"></v-divider>
      <div class="ma-2">
        <div class="ml-2">Deckbuilder integration</div>
        <div class="ml-4 mt-2 body-2">
          <div>You can load KC Deckbuilder data by appending ?predeck= to the URL.</div>
          <div class="text--secondary">(e.g.) https://arill.github.io/kc-web?predeck={"version":4,"hqlv":120,"f1":{"s1":...</div>
        </div>
      </div>
    </v-card>
    <div class="info-area">
      <v-divider class="mb-2"></v-divider>
      <div class="caption">
        著作権法第32条に基づき画像を引用し、著作権は権利者様へ帰属します。権利者様側からの画像等の削除の依頼や警告には速やかに対処いたします。
      </div>
      <div class="caption">また、本サイトの情報、計算結果によって受けた利益・損害その他あらゆる事象については一切の責任を負いません。</div>
    </div>
    <v-dialog v-model="importConfirmDialog" transition="scroll-x-transition" width="500">
      <v-card class="pa-3">
        <div class="mx-4 mt-4">
          <div class="body-2">引き継ぎ対象のデータを格納するフォルダーを作成します。</div>
          <div class="mb-5 body-2">フォルダー名を指定し、実行を押すと引き継ぎを開始します。</div>
          <v-text-field v-model="importFileName" dense outlined maxlength="100" counter label="フォルダー名"></v-text-field>
          <div class="d-flex mt-3">
            <v-btn class="ml-auto" color="success" @click.stop="importOldData" :disabled="isNameEmptry || imported">実行</v-btn>
            <v-btn class="ml-4" color="secondary" @click.stop="importConfirmDialog = false">戻る</v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog v-model="confirmDialog" transition="scroll-x-transition" width="440">
      <v-card class="pa-3">
        <div class="ma-4">
          <div class="body-2">既に本サイトで装備 / 艦娘情報が登録されているようです。</div>
          <div class="body-2">引き継ぎを行うとこれらのデータは上書きされます。</div>
          <div class="body-2 mt-3">本当に引き継ぎを行いますか？</div>
        </div>
        <v-divider class="my-2"></v-divider>
        <div class="d-flex">
          <v-btn class="ml-auto" color="primary" dark :disabled="!confirmDialog" @click.stop="importOldStockData()">実行</v-btn>
          <v-btn class="ml-4" color="secondary" @click.stop="confirmDialog = false">戻る</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.content {
  margin: 0 auto;
  max-width: 1200px;
}
.site-title {
  margin-top: 1rem;
  font-size: 1.2em;
}
.site-body {
  margin-top: 2rem;
  padding: 1rem;
}
.menu-buttons {
  display: grid;
  grid-template-columns: 1fr;
}
@media (min-width: 800px) {
  .menu-buttons {
    grid-template-columns: 1fr 1fr;
  }
}
.info-area {
  margin: 2rem auto 0.5rem auto;
  max-width: 1200px;
}
</style>

<script lang="ts">
import Vue from 'vue';
import SaveData from '@/classes/saveData/saveData';
import Convert, { OldShipStockJson } from '@/classes/convert';
import SiteSetting from '@/classes/siteSetting';
import ItemStock from '@/classes/item/itemStock';
import ShipMaster from '@/classes/fleet/shipMaster';

export default Vue.extend({
  name: 'Home',
  mounted() {
    const saveData = this.$store.state.saveData as SaveData;
    saveData.disabledMain();
  },
  data: () => ({
    imported: false,
    importConfirmDialog: false,
    importFileName: '引き継ぎデータ',
    confirmDialog: false,
    importedStock: false,
  }),
  computed: {
    isNameEmptry(): boolean {
      return this.importFileName.length <= 0;
    },
  },
  methods: {
    goAirCalcPage() {
      const saveData = this.$store.state.saveData as SaveData;
      saveData.disabledMain();

      // ルートに無題のデータを生成
      const data = new SaveData();
      data.name = saveData.getNewSavedataName();
      data.isActive = true;
      data.isMain = true;
      saveData.childItems.push(data);
      this.$store.dispatch('updateSaveData', saveData);
      this.$store.dispatch('setMainSaveData', data);
      this.$router.push('aircalc');
    },
    checkOldData() {
      // 過去データが存在するかチェック
      const strage = window.localStorage;
      if (!strage) {
        this.$emit('inform', 'Old sortie data not found.', true);
        this.imported = true;
        return;
      }

      const presets = strage.getItem('presets');
      const presetJSON = presets ? JSON.parse(presets) : undefined;
      if (!presetJSON || !presetJSON.length) {
        this.$emit('inform', 'Old sortie data not found.', true);
        this.imported = true;
        return;
      }

      this.imported = false;
      this.importConfirmDialog = true;
    },
    checkOldStockData() {
      this.importedStock = true;

      // 過去データが存在するかチェック
      const strage = window.localStorage;
      if (!strage) {
        this.$emit('inform', 'Ship / Equipment data not found.', true);
        return;
      }

      const shipStocks = strage.getItem('shipStock');
      const itemStocks = strage.getItem('planeStock');
      const shipStocksJSON = shipStocks ? JSON.parse(shipStocks) : undefined;
      const itemStocksJSON = itemStocks ? JSON.parse(itemStocks) : undefined;
      if ((!shipStocksJSON || !shipStocksJSON.length) && (!itemStocksJSON || !itemStocksJSON.length)) {
        this.$emit('inform', 'Ship / Equipment data not found.', true);
        return;
      }

      const hasCurrentStock = !!this.$store.state.shipStock.length || !!this.$store.state.itemStock.length;
      if (hasCurrentStock) {
        // 既にデータがあるならダイアログ
        this.confirmDialog = true;
        this.importedStock = false;
      } else {
        this.importOldStockData();
      }
    },
    importOldStockData() {
      this.importedStock = true;

      // 過去データが存在するかチェック
      const strage = window.localStorage;
      if (!strage) {
        this.$emit('inform', 'Ship / Equipment data not found.', true);
        return;
      }

      const shipStocks = strage.getItem('shipStock');
      const itemStocks = strage.getItem('planeStock');
      const shipStocksJSON = shipStocks ? JSON.parse(shipStocks) : undefined;
      const itemStocksJSON = itemStocks ? JSON.parse(itemStocks) : undefined;
      if ((!shipStocksJSON || !shipStocksJSON.length) && (!itemStocksJSON || !itemStocksJSON.length)) {
        this.$emit('inform', 'Ship / Equipment data not found.', true);
        return;
      }

      try {
        const setting = this.$store.state.siteSetting as SiteSetting;
        let restoreResult = false;
        if (shipStocksJSON && shipStocksJSON.length) {
          // 在籍艦娘情報変換 & 上書き
          const newStocks = Convert.restoreShipStock(shipStocksJSON as OldShipStockJson[], this.$store.state.ships as ShipMaster[]);
          if (newStocks.length) {
            restoreResult = true;
            // 設定書き換え
            setting.isStockOnlyForShipList = true;
            this.$store.dispatch('updateShipStock', newStocks);
          }
        }

        if (itemStocksJSON && itemStocksJSON.length) {
          // 所持装備情報変換 & 上書き
          const newStocks = Convert.restoreItemStock(itemStocksJSON as ItemStock[]);
          if (newStocks.length) {
            restoreResult = true;
            // 設定書き換え
            setting.isStockOnlyForItemList = true;
            this.$store.dispatch('updateItemStock', newStocks);
          }
        }

        this.$store.dispatch('updateSetting', setting);

        if (!restoreResult) {
          this.$emit('inform', 'データを読み込みましたが、引き継ぎ可能な編成データがありませんでした。', true);
          return;
        }

        this.$emit('inform', '所持装備 / 艦娘データの引き継ぎが完了しました。');
      } catch (error) {
        this.$emit('inform', 'データ引継ぎに失敗しました。', true);
        console.error(error);
      }
      this.confirmDialog = false;
    },
    importOldData() {
      this.imported = true;
      // 旧データ引継ぎ
      const strage = window.localStorage;
      try {
        const presets = strage.getItem('presets');
        const presetJSON = presets ? JSON.parse(presets) : undefined;
        if (!presetJSON || !presetJSON.length) {
          return;
        }

        const setting = strage.getItem('setting');
        const settingJSON = setting ? JSON.parse(setting) : undefined;
        const converter = new Convert(this.$store.state.items, this.$store.state.ships, this.$store.state.defaultEnemies);
        const oldData = converter.convertOldSimulatorToSaveData(presetJSON, settingJSON);

        if (oldData && oldData.childItems.length) {
          oldData.name = this.importFileName ? this.importFileName : '引き継ぎデータ';
          // セーブデータルート取得
          const saveData = this.$store.state.saveData as SaveData;
          const root = saveData.childItems.find((v) => v.isDirectory);
          if (root) {
            root.childItems.push(oldData);
            root.sortChild();
            this.$store.dispatch('updateSaveData', saveData);

            // 旧データ取り込み完了通知
            this.$emit('inform', '編成データの引き継ぎが完了しました。');
            this.$emit('openSidebar');
          }
        } else {
          this.$emit('inform', 'データを読み込みましたが、引き継ぎ可能な編成データがありませんでした。', true);
        }
      } catch (error) {
        this.$emit('inform', 'データ引継ぎに失敗しました。', true);
        console.error(error);
      }

      this.importConfirmDialog = false;
    },
  },
});
</script>
