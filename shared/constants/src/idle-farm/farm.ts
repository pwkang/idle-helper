import ms from 'ms';

export const IDLE_FARM_FARM_TYPE = {
  forest: 'forest',
  waterPond: 'water pond',
  potatoFarm: 'potato farm',
  wheatFarm: 'wheat farm',
  desert: 'desert',
  cottonFarm: 'cotton farm',

  coalCave: 'coal cave',
  ironCave: 'iron cave',
  copperCave: 'copper cave',
  aluminiumCave: 'aluminium cave',
  cowsRanch: 'cows ranch',
  sawMill: 'saw mill',

  textileMill: 'textile mill',
  bakery: 'bakery',
  artificialVolcano: 'artificial volcano',
  ironSmelter: 'iron smelter',
  copperSmelter: 'copper smelter',
  aluminiumSmelter: 'aluminium smelter',

  steelFoundry: 'steel foundry',
  goldSmelter: 'gold smelter',
  yoghurtFactory: 'yoghurt factory',
  cheeseFactory: 'cheese factory',
  glassFactory: 'glass factory',

  fabricMill: 'fabric mill',
  chairFactory: 'chair factory',
  wireFactory: 'wire factory',

  lootboxFarm: 'lootbox farm',
  pumpkinFarm: 'pumpkin farm',
  pumpkinCarver: 'pumpkin carver'
} as const;

export const IDLE_FARM_TIME_BOOSTER_DURATION = {
  timeSpeeder: ms('2h'),
  timeCompressor: ms('4h')
} as const;
