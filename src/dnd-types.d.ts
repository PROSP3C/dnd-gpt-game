export type CharacterRace =
  | 'Human'
  | 'Dwarf'
  | 'Elf'
  | 'Halfling'
  | 'Gnome'
  | 'Half-Elf'
  | 'Half-Orc'
  | 'Dragonborn'
  | 'Tiefling'

export type CharacterClass =
  | 'Barbarian'
  | 'Bard'
  | 'Cleric'
  | 'Druid'
  | 'Fighter'
  | 'Monk'
  | 'Paladin'
  | 'Ranger'
  | 'Rogue'
  | 'Sorcerer'
  | 'Warlock'
  | 'Wizard'

type ID = string

interface Geo {
  x?: number
  y?: number
  region?: ID
}

interface BasePlace {
  id: ID
  name: string
  description?: string
  tags?: string[]
  coords?: Geo
  createdAt?: string
}

export interface Town extends BasePlace {
  kind: 'town'
  isTown: true
  population?: number
  government?: string
  districts?: ID[]
  containedLandmarks?: ID[]
  services?: string[]
}

export interface Landmark extends BasePlace {
  kind: 'landmark'
  isLandmark: true
  type?: 'monument' | 'shrine' | 'statue' | 'ruin' | 'natural'
  locatedWithin?: ID
  loreTags?: string[]
}

export interface Dungeon extends BasePlace {
  kind: 'dungeon'
  levelRange?: { min: number; max?: number }
  difficulty?: 'easy' | 'medium' | 'hard'
  entrances?: Geo[]
  connectedRooms?: ID[]
}

export interface Region extends BasePlace {
  kind: 'region'
  biome?: 'forest' | 'plains' | 'mountain' | 'coast' | string
  subareas?: ID[]
}
