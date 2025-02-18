<template>
  <v-sheet drak>
    <div class="d-flex header">
      <div v-if="!fixedDrawer">
        <v-btn icon large @click="handleClose()">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </div>
      <div class="align-self-center">
        <v-tooltip bottom color="black">
          <template v-slot:activator="{ on, attrs }">
            <div class="home d-flex px-1 flex-grow-1" v-ripple @click="openGitHub()" v-bind="attrs" v-on="on">
              <v-icon>mdi-github</v-icon>
              <div class="align-self-center mx-1">制空権シミュレータ</div>
              <div class="align-self-center caption">v{{ $store.state.siteVersion }}</div>
            </div>
          </template>
          <span>GitHub Repository</span>
        </v-tooltip>
      </div>
      <div class="ml-auto btn-icons">
        <v-tooltip bottom color="black">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon small @click.stop="addNewFile" v-bind="attrs" v-on="on">
              <v-icon color="blue lighten-3">mdi-note-plus</v-icon>
            </v-btn>
          </template>
          <span>新しい編成を作成</span>
        </v-tooltip>
        <v-tooltip bottom color="black">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon small @click.stop="addNewDirectory" v-bind="attrs" v-on="on">
              <v-icon color="yellow lighten-1">mdi-folder-plus</v-icon>
            </v-btn>
          </template>
          <span>新しいフォルダーを作成</span>
        </v-tooltip>
        <v-tooltip bottom color="black">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon small @click.stop="openAllDirectory" v-bind="attrs" v-on="on">
              <v-icon color="orange lighten-3">mdi-expand-all</v-icon>
            </v-btn>
          </template>
          <span>フォルダーを全て開く</span>
        </v-tooltip>
        <v-tooltip bottom color="black">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon small @click.stop="closeAllDirectory" v-bind="attrs" v-on="on">
              <v-icon color="grey">mdi-collapse-all</v-icon>
            </v-btn>
          </template>
          <span>フォルダーを全て閉じる</span>
        </v-tooltip>
        <v-tooltip bottom color="black">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="grey lighten-2" v-show="enabledFixDrawer" icon small @click="toggleFixDrawer()" v-bind="attrs" v-on="on">
              <v-icon v-if="fixedDrawer">mdi-pin</v-icon>
              <v-icon v-else>mdi-pin-outline</v-icon>
            </v-btn>
          </template>
          <span v-if="!fixedDrawer">サイドバー固定</span>
          <span v-else>サイドバー固定解除</span>
        </v-tooltip>
      </div>
    </div>
    <v-divider></v-divider>
    <div class="item-container">
      <save-item v-for="(item, i) in rootData.childItems" :key="i" :value="item" :index="i" :handle-delete="deleteChild" />
    </div>
  </v-sheet>
</template>

<style scoped>
.v-sheet {
  height: 100%;
  font-size: 0.8em;
  display: flex;
  flex-flow: column;
}
.header {
  padding: 2px;
}
.btn-icons {
  align-self: center;
}

.btn-icons .v-icon {
  font-size: 20px !important;
}
.item-container {
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.home {
  margin-top: 4px;
  margin-bottom: 4px;
  height: 36px;
  cursor: pointer;
  user-select: none;
  border-radius: 0.2rem;
}
.home:hover {
  background-color: rgba(128, 128, 128, 0.2);
}
</style>

<script lang="ts">
import Vue from 'vue';
import SaveData from '@/classes/saveData/saveData';
import SiteSetting from '@/classes/siteSetting';
import SaveItem from './SaveItem.vue';

export default Vue.extend({
  components: { SaveItem },
  name: 'SaveDataView',
  props: {
    rootData: {
      type: SaveData,
      required: true,
    },
    handleInform: {
      type: Function,
      required: true,
    },
    enabledFixDrawer: {
      type: Boolean,
      default: false,
    },
    fixedDrawer: {
      type: Boolean,
      default: false,
    },
    handleClose: {
      type: Function,
      required: true,
    },
  },
  methods: {
    addNewFile() {
      // 新規データ
      const data = new SaveData();
      data.name = 'New Data ';
      data.isUnsaved = false;
      this.addNewSaveData(data);
    },
    addNewDirectory() {
      // 新規フォルダー
      const folder = new SaveData();
      folder.name = 'New Folder ';
      folder.isDirectory = true;
      folder.isUnsaved = false;
      this.addNewSaveData(folder);
      this.handleInform('New Folder created.');
    },
    addNewSaveData(saveData: SaveData) {
      const data = this.rootData.childItems;
      for (let i = 0; i < data.length; i += 1) {
        if (data[i].addNewFileToSelectedData(saveData)) {
          // セーブデータの更新を通知
          this.$store.dispatch('updateSaveData', this.rootData);
          this.handleInform(`新しい${saveData.isDirectory ? 'フォルダー' : '編成'}を作成しました。`);
          return;
        }
      }

      // 最後まで選択状態ファイルが見つからなければ、保存されたデータの直下いき
      const folder = this.rootData.childItems.find((v) => v.isDirectory);
      if (folder) {
        if (!saveData.isDirectory) {
          saveData.name = folder.getNewSavedataName();
        }
        folder.isOpen = true;
        folder.childItems.push(saveData);
        folder.sortChild();
        // セーブデータの更新を通知
        this.$store.dispatch('updateSaveData', this.rootData);
        this.handleInform(`新しい${saveData.isDirectory ? 'フォルダー' : '編成'}を作成しました。`);
      }
    },
    openAllDirectory() {
      this.rootData.openDirectory();
    },
    closeAllDirectory() {
      this.rootData.closeDirectory();
    },
    deleteChild(index: number) {
      this.rootData.childItems = this.rootData.childItems.filter((v, i) => i !== index);
      this.handleInform('削除が完了しました。');
      // セーブデータの更新を通知
      this.$store.dispatch('updateSaveData', this.rootData);
    },
    openGitHub() {
      window.open('https://github.com/arill/kc-web/', '_blank');
    },
    toggleFixDrawer() {
      const setting = this.$store.state.siteSetting as SiteSetting;
      setting.fixedDrawer = !setting.fixedDrawer;
      this.$store.dispatch('updateSetting', setting);
    },
  },
});
</script>
