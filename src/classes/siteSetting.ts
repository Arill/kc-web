export default class SiteSetting {
  public id: string;

  /** タブを閉じる際に確認ダイアログを出す */
  public confirmCloseTab: boolean;

  /** サイトテーマ */
  public darkTheme: boolean;

  /** 初期熟練度リスト */
  public planeInitialLevels: { id: number, level: number }[];

  /** 装備一覧 表示形式 複数列かどうか */
  public isMultiLineForItemList: boolean;

  /** 艦娘一覧 表示形式 複数列かどうか */
  public isMultiLineForShipList: boolean;

  /** 装備一覧 所持装備のみ表示かどうか */
  public isStockOnlyForItemList: boolean;

  /** 装備一覧 在籍艦娘のみ表示かどうか */
  public isStockOnlyForShipList: boolean;

  /** 在籍艦娘一覧 表示モード */
  public viewTableMode: boolean;

  /** 基地最小化 */
  public isMinimizedAirbase: boolean;

  /** 自艦隊最小化 */
  public isMinimizedFleet: boolean;

  /** 敵艦隊最小化 */
  public isMinimizedEnemy: boolean;

  /** 計算結果最小化 */
  public isMinimizedResult: boolean;

  /** コンテンツ順序 id準拠 */
  public contentOrder: string[];

  constructor(setting?: SiteSetting) {
    if (setting) {
      this.id = setting.id;
      this.confirmCloseTab = !!setting.confirmCloseTab;
      this.darkTheme = !!setting.darkTheme;
      this.isMultiLineForItemList = !!setting.isMultiLineForItemList;
      this.isMultiLineForShipList = !!setting.isMultiLineForShipList;
      this.isStockOnlyForItemList = !!setting.isStockOnlyForItemList;
      this.isStockOnlyForShipList = !!setting.isStockOnlyForShipList;
      this.viewTableMode = !!setting.viewTableMode;
      this.isMinimizedAirbase = !!setting.isMinimizedAirbase;
      this.isMinimizedFleet = !!setting.isMinimizedFleet;
      this.isMinimizedEnemy = !!setting.isMinimizedEnemy;
      this.isMinimizedResult = !!setting.isMinimizedResult;

      if (!setting.planeInitialLevels || !setting.planeInitialLevels.length) {
        this.planeInitialLevels = [
          { id: 6, level: 100 },
          { id: 7, level: 0 },
          { id: 8, level: 0 },
          { id: 9, level: 100 },
          { id: 57, level: 0 },
          { id: 10, level: 100 },
          { id: 11, level: 0 },
          { id: 45, level: 100 },
          { id: 41, level: 100 },
          { id: 47, level: 0 },
          { id: 53, level: 0 },
          { id: 48, level: 100 },
          { id: 49, level: 0 },
        ];
        this.contentOrder = [];
      } else {
        this.planeInitialLevels = setting.planeInitialLevels;
      }
      this.contentOrder = setting.contentOrder ? setting.contentOrder : [];
    } else {
      this.id = 'setting';
      this.confirmCloseTab = true;
      this.darkTheme = false;
      this.isMultiLineForItemList = true;
      this.isMultiLineForShipList = true;
      this.isStockOnlyForItemList = false;
      this.isStockOnlyForShipList = false;
      this.viewTableMode = true;
      this.isMinimizedAirbase = false;
      this.isMinimizedFleet = false;
      this.isMinimizedEnemy = false;
      this.isMinimizedResult = false;

      this.planeInitialLevels = [
        { id: 6, level: 100 },
        { id: 7, level: 0 },
        { id: 8, level: 0 },
        { id: 9, level: 100 },
        { id: 57, level: 0 },
        { id: 10, level: 100 },
        { id: 11, level: 0 },
        { id: 45, level: 100 },
        { id: 41, level: 100 },
        { id: 47, level: 0 },
        { id: 53, level: 0 },
        { id: 48, level: 100 },
        { id: 49, level: 0 },
      ];
      this.contentOrder = [];
    }
  }
}