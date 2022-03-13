/* eslint-disable camelcase */
export interface MasterItem { id: number, type: number, itype: number, name: string, abbr: string, fire: number, antiAir: number, torpedo: number, bomber: number, armor: number, asw: number, antiBomber: number, interception: number, scout: number, canRemodel: number, accuracy: number, avoid2: number, radius: number, cost: number, avoid: number, range: number, grow: number }
export interface MasterShip { id: number, album: number, type: number, name: string, s_count: number, slots: number[], final: number, orig: number, ver: number, range: number, type2: number, hp: number, hp2: number, max_hp: number, fire: number, torpedo: number, anti_air: number, armor: number, luck: number, max_luck: number, min_scout: number, scout: number, min_asw: number, asw: number, min_avoid: number, avoid: number, befor: number, next_lv: number, sort: number }
export interface MasterEnemy { id: number, type: number, slot_count: number, name: string, slots: number[], items: number[], hp: number, aa: number, armor: number, landbase: number }
export interface MasterShipType { api_id: number, api_name: string, api_equip_type: number[] }
export interface MasterEquipmentShip { api_ship_id: number, api_equip_type: number[] }
export interface MasterEquipmentExSlot { api_slotitem_id: number, api_ship_ids: number[] }

export interface Master {
  api_mst_equip_exslot_ship: MasterEquipmentExSlot[],
  api_mst_equip_ship: MasterEquipmentShip[],
  api_mst_stype: MasterShipType[],
  ships: MasterShip[],
  items: MasterItem[],
  enemies: MasterEnemy[]
}