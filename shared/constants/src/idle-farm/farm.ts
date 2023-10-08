import ms from 'ms';

export const IDLE_FARM_FARM_TYPE = {
  forest: 'forest',
  waterPond: 'water pond',
  potatoFarm: 'potato farm',
  wheatFarm: 'wheat farm',
  desert: 'desert',

  coalCave: 'coal cave',
  ironCave: 'iron cave',
  copperCave: 'copper cave',
  aluminumCave: 'aluminum cave',

  textileMill: 'textile mill',
  bakery: 'bakery',
  artificialVolcano: 'artificial volcano',
  ironSmelter: 'iron smelter',
  copperSmelter: 'copper smelter',
  aluminumSmelter: 'aluminum smelter'
} as const;

export const IDLE_FARM_TIME_BOOSTER_DURATION = {
  timeSpeeder: ms('2h'),
  timeCompressor: ms('4h')
} as const;
