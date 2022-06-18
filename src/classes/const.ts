export interface Formation {
  text: string;
  value: number;
  correction: number;
}
export interface AvoidType {
  text: string;
  value: number;
  c1: number;
  c2: number;
  c3: number;
  c4: number;
}

export const AIR_STATE = {
  KAKUHO: 0,
  YUSEI: 1,
  KINKO: 2,
  RESSEI: 3,
  SOSHITSU: 4,
  NONE: 5,
} as const;
type AIR_STATE = typeof AIR_STATE[keyof typeof AIR_STATE];

/** 艦種 */
export const SHIP_TYPE = {
  DE: 1,
  DD: 2,
  CL: 3,
  CLT: 4,
  CA: 5,
  CAV: 6,
  CVL: 7,
  FBB: 8,
  BB: 9,
  BBV: 10,
  CV: 11,
  BBB: 12,
  SS: 13,
  SSV: 14,
  AO_2: 15,
  AV: 16,
  LHA: 17,
  CVB: 18,
  AR: 19,
  AS: 20,
  CT: 21,
  AO: 22,
} as const;
type SHIP_TYPE = typeof SHIP_TYPE[keyof typeof SHIP_TYPE];

/** 基地札種類 */
export const AB_MODE = {
  WAIT: 0,
  BATTLE: 1,
  DEFFENSE: 2,
} as const;
type AB_MODE = typeof AB_MODE[keyof typeof AB_MODE];

/** 陣形 */
export const FORMATION = {
  LINE_AHEAD: 1,
  DOUBLE_LINE: 2,
  DIAMOND: 3,
  ECHELON: 4,
  LINE_ABREAST: 5,
  VANGUARD: 6,
  FORMATION1: 15,
  FORMATION2: 12,
  FORMATION3: 13,
  FORMATION4: 11,
} as const;
type FORMATION = typeof FORMATION[keyof typeof FORMATION];

/** 戦闘マス形式 */
export const CELL_TYPE = {
  NORMAL: 1,
  GRAND: 2,
  AIR_RAID: 3,
  NIGHT: 4,
  HIGH_AIR_RAID: 5,
  AERIAL_COMBAT: 6,
  SUPER_HIGH_AIR_RAID: 7,
} as const;
type CELL_TYPE = typeof CELL_TYPE[keyof typeof CELL_TYPE];

/** 難易度 */
export const DIFFICULTY_LEVEL = {
  HARD: 0,
  MEDIUM: 1,
  EASY: 2,
  CASUAL: 3,
} as const;
type DIFFICULTY_LEVEL = typeof DIFFICULTY_LEVEL[keyof typeof DIFFICULTY_LEVEL];

/** 火力キャップ */
export const CAP = {
  AS: 170,
  BATTLE: 170,
  NIGHT: 350,
} as const;
type CAP = typeof CAP[keyof typeof CAP];

/** 難易度 */
export const SUPPORT_TYPE = {
  SHELLING: 0,
  AIRSTRIKE: 1,
  ANTI_SUBMARINE: 2,
  LONG_RANGE_TORPEDO: 3,
  NOT_FOUND_DD: 4,
  NONE: 5,
} as const;
type SUPPORT_TYPE = typeof SUPPORT_TYPE[keyof typeof SUPPORT_TYPE];

export default class Const {
  /**
 * 基地航空隊札一覧
 * @static
 * @memberof Const
 */
  public static readonly AIR_STATUS = [
    { text: 'AS+', value: AIR_STATE.KAKUHO, color: 'green' },
    { text: 'AS', value: AIR_STATE.YUSEI, color: 'light-green' },
    { text: 'AP', value: AIR_STATE.KINKO, color: 'yellow' },
    { text: 'AD', value: AIR_STATE.RESSEI, color: 'deep-orange' },
    { text: 'AI', value: AIR_STATE.SOSHITSU, color: 'red' },
    { text: 'None', value: AIR_STATE.NONE, color: 'secondary' },
  ];

  /**
   * 基地航空隊札一覧
   * @static
   * @memberof Const
   */
  public static readonly AB_MODE_ITEMS = [
    { text: 'Sortie', value: AB_MODE.BATTLE },
    { text: 'Defense', value: AB_MODE.DEFFENSE },
    { text: 'Standby', value: AB_MODE.WAIT },
  ];

  public static readonly PLANE_TYPES = [6, 7, 8, 9, 10, 11, 41, 45, 47, 48, 49, 53, 57];

  public static readonly CB_PLANE_TYPES = [6, 7, 8, 9, 57];

  public static readonly SP_PLANE_TYPES = [10, 11, 41, 45];

  public static readonly AB_PLANE_TYPES = [47, 48, 49, 53];

  public static readonly FIGHTERS = [6, 45, 48];

  public static readonly ATTACKERS = [7, 8, 11, 47, 53, 57];

  public static readonly RECONNAISSANCES = [9, 10, 41, 49];

  public static readonly AB_ATTACKERS = [47, 53];

  public static readonly AB_ATTACKERS_LARGE = [53];

  public static readonly ROCKET = [350, 351, 352];

  public static readonly BAKUSEN = [60, 154, 219, 447];

  public static readonly ENABLED_LANDBASE_ATTACK = [64, 148, 233, 277, 305, 306, 319, 320, 391, 392, 420, 421];

  public static readonly ENABLED_ASW_SUPPORT = [7, 8, 10, 11, 45, 41, 25, 26];

  public static readonly ITEM_API_TYPE = [
    { id: 6, name: 'Carrier-based Fighter', sortKey: ['antiAir', 'avoid', 'accuracy', 'scout', 'radius', 'cost'] },
    { id: 7, name: 'Carrier-based Dive Bomber', sortKey: ['bomber', 'antiAir', 'accuracy', 'asw', 'avoid', 'scout', 'radius', 'avoidId', 'cost'] },
    { id: 8, name: 'Carrier-based Torpedo Bomber', sortKey: ['torpedo', 'antiAir', 'accuracy', 'asw', 'avoid', 'scout', 'radius', 'avoidId', 'cost'] },
    { id: 9, name: 'Carrier-based Recon Aircraft', sortKey: ['scout', 'accuracy', 'avoid', 'antiAir', 'radius', 'avoidId', 'cost'] },
    { id: 57, name: 'Jet-type Aircraft', sortKey: ['bomber', 'antiAir', 'accuracy', 'avoid', 'scout', 'radius', 'avoidId', 'cost'] },
    { id: 10, name: 'Seaplane Recon', sortKey: ['scout', 'accuracy', 'avoid', 'antiAir', 'radius', 'avoidId', 'cost'] },
    { id: 11, name: 'Seaplane Bomber', sortKey: ['bomber', 'antiAir', 'accuracy', 'avoid', 'scout', 'radius', 'avoidId', 'cost'] },
    { id: 45, name: 'Seaplane Fighter', sortKey: ['antiAir', 'avoid', 'accuracy', 'scout', 'radius', 'cost'] },
    { id: 41, name: 'Large Flying Boat', sortKey: ['scout', 'accuracy', 'avoid', 'antiAir', 'radius', 'avoidId', 'cost'] },
    { id: 47, name: 'Land-based Bomber', sortKey: ['torpedo', 'bomber', 'antiAir', 'asw', 'accuracy', 'avoid', 'scout', 'radius', 'avoidId', 'cost'] },
    { id: 53, name: 'Heavy Bomber', sortKey: ['torpedo', 'bomber', 'antiAir', 'accuracy', 'avoid', 'scout', 'radius', 'avoidId', 'cost'] },
    { id: 48, name: 'Land-based Fighter', sortKey: ['antiAir', 'antiBomber', 'interception', 'radius', 'cost'] },
    { id: 49, name: 'Land-based Recon Aircraft', sortKey: ['scout', 'accuracy', 'avoid', 'antiAir', 'radius', 'avoidId', 'cost'] },
    { id: 1, name: 'Small Caliber Gun', sortKey: ['fire', 'accuracy', 'antiAir', 'armor', 'range'] },
    { id: 2, name: 'Medium Caliber Gun', sortKey: ['fire', 'accuracy', 'antiAir', 'armor', 'range'] },
    { id: 3, name: 'Large Caliber Gun', sortKey: ['fire', 'accuracy', 'antiAir', 'armor', 'range'] },
    { id: 4, name: 'Secondary Gun', sortKey: ['fire', 'accuracy', 'antiAir', 'armor', 'range'] },
    { id: 5, name: 'Torpedo', sortKey: ['torpedo', 'accuracy', 'armor'] },
    { id: 12, name: 'Small Radar', sortKey: ['antiAir', 'accuracy', 'scout', 'fire', 'armor'] },
    { id: 13, name: 'Large Radar', sortKey: ['antiAir', 'accuracy', 'scout', 'fire', 'armor'] },
    { id: 14, name: 'Sonar', sortKey: ['asw', 'accuracy', 'scout'] },
    { id: 15, name: 'Depth Charge', sortKey: ['asw', 'accuracy'] },
    { id: 17, name: 'Boiler' },
    { id: 18, name: 'Anti-Air Shell' },
    { id: 19, name: 'Armor Piercing Shell' },
    { id: 21, name: 'Anti-Aircraft Gun', sortKey: ['antiAir', 'accuracy', 'fire', 'armor', 'avoid'] },
    { id: 22, name: 'Midget Submarine', sortKey: ['torpedo', 'accuracy', 'avoid', 'scout'] },
    { id: 23, name: 'Emergency Repair Personnel' },
    { id: 24, name: 'Landing Craft', sortKey: ['fire', 'antiAir', 'armor', 'avoid', 'scout', 'tp'] },
    { id: 25, name: 'Autogyro' },
    { id: 26, name: 'ASW Patrol Aircraft' },
    { id: 27, name: 'Anti-torpedo Bulge (Medium)' },
    { id: 28, name: 'Anti-torpedo Bulge (Large)' },
    { id: 29, name: 'Searchlight' },
    { id: 30, name: 'Drum Canister' },
    { id: 31, name: 'Ship Repair Facility' },
    { id: 32, name: 'Submarine Torpedo', sortKey: ['torpedo', 'accuracy', 'avoid'] },
    { id: 33, name: 'Flare' },
    { id: 34, name: 'Fleet Command Facility' },
    { id: 35, name: 'Aviation Personnel' },
    { id: 36, name: 'AAFD' },
    { id: 37, name: 'Anti-Ground Rocket' },
    { id: 39, name: 'Skilled Lookouts' },
    { id: 40, name: 'Large Sonar' },
    { id: 42, name: 'Large Searchlight' },
    { id: 43, name: 'Combat Ration' },
    { id: 44, name: 'Underway Replenishmnet' },
    { id: 46, name: 'Type 2 KaMi Tank' },
    { id: 50, name: 'Transport Equipment' },
    { id: 51, name: 'Submarine Equipment' },
  ];

  /**
   * 艦種一覧
   * @static
   * @memberof Const
   */
  public static readonly SHIP_TYPES_INFO = [
    { id: SHIP_TYPE.DE, name: '海防艦', itemType: [1, 12, 14, 15, 21, 23, 36, 37, 39, 43] },
    { id: SHIP_TYPE.DD, name: '駆逐艦', itemType: [1, 5, 12, 14, 15, 17, 21, 23, 29, 30, 33, 36, 37, 39, 43] },
    { id: SHIP_TYPE.CL, name: '軽巡洋艦', itemType: [1, 2, 4, 5, 10, 12, 13, 14, 15, 17, 21, 23, 29, 30, 33, 34, 36, 37, 39, 43] },
    { id: SHIP_TYPE.CLT, name: '重雷装巡洋艦', itemType: [1, 2, 4, 5, 12, 13, 14, 15, 17, 21, 22, 23, 33, 34, 36, 39, 43] },
    { id: SHIP_TYPE.CA, name: '重巡洋艦', itemType: [2, 4, 5, 10, 12, 13, 17, 18, 21, 23, 27, 29, 33, 34, 36, 39, 40, 43] },
    { id: SHIP_TYPE.CAV, name: '航空巡洋艦', itemType: [2, 4, 5, 10, 11, 12, 13, 17, 18, 21, 23, 25, 27, 29, 30, 33, 34, 35, 36, 37, 39, 40, 43, 45, 50] },
    { id: SHIP_TYPE.CVL, name: '軽空母', itemType: [4, 6, 7, 8, 9, 12, 13, 17, 21, 23, 25, 26, 27, 34, 35, 36, 40, 43, 50] },
    { id: SHIP_TYPE.FBB, name: '高速戦艦', itemType: [3, 4, 10, 12, 13, 17, 18, 19, 21, 23, 28, 29, 33, 34, 36, 39, 40, 42, 43] },
    { id: SHIP_TYPE.BB, name: '戦艦', itemType: [2, 3, 4, 10, 12, 13, 17, 18, 19, 21, 23, 28, 29, 33, 34, 36, 39, 40, 42, 43] },
    { id: SHIP_TYPE.BBV, name: '航空戦艦', itemType: [2, 3, 4, 10, 11, 12, 13, 17, 18, 19, 21, 23, 25, 28, 29, 33, 34, 35, 36, 37, 39, 40, 42, 43, 45, 50] },
    { id: SHIP_TYPE.CV, name: '正規空母', itemType: [4, 6, 7, 8, 9, 12, 13, 17, 21, 23, 28, 34, 35, 36, 40, 43, 50] },
    { id: SHIP_TYPE.BBB, name: '超弩級戦艦', itemType: [2, 3, 4, 10, 12, 13, 17, 18, 19, 21, 23, 28, 29, 33, 34, 36, 39, 40, 42, 43] },
    { id: SHIP_TYPE.SS, name: '潜水艦', itemType: [5, 14, 17, 22, 23, 32, 37, 43, 46, 51] },
    { id: SHIP_TYPE.SSV, name: '潜水空母', itemType: [5, 10, 11, 14, 17, 22, 23, 32, 37, 43, 45, 46, 51] },
    { id: SHIP_TYPE.AO_2, name: '補給艦', itemType: [0] },
    { id: SHIP_TYPE.AV, name: '水上機母艦', itemType: [1, 4, 10, 11, 12, 13, 15, 17, 21, 22, 23, 24, 27, 29, 30, 33, 34, 36, 37, 39, 40, 43, 45, 46, 50] },
    { id: SHIP_TYPE.LHA, name: '揚陸艦', itemType: [1, 4, 12, 15, 17, 21, 23, 24, 25, 26, 30, 34, 36, 37, 40, 43, 46, 50] },
    { id: SHIP_TYPE.CVB, name: '装甲空母', itemType: [4, 6, 7, 8, 9, 12, 13, 17, 21, 23, 28, 34, 35, 36, 40, 43, 50] },
    { id: SHIP_TYPE.AR, name: '工作艦', itemType: [1, 4, 12, 17, 21, 23, 25, 27, 31, 33, 36, 43, 50] },
    { id: SHIP_TYPE.AS, name: '潜水母艦', itemType: [1, 4, 10, 12, 17, 21, 23, 25, 27, 33, 34, 36, 37, 39, 40, 43, 45] },
    { id: SHIP_TYPE.CT, name: '練習巡洋艦', itemType: [1, 2, 4, 5, 10, 12, 13, 14, 15, 17, 21, 23, 27, 34, 36, 39, 43] },
    { id: SHIP_TYPE.AO, name: '補給艦', itemType: [1, 10, 11, 12, 17, 21, 23, 25, 30, 35, 36, 43, 44, 45] },
  ];

  public static readonly SHIP_TYPES_ALT_INFO = [
    { id: 6, name: 'Kongou-class' },
    { id: 26, name: 'Fusou-class' },
    { id: 2, name: 'Ise-class' },
    { id: 19, name: 'Nagato-class' },
    { id: 37, name: 'Yamato-class' },
    { id: 14, name: 'Akagi-class' },
    { id: 3, name: 'Kaga-class' },
    { id: 17, name: 'Souryuu-class' },
    { id: 25, name: 'Hiryuu-class' },
    { id: 33, name: 'Shoukaku-class' },
    { id: 53, name: 'Unryuu-class' },
    { id: 43, name: 'Taihou-class' },
    { id: 27, name: 'Houshou-class' },
    { id: 32, name: 'Ryuujou-class' },
    { id: 51, name: 'Ryuuhou-class' },
    { id: 11, name: 'Shouhou-class' },
    { id: 24, name: 'Hiyou-class' },
    { id: 15, name: 'Chitose-class' },
    { id: 76, name: 'Taiyou-class' },
    { id: 75, name: 'Kasuga Maru-class' },
    { id: 72, name: 'Kamoi-class' },
    { id: 62, name: 'Mizuho-class' },
    { id: 90, name: 'Nisshin-class' },
    { id: 59, name: 'Akitsushima-class' },
    { id: 100, name: 'Jingei-class' },
    { id: 50, name: 'Taigei-class' },
    { id: 60, name: 'Revised Kazahaya-class' },
    { id: 49, name: 'Akashi-class' },
    { id: 111, name: 'PL10' },
    { id: 7, name: 'Furutaka-class' },
    { id: 13, name: 'Aoba-class' },
    { id: 29, name: 'Myoukou-class' },
    { id: 8, name: 'Takao-class' },
    { id: 9, name: 'Mogami-class' },
    { id: 31, name: 'Tone-class' },
    { id: 21, name: 'Tenryuu-class' },
    { id: 4, name: 'Kuma-class' },
    { id: 20, name: 'Nagara-class' },
    { id: 16, name: 'Sendai-class' },
    { id: 34, name: 'Yuubari-class' },
    { id: 41, name: 'Agano-class' },
    { id: 52, name: 'Ooyodo-class' },
    { id: 56, name: 'Katori-class' },
    { id: 66, name: 'Kamikaze-class' },
    { id: 28, name: 'Mutsuki-class' },
    { id: 12, name: 'Fubuki-class' },
    { id: 1, name: 'Ayanami-class' },
    { id: 5, name: 'Akatsuki-class' },
    { id: 10, name: 'Hatsuharu-class' },
    { id: 23, name: 'Shiratsuyu-class' },
    { id: 18, name: 'Asashio-class' },
    { id: 30, name: 'Kagerou-class' },
    { id: 38, name: 'Yuugumo-class' },
    { id: 54, name: 'Akizuki-class' },
    { id: 22, name: 'Shimakaze-class' },
    { id: 101, name: 'Matsu-class' },
    { id: 74, name: 'Shimushu-class' },
    { id: 77, name: 'Etorofu-class' },
    { id: 94, name: 'Mikura-class' },
    { id: 85, name: 'Hiburi-class' },
    { id: 104, name: 'D-type Coastal Defense Ship' },
    { id: 71, name: 'Junsen Type A Kai Ni' },
    { id: 44, name: 'Sentoku-class (I-400-class)' },
    { id: 35, name: 'Kaidai VI-class' },
    { id: 40, name: 'Junsen Type 3' },
    { id: 39, name: 'Junsen Type B' },
    { id: 103, name: 'Junsen Type C' },
    { id: 36, name: 'Junsen Type B Kai Ni' },
    { id: 109, name: 'Sentaka-class' },
    { id: 80, name: 'Guglielmo Marconi-class' },
    { id: 57, name: 'U-boat IXC-class' },
    { id: 86, name: 'Ro-type Submarine' },
    { id: 46, name: 'Type 3 Submergible Transport Boat' },
    { id: 97, name: 'Army Aircraft Carrier (R1)' },
    { id: 45, name: 'Hei-class' },
    { id: 115, name: '2TL-class' },

    { id: 47, name: 'Bismarck-class' },
    { id: 55, name: 'Admiral Hipper-class' },
    { id: 63, name: 'Graf Zeppelin-class' },
    { id: 48, name: 'Z1-class' },

    { id: 58, name: 'V.Veneto-class' },
    { id: 68, name: 'Aquila-class' },
    { id: 64, name: 'Zara-class' },
    { id: 92, name: 'L.d.S.D.d.Abruzzi-class' },
    { id: 61, name: 'Maestrale-class' },
    { id: 113, name: 'Conte di Cavour-class' },

    { id: 93, name: 'Colorado-class' },
    { id: 107, name: 'North Carolina-class' },
    { id: 102, name: 'South Dakota-class' },
    { id: 65, name: 'Iowa-class' },
    { id: 69, name: 'Lexington-class' },
    { id: 105, name: 'Yorktown-class' },
    { id: 84, name: 'Essex-class' },
    { id: 83, name: 'Casablanca-class' },
    { id: 95, name: 'Northampton-class' },
    { id: 110, name: 'Brooklyn-class' },
    { id: 106, name: 'St.Louis-class' },
    { id: 99, name: 'Atlanta-class' },
    { id: 91, name: 'Fletcher-class' },
    { id: 87, name: 'John C.Butler-class' },
    { id: 114, name: 'Gato-class' },

    { id: 67, name: 'Queen Elizabeth-class' },
    { id: 88, name: 'Nelson-class' },
    { id: 78, name: 'Ark Royal-class' },
    { id: 112, name: 'Illustrious-class' },
    { id: 108, name: 'Town-class' },
    { id: 82, name: 'J-class' },

    { id: 79, name: 'Richelieu-class' },
    { id: 70, name: 'C.Teste-class' },

    { id: 73, name: 'Гангут-class' },
    { id: 81, name: 'Ташкент-class' },

    { id: 89, name: 'Gotland-class' },

    { id: 98, name: 'De Ruyter-class' },
    { id: 96, name: 'Perth-class' },

    { id: 42, name: '(霧の艦隊?)' },
  ];

  /**
   * 補強増設に搭載可能
   * @static
   * @memberof Const
   */
  public static readonly EXPANDED_ITEM_TYPE = [17, 21, 23, 27, 28, 36, 39, 43, 44, 51];

  // 特定の艦娘が特定スロットに装備『できない！』やつ
  public static readonly FORBIDDEN_LINK_SHIP_ITEM = [
    // 伊勢改二 第3，4，5スロットに 主砲系
    {
      shipId: 553, index: [3, 4, 5], itemType: [2, 3], itemIDs: [0],
    },
    // 日向改二 第3，4，5スロットに 主砲系
    {
      shipId: 554, index: [3, 4, 5], itemType: [2, 3], itemIDs: [0],
    },
    // 夕張改二 4スロットに 主砲系 魚雷系 不可
    {
      shipId: 622, index: [4], itemType: [1, 2, 5], itemIDs: [0],
    },
    // 夕張改二特 4スロットに 主砲系 魚雷系 不可
    {
      shipId: 623, index: [4], itemType: [1, 2, 5, 22], itemIDs: [0],
    },
    // 夕張改二丁 4スロットに 主砲系 魚雷系 不可
    {
      shipId: 624, index: [4], itemType: [1, 2, 5], itemIDs: [0],
    },
    // 夕張改二 5スロットに いろいろ装備不可
    {
      shipId: 622, index: [5], itemType: [1, 2, 5, 14, 15, 17, 20, 22, 23, 24, 27, 29, 30, 33, 34, 36, 37, 39, 40, 46], itemIDs: [0],
    },
    // 夕張改二特 5スロットに いろいろ装備不可
    {
      shipId: 623, index: [5], itemType: [1, 2, 5, 14, 15, 17, 20, 22, 23, 24, 27, 29, 30, 33, 34, 36, 37, 39, 40, 46], itemIDs: [0],
    },
    // 夕張改二丁 5スロットに いろいろ装備不可
    {
      shipId: 624, index: [5], itemType: [1, 2, 5, 14, 15, 17, 20, 22, 23, 24, 27, 29, 30, 33, 34, 36, 37, 39, 40, 46], itemIDs: [0],
    },
    // 能代改二 4スロットに 魚雷系 不可
    {
      shipId: 662, index: [4], itemType: [5, 22], itemIDs: [0],
    },
    // 矢矧改二 4スロットに 魚雷系 不可
    {
      shipId: 663, index: [4], itemType: [5, 22], itemIDs: [0],
    },
    // 矢矧改二乙 4スロットに 魚雷系 不可
    {
      shipId: 668, index: [4], itemType: [5], itemIDs: [0],
    },
    // Richelieu改 全スロットに 瑞雲系
    {
      shipId: 392, index: [1, 2, 3, 4, 5], itemType: [0], itemIDs: [26, 62, 79, 80, 81, 207, 208, 237, 322, 323, 367, 368, 369],
    },
  ];

  /**
   * 艦種一覧 省略系と含む艦種
   * @static
   * @memberof Const
   */
  public static readonly SHIP_TYPES_ALT = [
    { text: 'CV(B)', types: [11, 18] },
    { text: 'CVL', types: [7] },
    { text: '(F)BB', types: [8, 9] },
    { text: 'BBV', types: [10] },
    { text: 'CA', types: [5] },
    { text: 'CAV', types: [6] },
    { text: 'CL', types: [3, 4, 21] },
    { text: 'DD', types: [2] },
    { text: 'DE', types: [1] },
    { text: 'SS(V)', types: [13, 14] },
    { text: 'AUX', types: [15, 16, 17, 19, 20, 22] },
  ];

  /**
   * 艦種一覧 省略系と含む艦種 艦隊分析用
   * @static
   * @memberof Const
   */
  public static readonly SHIP_TYPES_ALT2 = [
    { text: 'Standard Aircraft Carrier', types: [11, 18] },
    { text: 'Light Aircraft Carrier', types: [7] },
    { text: 'Battleship', types: [8, 9, 10] },
    { text: 'Heavy Cruiser', types: [5, 6] },
    { text: 'Light Cruiser', types: [3, 4, 21] },
    { text: 'Destroyer', types: [2] },
    { text: 'Coastal Defense Ship', types: [1] },
    { text: 'Submarine', types: [13, 14] },
    { text: 'Auxiliary Ship', types: [15, 16, 17, 19, 20, 22] },
  ];

  public static readonly USA = [65, 69, 83, 84, 87, 91, 93, 95, 99, 102, 105, 106, 107, 110, 114];

  public static readonly ITA = [58, 61, 64, 68, 80, 92, 113];

  public static readonly GBR = [67, 78, 82, 88, 108, 112];

  public static readonly DEU = [47, 48, 55, 57, 63];

  public static readonly FRA = [70, 79];

  public static readonly RUS = [73, 81];

  public static readonly SWE = [89];

  public static readonly AUS = [96];

  public static readonly NLD = [98];

  /**
   * 日本艦かどうか判定
   * @static
   * @param {number} type
   * @returns {boolean}
   * @memberof Const
   */
  public static isJPN(type: number): boolean {
    let others = Const.USA.concat();
    others = others.concat(Const.ITA);
    others = others.concat(Const.GBR);
    others = others.concat(Const.DEU);
    others = others.concat(Const.FRA);
    others = others.concat(Const.RUS);
    others = others.concat(Const.SWE);
    others = others.concat(Const.AUS);
    others = others.concat(Const.NLD);
    return !others.includes(type);
  }

  /**
   * 陣形一覧
   * @static
   * @memberof Const
   */
  public static readonly FORMATIONS: Formation[] = [
    { text: 'Line Ahead', value: FORMATION.LINE_AHEAD, correction: 1.0 },
    { text: 'Double Line', value: FORMATION.DOUBLE_LINE, correction: 1.2 },
    { text: 'Diamond', value: FORMATION.DIAMOND, correction: 1.6 },
    { text: 'Echelon', value: FORMATION.ECHELON, correction: 1.0 },
    { text: 'Line Abreast', value: FORMATION.LINE_ABREAST, correction: 1.0 },
    { text: 'Vanguard', value: FORMATION.VANGUARD, correction: 1.1 },
    { text: 'CF 1', value: FORMATION.FORMATION1, correction: 1.1 },
    { text: 'CF 2', value: FORMATION.FORMATION2, correction: 1.0 },
    { text: 'CF 3', value: FORMATION.FORMATION3, correction: 1.5 },
    { text: 'CF 4', value: FORMATION.FORMATION4, correction: 1.0 },
  ];

  /**
 * 支援一覧
 * @static
 * @memberof Const
 */
  public static readonly SUPPORTS = [
    { text: 'Shelling Support', value: SUPPORT_TYPE.SHELLING },
    { text: 'Aerial Support', value: SUPPORT_TYPE.AIRSTRIKE },
    { text: 'ASW Support', value: SUPPORT_TYPE.ANTI_SUBMARINE },
    { text: 'Torpedo Support', value: SUPPORT_TYPE.LONG_RANGE_TORPEDO },
    { text: 'No Support (2 DD required)', value: SUPPORT_TYPE.NOT_FOUND_DD },
    { text: 'None', value: SUPPORT_TYPE.NONE },
  ];

  /**
   * 装備一覧 ちょっとまとめたやつと、装備一覧表示のステータス
   * @static
   * @memberof Const
   */
  public static readonly ITEM_TYPES_ALT = [
    {
      id: 1, text: 'Small Caliber Gun', viewStatus: ['actualFire', 'antiAir', 'actualAccuracy', 'armor', 'antiAirWeight', 'antiAirBonus'], types: [1],
    },
    {
      id: 2, text: 'Medium Caliber Gun', viewStatus: ['actualFire', 'antiAir', 'actualAccuracy', 'armor', 'antiAirWeight', 'antiAirBonus'], types: [2],
    },
    {
      id: 3, text: 'Large Caliber Gun', viewStatus: ['actualFire', 'antiAir', 'actualAccuracy', 'armor', 'antiAirWeight', 'antiAirBonus'], types: [3],
    },
    {
      id: 6, text: 'Fighter', viewStatus: ['antiAir', 'actualAntiAir', 'actualAccuracy', 'avoid', 'airPower', 'radius'], types: [6],
    },
    {
      id: 7, text: 'Dive Bomber', viewStatus: ['actualBomber', 'actualAntiAir', 'actualAccuracy', 'actualAsw', 'avoidId', 'radius'], types: [7],
    },
    {
      id: 8, text: 'Torpedo Bomber', viewStatus: ['actualTorpedo', 'actualAntiAir', 'actualAccuracy', 'asw', 'avoidId', 'radius'], types: [8],
    },
    {
      id: 9, text: 'Recon', viewStatus: ['actualScout', 'actualFire', 'actualAccuracy', 'actualAntiAir', 'radius', 'cost'], types: [9],
    },
    {
      id: 57, text: 'Jet-type Fighter-Bomber', viewStatus: ['actualBomber', 'actualAccuracy', 'actualAntiAir', 'avoidId', 'airPower', 'cost'], types: [57],
    },
    {
      id: 5, text: 'Torpedo', viewStatus: ['actualTorpedo', 'actualFire', 'actualAccuracy', 'avoid', 'armor'], types: [5, 22, 32],
    },
    {
      id: 10, text: 'Seaplane Bomber', viewStatus: ['actualBomber', 'actualAntiAir', 'actualAccuracy', 'actualScout', 'radius', 'avoidId'], types: [10, 11],
    },
    {
      id: 45, text: 'Seaplane Fighter', viewStatus: ['antiAir', 'actualAntiAir', 'actualScout', 'actualAccuracy', 'radius', 'airPower'], types: [45],
    },
    {
      id: 41, text: 'Large Flying Boat', viewStatus: ['actualScout', 'actualAccuracy', 'actualAsw', 'radius', 'cost'], types: [41],
    },
    {
      id: 12, text: 'Radar', viewStatus: ['actualFire', 'antiAir', 'actualAccuracy', 'actualScout', 'antiAirWeight', 'antiAirBonus'], types: [12, 13],
    },
    {
      id: 14, text: 'ASW', viewStatus: ['actualAsw', 'actualAccuracy', 'armor', 'avoid', 'actualScout'], types: [14, 15, 40],
    },
    {
      id: 4, text: 'Secondary Gun', viewStatus: ['actualFire', 'antiAir', 'actualAccuracy', 'armor', 'antiAirWeight', 'antiAirBonus'], types: [4],
    },
    {
      id: 21, text: 'Machine Gun', viewStatus: ['actualFire', 'antiAir', 'actualAccuracy', 'antiAirWeight', 'antiAirBonus'], types: [21],
    },
    {
      id: 24, text: 'Landing Craft', viewStatus: ['actualFire', 'antiAir', 'actualScout', 'avoid', 'armor', 'tp'], types: [24, 30, 46],
    },
    {
      id: 47, text: 'Land-based Bomber', viewStatus: ['actualTorpedo', 'actualBomber', 'actualAntiAir', 'radius', 'avoidId', 'airPower'], types: [47, 53],
    },
    {
      id: 48, text: 'Land-based Fighter', viewStatus: ['antiBomber', 'actualAntiAir', 'radius', 'actualDefenseAntiAir', 'airPower', 'defenseAirPower'], types: [48],
    },
    {
      id: 49, text: 'Land-based Recon', viewStatus: ['actualAntiAir', 'actualScout', 'actualAccuracy', 'radius', 'armor', 'cost'], types: [49],
    },
    {
      id: 17, text: 'Other', viewStatus: ['actualFire', 'antiAir', 'actualAccuracy', 'actualScout', 'asw', 'armor'], types: [17, 18, 19, 23, 25, 26, 27, 28, 29, 31, 33, 34, 35, 36, 37, 39, 42, 43, 44, 50, 51],
    },
  ]

  /**
   * 戦闘マス形式
   * @static
   * @memberof Const
   */
  public static readonly CELL_TYPES = [
    { text: 'Single Fleet', value: CELL_TYPE.NORMAL },
    { text: 'Combined Fleet', value: CELL_TYPE.GRAND },
    { text: 'Air Raid', value: CELL_TYPE.AIR_RAID },
    { text: 'Night Battle', value: CELL_TYPE.NIGHT },
    { text: 'High Altitude Raid', value: CELL_TYPE.HIGH_AIR_RAID },
    { text: 'Aerial Combat', value: CELL_TYPE.AERIAL_COMBAT },
    { text: 'Super Heavy Bomb Raid', value: CELL_TYPE.SUPER_HIGH_AIR_RAID },
  ];

  /**
   * 戦闘マス形式
   * @static
   * @memberof Const
   */
  public static readonly DIFFICULTY_LEVELS = [
    { text: '甲', value: DIFFICULTY_LEVEL.HARD },
    { text: '乙', value: DIFFICULTY_LEVEL.MEDIUM },
    { text: '丙', value: DIFFICULTY_LEVEL.EASY },
    { text: '丁', value: DIFFICULTY_LEVEL.CASUAL },
  ];

  /**
   * 艦載機熟練度ボーダー
   * @static
   * @memberof Const
   */
  public static readonly PROF_LEVEL_BORDER = [0, 10, 25, 40, 55, 70, 85, 100, 120];

  /**
   * 対空射撃回避 任意
   * @static
   * @memberof Const
   */
  public static readonly MANUAL_AVOID = 99;

  /**
   * 補強増設を識別するindex
   * @static
   * @memberof Const
   */
  public static readonly EXPAND_SLOT_INDEX = 99;

  /**
   * 対空射撃回避
   * @static
   * @memberof Const
   */
  public static readonly AVOID_TYPE: AvoidType[] = [
    {
      value: 0, text: 'None', c1: 1, c2: 1, c3: 1, c4: 1,
    },
    {
      value: 1, text: 'Weak', c1: 0.6, c2: 1, c3: 1, c4: 1,
    },
    {
      value: 2, text: 'Moderate', c1: 0.6, c2: 0.7, c3: 1, c4: 1,
    },
    {
      value: 3, text: 'Strong', c1: 0.5, c2: 0.7, c3: 1, c4: 1,
    },
    {
      value: 4, text: 'Massive', c1: 0.5, c2: 0.5, c3: 1, c4: 1,
    },
    {
      value: Const.MANUAL_AVOID, text: 'Any', c1: 1, c2: 1, c3: 1, c4: 1,
    },
  ];

  /**
   * 対空CI
   * @static
   * @memberof Const
   */
  public static readonly ANTIAIR_CUTIN = [
    {
      id: 0, text: 'None', rateBonus: 1, c1: 1, c2: 0, rate: 100, remarks: '',
    },
    {
      id: 1, text: '1', rateBonus: 1.7, c1: 3, c2: 5, rate: 65, remarks: 'Akizuki-class',
    },
    {
      id: 2, text: '2', rateBonus: 1.7, c1: 3, c2: 4, rate: 58, remarks: 'Akizuki-class',
    },
    {
      id: 3, text: '3', rateBonus: 1.6, c1: 2, c2: 3, rate: 50, remarks: 'Akizuki-class',
    },
    {
      id: 4, text: '4', rateBonus: 1.5, c1: 5, c2: 2, rate: 52, remarks: 'Battleship',
    },
    {
      id: 5, text: '5', rateBonus: 1.5, c1: 2, c2: 3, rate: 55, remarks: 'Any',
    },
    {
      id: 6, text: '6', rateBonus: 1.45, c1: 4, c2: 1, rate: 40, remarks: 'Battleship',
    },
    {
      id: 7, text: '7', rateBonus: 1.35, c1: 2, c2: 2, rate: 45, remarks: 'Any',
    },
    {
      id: 8, text: '8', rateBonus: 1.4, c1: 2, c2: 3, rate: 50, remarks: 'Any',
    },
    {
      id: 9, text: '9', rateBonus: 1.3, c1: 1, c2: 2, rate: 40, remarks: 'Any',
    },
    {
      id: 10, text: '10', rateBonus: 1.65, c1: 3, c2: 6, rate: 60, remarks: 'Maya Kai Ni',
    },
    {
      id: 11, text: '11', rateBonus: 1.5, c1: 2, c2: 5, rate: 55, remarks: 'Maya Kai Ni',
    },
    {
      id: 12, text: '12', rateBonus: 1.25, c1: 1, c2: 3, rate: 45, remarks: 'Any',
    },
    {
      id: 14, text: '14', rateBonus: 1.45, c1: 4, c2: 1, rate: 63, remarks: 'Isuzu Kai Ni',
    },
    {
      id: 15, text: '15', rateBonus: 1.3, c1: 3, c2: 1, rate: 54, remarks: 'Isuzu Kai Ni',
    },
    {
      id: 16, text: '16', rateBonus: 1.4, c1: 4, c2: 1, rate: 62, remarks: 'Kasumi Kai Ni B / Yuubari Kai Ni',
    },
    {
      id: 17, text: '17', rateBonus: 1.25, c1: 2, c2: 1, rate: 57, remarks: 'Kasumi Kai Ni B / Yuubari Kai Ni',
    },
    {
      id: 18, text: '18', rateBonus: 1.2, c1: 2, c2: 1, rate: 59, remarks: 'Satsuki Kai Ni',
    },
    {
      id: 19, text: '19', rateBonus: 1.45, c1: 5, c2: 1, rate: 60, remarks: 'Kinu Kai Ni',
    },
    {
      id: 20, text: '20', rateBonus: 1.25, c1: 3, c2: 1, rate: 65, remarks: 'Kinu Kai Ni',
    },
    {
      id: 21, text: '21', rateBonus: 1.45, c1: 5, c2: 1, rate: 60, remarks: 'Yura Kai Ni',
    },
    {
      id: 22, text: '22', rateBonus: 1.2, c1: 2, c2: 1, rate: 65, remarks: 'Fukizuki Kai Ni',
    },
    {
      id: 23, text: '23', rateBonus: 1.05, c1: 1, c2: 1, rate: 80, remarks: 'UIT-25 / I-504',
    },
    {
      id: 24, text: '24', rateBonus: 1.25, c1: 3, c2: 1, rate: 62, remarks: 'Tenryuu-class Kai Ni',
    },
    {
      id: 25, text: '25', rateBonus: 1.55, c1: 7, c2: 1, rate: 60, remarks: 'Ise-class',
    },
    {
      id: 26, text: '26', rateBonus: 1.4, c1: 6, c2: 1, rate: 60, remarks: 'Musashi Kai Ni',
    },
    {
      id: 28, text: '28', rateBonus: 1.4, c1: 4, c2: 1, rate: 56, remarks: 'Ise-class / Musashi',
    },
    {
      id: 29, text: '29', rateBonus: 1.55, c1: 5, c2: 1, rate: 60, remarks: 'Hamakaze B Kai / Isukaze B Kai',
    },
    {
      id: 30, text: '30', rateBonus: 1.3, c1: 3, c2: 1, rate: 50, remarks: 'Tenryuu Kai Ni / Gotland',
    },
    {
      id: 31, text: '31', rateBonus: 1.25, c1: 2, c2: 1, rate: 50, remarks: 'Tenryuu Kai Ni',
    },
    {
      id: 32, text: '32', rateBonus: 1.2, c1: 3, c2: 1, rate: 60, remarks: 'Kongou-class Kai Ni / Royal Navy',
    },
    {
      id: 33, text: '33', rateBonus: 1.35, c1: 3, c2: 1, rate: 42, remarks: 'Gotland',
    },
    {
      id: 34, text: '34', rateBonus: 1.6, c1: 7, c2: 1, rate: 60, remarks: 'Fletcher-class',
    },
    {
      id: 35, text: '35', rateBonus: 1.55, c1: 6, c2: 1, rate: 55, remarks: 'Fletcher-class',
    },
    {
      id: 36, text: '36', rateBonus: 1.55, c1: 6, c2: 1, rate: 50, remarks: 'Fletcher-class',
    },
    {
      id: 37, text: '37', rateBonus: 1.45, c1: 2, c2: 3, rate: 40, remarks: 'Fletcher-class',
    },
    {
      id: 38, text: '38', rateBonus: 1.85, c1: 6, c2: 5, rate: 60, remarks: 'Atlanta-class',
    },
    {
      id: 39, text: '39', rateBonus: 1.7, c1: 6, c2: 5, rate: 60, remarks: 'Atlanta-class',
    },
    {
      id: 40, text: '40', rateBonus: 1.7, c1: 6, c2: 5, rate: 60, remarks: 'Atlanta-class',
    },
    {
      id: 41, text: '41', rateBonus: 1.65, c1: 5, c2: 5, rate: 60, remarks: 'Atlanta-class',
    },
  ];

  /**
   * 経験値最低値ボーダー
   * @static
   * @memberof Const
   */
  public static readonly LEVEL_BORDERS = [
    { lv: 175, req: 10950000 },
    { lv: 174, req: 10266000 },
    { lv: 173, req: 9705000 },
    { lv: 172, req: 9248000 },
    { lv: 171, req: 8875000 },
    { lv: 170, req: 8580000 },
    { lv: 169, req: 8350000 },
    { lv: 168, req: 8172000 },
    { lv: 167, req: 8033000 },
    { lv: 166, req: 7920000 },
    { lv: 165, req: 7820000 },
    { lv: 164, req: 7320000 },
    { lv: 163, req: 6910000 },
    { lv: 162, req: 6580000 },
    { lv: 161, req: 6320000 },
    { lv: 160, req: 6120000 },
    { lv: 159, req: 5970000 },
    { lv: 158, req: 5860000 },
    { lv: 157, req: 5780000 },
    { lv: 156, req: 5720000 },
    { lv: 155, req: 5470000 },
    { lv: 154, req: 5230000 },
    { lv: 153, req: 4999000 },
    { lv: 152, req: 4777000 },
    { lv: 151, req: 4564000 },
    { lv: 150, req: 4360000 },
    { lv: 149, req: 4165000 },
    { lv: 148, req: 3978000 },
    { lv: 147, req: 3799000 },
    { lv: 146, req: 3628000 },
    { lv: 145, req: 3465000 },
    { lv: 144, req: 3310000 },
    { lv: 143, req: 3162000 },
    { lv: 142, req: 3021000 },
    { lv: 141, req: 2887000 },
    { lv: 140, req: 2760000 },
    { lv: 139, req: 2640000 },
    { lv: 138, req: 2525000 },
    { lv: 137, req: 2415000 },
    { lv: 136, req: 2310000 },
    { lv: 135, req: 2210000 },
    { lv: 134, req: 2115000 },
    { lv: 133, req: 2025000 },
    { lv: 132, req: 1940000 },
    { lv: 131, req: 1860000 },
    { lv: 130, req: 1785000 },
    { lv: 129, req: 1714000 },
    { lv: 128, req: 1647000 },
    { lv: 127, req: 1584000 },
    { lv: 126, req: 1525000 },
    { lv: 125, req: 1470000 },
    { lv: 124, req: 1419000 },
    { lv: 123, req: 1372000 },
    { lv: 122, req: 1329000 },
    { lv: 121, req: 1290000 },
    { lv: 120, req: 1255000 },
    { lv: 119, req: 1223000 },
    { lv: 118, req: 1194000 },
    { lv: 117, req: 1168000 },
    { lv: 116, req: 1145000 },
    { lv: 115, req: 1125000 },
    { lv: 114, req: 1107000 },
    { lv: 113, req: 1091000 },
    { lv: 112, req: 1077000 },
    { lv: 111, req: 1065000 },
    { lv: 110, req: 1055000 },
    { lv: 109, req: 1046000 },
    { lv: 108, req: 1038000 },
    { lv: 107, req: 1031000 },
    { lv: 106, req: 1025000 },
    { lv: 105, req: 1020000 },
    { lv: 104, req: 1016000 },
    { lv: 103, req: 1013000 },
    { lv: 102, req: 1011000 },
    { lv: 101, req: 1010000 },
    { lv: 100, req: 1000000 },
    { lv: 99, req: 1000000 },
    { lv: 98, req: 851500 },
    { lv: 97, req: 761500 },
    { lv: 96, req: 701500 },
    { lv: 95, req: 661500 },
    { lv: 94, req: 631500 },
    { lv: 93, req: 606500 },
    { lv: 92, req: 584500 },
    { lv: 91, req: 564500 },
    { lv: 90, req: 545500 },
    { lv: 89, req: 527000 },
    { lv: 88, req: 509000 },
    { lv: 87, req: 491500 },
    { lv: 86, req: 474500 },
    { lv: 85, req: 458000 },
    { lv: 84, req: 442000 },
    { lv: 83, req: 426500 },
    { lv: 82, req: 411500 },
    { lv: 81, req: 397000 },
    { lv: 80, req: 383000 },
    { lv: 79, req: 369400 },
    { lv: 78, req: 356200 },
    { lv: 77, req: 343400 },
    { lv: 76, req: 331000 },
    { lv: 75, req: 319000 },
    { lv: 74, req: 307400 },
    { lv: 73, req: 296200 },
    { lv: 72, req: 285400 },
    { lv: 71, req: 275000 },
    { lv: 70, req: 265000 },
    { lv: 69, req: 255300 },
    { lv: 68, req: 245900 },
    { lv: 67, req: 236800 },
    { lv: 66, req: 228000 },
    { lv: 65, req: 219500 },
    { lv: 64, req: 211300 },
    { lv: 63, req: 203400 },
    { lv: 62, req: 195800 },
    { lv: 61, req: 188500 },
    { lv: 60, req: 181500 },
    { lv: 59, req: 174700 },
    { lv: 58, req: 168100 },
    { lv: 57, req: 161700 },
    { lv: 56, req: 155500 },
    { lv: 55, req: 149500 },
    { lv: 54, req: 143700 },
    { lv: 53, req: 138100 },
    { lv: 52, req: 132700 },
    { lv: 51, req: 127500 },
    { lv: 50, req: 122500 },
    { lv: 49, req: 117600 },
    { lv: 48, req: 112800 },
    { lv: 47, req: 108100 },
    { lv: 46, req: 103500 },
    { lv: 45, req: 99000 },
    { lv: 44, req: 94600 },
    { lv: 43, req: 90300 },
    { lv: 42, req: 86100 },
    { lv: 41, req: 82000 },
    { lv: 40, req: 78000 },
    { lv: 39, req: 74100 },
    { lv: 38, req: 70300 },
    { lv: 37, req: 66600 },
    { lv: 36, req: 63000 },
    { lv: 35, req: 59500 },
    { lv: 34, req: 56100 },
    { lv: 33, req: 52800 },
    { lv: 32, req: 49600 },
    { lv: 31, req: 46500 },
    { lv: 30, req: 43500 },
    { lv: 29, req: 40600 },
    { lv: 28, req: 37800 },
    { lv: 27, req: 35100 },
    { lv: 26, req: 32500 },
    { lv: 25, req: 30000 },
    { lv: 24, req: 27600 },
    { lv: 23, req: 25300 },
    { lv: 22, req: 23100 },
    { lv: 21, req: 21000 },
    { lv: 20, req: 19000 },
    { lv: 19, req: 17100 },
    { lv: 18, req: 15300 },
    { lv: 17, req: 13600 },
    { lv: 16, req: 12000 },
    { lv: 15, req: 10500 },
    { lv: 14, req: 9100 },
    { lv: 13, req: 7800 },
    { lv: 12, req: 6600 },
    { lv: 11, req: 5500 },
    { lv: 10, req: 4500 },
    { lv: 9, req: 3600 },
    { lv: 8, req: 2800 },
    { lv: 7, req: 2100 },
    { lv: 6, req: 1500 },
    { lv: 5, req: 1000 },
    { lv: 4, req: 600 },
    { lv: 3, req: 300 },
    { lv: 2, req: 100 },
    { lv: 1, req: 0 },
  ];
}
