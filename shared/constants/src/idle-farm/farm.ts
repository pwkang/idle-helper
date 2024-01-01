import ms from 'ms';

export const IDLE_FARM_FARM_TYPE = {
  forest: 'forest',
  waterPond: 'water pond',
  potatoFarm: 'potato farm',
  wheatFarm: 'wheat farm',
  sugarCaneFarm: 'sugar cane farm',
  desert: 'desert',

  tomatoFarm: 'tomato farm',
  cottonFarm: 'cotton farm',
  coalCave: 'coal cave',
  ironCave: 'iron cave',
  copperCave: 'copper cave',
  aluminiumCave: 'aluminium cave',

  cowsRanch: 'cows ranch',
  lithiumExtractor: 'lithium extractor',
  sawMill: 'saw mill',
  textileMill: 'textile mill',
  bakery: 'bakery',
  pastaBakery: 'pasta bakery',

  artificialVolcano: 'artificial volcano',
  ironSmelter: 'iron smelter',
  copperSmelter: 'copper smelter',
  aluminiumSmelter: 'aluminium smelter',
  siliconSmelter: 'silicon smelter',
  steelFoundry: 'steel foundry',

  goldSmelter: 'gold smelter',
  algaePlantarium: 'algae plantarium',
  yoghurtFactory: 'yoghurt factory',
  cheeseFactory: 'cheese factory',
  tomatoSaucinator: 'tomato saucinator',
  glassFactory: 'glass factory',

  residueRecycler: 'residue recycler',
  sawdustRecycler: 'sawdust recycler',
  fabricMill: 'fabric mill',
  ropeFactory: 'rope factory',
  chairFactory: 'chair factory',
  gearFactory: 'gear factory',

  wireFactory: 'wire factory',
  pizzeria: 'pizzeria',
  bulbFactory: 'bulb factory',

  lootboxFarm: 'lootbox farm',
  pumpkinFarm: 'pumpkin farm',
  pumpkinCarver: 'pumpkin carver',

  candyBakery: 'candy bakery',
  snowyFactory: 'snowy factory'

} as const;

export const IDLE_FARM_TIME_BOOSTER_DURATION = {
  timeSpeeder: ms('2h'),
  timeCompressor: ms('4h')
} as const;
