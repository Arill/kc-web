<template>
  <div class="mx-4 mt-4">
    <div class="body-2 mt-2 mb-5">You can upload your fleet and preset data to be published on the (Main Page > Public Fleets) page.</div>
    <v-form ref="uploadForm">
      <v-text-field v-model="editedName" dense outlined counter="100" label="Preset save data name" :rules="nameRules" required></v-text-field>
      <v-textarea
        v-model.trim="editedRemarks"
        rows="8"
        dense
        outlined
        label="Additional information"
        required
        :rules="remarksRules"
        class="remarks-input mt-2"
      ></v-textarea>
      <div class="d-flex mt-2">
        <div class="flex-grow-1">
          <v-select
            dense
            v-model="area"
            outlined
            hide-details
            :items="areaItems"
            label="Map"
            :menu-props="{ maxHeight: '600px' }"
          ></v-select>
        </div>
        <div v-show="isEvent" class="ml-5">
          <v-select dense v-model="level" outlined hide-details :items="levelItems" label="Difficulty"></v-select>
        </div>
      </div>
      <div class="mt-5">
        <v-text-field v-model="uploadUserName" :rules="userNameRules" dense outlined counter="20" label="Author"></v-text-field>
      </div>
    </v-form>
    <div class="d-flex">
      <v-btn class="ml-auto" color="primary" @click.stop="validateUpload">Upload</v-btn>
      <v-btn class="ml-4" color="secondary" @click.stop="editDialog = false">Back</v-btn>
    </div>
    <v-dialog v-model="uploadConfirmDialog" transition="scroll-x-transition" width="600">
      <v-card class="pa-3">
        <div class="ma-4">
          <div>Are you sure you want to upload?</div>
          <div class="caption mt-5 mx-3">
            <div>Please check again if the map and difficulty specified are correct.</div>
            <div>By principle, you cannot edit or delete the data after the upload.</div>
            <div>IF you really want to delete it, contact us with information</div>
            <div>
              that can identify the preset (such as name, poster, map, upload date and time) through <a href="https://odaibako.net/u/noro_006" class="blue--text text--accent-1" target="_blank">here</a>
            </div>
          </div>
        </div>
        <v-divider class="my-2"></v-divider>
        <div class="d-flex">
          <v-btn class="ml-auto" color="primary" :dark="!uploadClicked" :disabled="uploadClicked" @click.stop="uploadSaveData">Continue</v-btn>
          <v-btn class="ml-4" color="secondary" @click.stop="uploadConfirmDialog = false">Back</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import cloneDeep from 'lodash/cloneDeep';
import Const, { DIFFICULTY_LEVEL } from '@/classes/const';
import SaveData from '@/classes/saveData/saveData';
import SiteSetting from '@/classes/siteSetting';
import {
  addDoc, collection, getFirestore, serverTimestamp,
} from 'firebase/firestore/lite';
import LZString from 'lz-string';
import { MasterMap, MasterWorld } from '@/classes/interfaces/master';

export default Vue.extend({
  name: 'UploadSaveData',
  props: {
    saveData: {
      type: SaveData,
      required: true,
    },
    dataName: {
      type: String,
      required: true,
    },
    dataRemarks: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    areaItems: [] as ({ divider: boolean } | { header: string } | { value: number; text: string; group: string })[],
    area: 11,
    editedName: '',
    editedRemarks: '',
    level: DIFFICULTY_LEVEL.HARD,
    levelItems: Const.DIFFICULTY_LEVELS,
    uploadUserName: '',
    uploadConfirmDialog: false,
    uploadClicked: false,
    nameRules: [(v: string) => !!v || '編成名は必須です。', (v: string) => v.length <= 100 || '1～100文字以内で入力してください。'],
    remarksRules: [(v: string) => !!v || 'Additional informationは必須です。'],
    userNameRules: [(v: string) => v.length <= 20 || '0～20文字以内で入力してください。'],
  }),
  mounted() {
    // 海域セレクトボックス初期化
    if (!this.areaItems.length) {
      const items = [];
      const worlds = this.$store.state.worlds as MasterWorld[];
      const masterMaps = this.$store.state.maps as MasterMap[];
      for (let i = 0; i < worlds.length; i += 1) {
        const world = worlds[i];
        const maps = masterMaps.filter((v) => Math.floor(v.area / 10) === world.world);
        if (!maps.length) {
          continue;
        }
        if (i > 0) {
          items.push({ divider: true });
        }

        items.push({ header: world.name });
        for (let j = 0; j < maps.length; j += 1) {
          const map = maps[j];
          const { area } = map;
          const mapName = map.name;
          const worldText = world.world > 40 ? 'E' : `${world.world}`;
          items.push({ value: area, text: `${worldText}-${area % 10} : ${mapName}`, group: world.name });
        }
      }
      this.areaItems = items;
    }
    const setting = this.$store.state.siteSetting as SiteSetting;
    this.uploadUserName = setting.userName;

    this.initControl();
  },
  computed: {
    isEvent(): boolean {
      return Math.floor(this.area / 10) > 40;
    },
  },
  methods: {
    initControl() {
      this.editedName = this.dataName;
      this.editedRemarks = this.dataRemarks;
      // 現在計算画面で開かれているデータを取得
      const data = this.saveData.getMainData();
      if (data && data.tempData[data.tempIndex]) {
        const manager = data.tempData[data.tempIndex];
        const lastEnemyArea = manager.battleInfo.fleets[manager.battleInfo.fleets.length - 1].area;
        // 最終戦闘マスのareaがあればそれを初期値とする
        if (lastEnemyArea) {
          this.area = lastEnemyArea;
        }
      }
    },
    validateUpload() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const valid = (this.$refs.uploadForm as any).validate() as boolean;
      if (valid) {
        this.uploadConfirmDialog = true;
        this.uploadClicked = false;
      }
    },
    async uploadSaveData() {
      this.uploadClicked = true;
      const data = this.saveData.getMainData();
      if (data) {
        try {
          const tempSaveData = new SaveData();
          tempSaveData.tempData = [cloneDeep(data.tempData[data.tempIndex])];
          tempSaveData.tempIndex = 0;
          tempSaveData.saveManagerData();

          const newPreset = {
            id: tempSaveData.id,
            name: this.editedName,
            data: LZString.compressToBase64(tempSaveData.manager),
            memo: this.editedRemarks,
            createdAt: serverTimestamp(),
            map: this.area,
            level: this.area > 400 ? 4 - this.level : 0,
            user: this.uploadUserName ? this.uploadUserName : '',
            ver: 2,
          };
          const db = getFirestore();
          await addDoc(collection(db, 'presets'), newPreset);
          this.$emit('inform', 'アップロードが完了しました。');

          if (this.uploadUserName) {
            // 投稿者名があれば次回使うように保存
            const setting = this.$store.state.siteSetting as SiteSetting;
            setting.userName = this.uploadUserName;
            this.$store.dispatch('updateSetting', setting);
          }
        } catch (error) {
          console.error(error);
          this.$emit('inform', 'アップロードに失敗しました。', true);
        }
      }
      this.uploadConfirmDialog = false;
    },
  },
});
</script>
