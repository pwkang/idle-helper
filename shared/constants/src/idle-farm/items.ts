export const IDLE_FARM_ITEMS_MATERIAL = {
  wood: 'wood',
  stick: 'stick',
  apple: 'apple',
  leaf: 'leaf',
  water: 'water',
  rock: 'rock',
  sand: 'sand',
  algae: 'algae',
  potato: 'potato',
  dirt: 'dirt',
  root: 'root',
  wheat: 'wheat',
  seed: 'seed',
  bug: 'bug',
  brokenBottle: 'broken bottle',
  goldNugget: 'gold nugget',
  cotton: 'cotton',
  coal: 'coal',
  ironOre: 'iron ore',
  copperOre: 'copper ore',
  dust: 'dust',
  aluminiumOre: 'aluminium ore',
  milk: 'milk',
  meat: 'meat',
  leather: 'leather',
  horn: 'horn',
  sawdust: 'sawdust'
} as const;

export const IDLE_FARM_ITEMS_REFINED = {
  plank: 'plank',
  thread: 'thread',
  ironIngot: 'iron ingot',
  copperIngot: 'copper ingot',
  aluminiumIngot: 'aluminium ingot',
  steelIngot: 'steel ingot',
  goldIngot: 'gold ingot',
  yoghurt: 'yoghurt',
  bacteria: 'bacteria',
  cheese: 'cheese',
  dustIngot: 'dust ingot',
  dirtIngot: 'dirt ingot',
  dusirtIngot: 'dusirt ingot',
  bread: 'bread',
  burntFood: 'burnt food',
  lava: 'lava',
  glass: 'glass',
  brokenGlass: 'broken glass'
} as const;

export const IDLE_FARM_ITEMS_PACKING_MATERIAL = {
  ...IDLE_FARM_ITEMS_MATERIAL,
  ...IDLE_FARM_ITEMS_REFINED
} as const;

export const IDLE_FARM_ITEMS_PRODUCT = {
  fabric: 'fabric',
  chair: 'chair',
  wire: 'wire'
} as const;

export const IDLE_FARM_ITEMS_CONSUMABLE = {
  energyGlass: 'energy glass',
  energyDrink: 'energy drink',
  energyGalloon: 'energy galloon',
  timeSpeeder: 'time speeder',
  timeCompressor: 'time compressor',
  uselessDice: 'useless dice',
  commonDice: 'common dice',
  uncommonDice: 'uncommon dice',
  rareDice: 'rare dice',
  epicDice: 'epic dice',
  mythicDice: 'mythic dice',
  uselessLootbox: 'useless lootbox',
  commonLootbox: 'common lootbox',
  uncommonLootbox: 'uncommon lootbox',
  rareLootbox: 'rare lootbox',
  epicLootbox: 'epic lootbox',
  mythicLootbox: 'mythic lootbox'
} as const;

export const IDLE_FARM_ITEMS_BOX = {
  woodBox: 'wood box',
  stickBox: 'stick box',
  appleBox: 'apple box',
  leafBox: 'leaf box',
  waterBox: 'water box',
  rockBox: 'rock box',
  sandBox: 'sand box',
  algaeBox: 'algae box',
  potatoBox: 'potato box',
  dirtBox: 'dirt box',
  rootBox: 'root box',
  wheatBox: 'wheat box',
  seedBox: 'seed box',
  bugBox: 'bug box',
  brokenBottleBox: 'broken bottle box',
  goldNuggetBox: 'gold nugget box',
  cottonBox: 'cotton box',
  coalBox: 'coal box',
  ironOreBox: 'iron ore box',
  copperOreBox: 'copper ore box',
  dustBox: 'dust box',
  aluminiumOreBox: 'aluminium ore box',
  milkBox: 'milk box',
  meatBox: 'meat box',
  leatherBox: 'leather box',
  hornBox: 'horn box',
  sawdustBox: 'sawdust box'
} as const;

export const IDLE_FARM_ITEMS_CONTAINER = {
  plankContainer: 'plank container',
  threadContainer: 'thread container',
  ironIngotContainer: 'iron ingot container',
  copperIngotContainer: 'copper ingot container',
  aluminiumIngotContainer: 'aluminium ingot container',
  steelIngotContainer: 'steel ingot container',
  goldIngotContainer: 'gold ingot container',
  yoghurtContainer: 'yoghurt container',
  bacteriaContainer: 'bacteria container',
  cheeseContainer: 'cheese container',
  dustIngotContainer: 'dust ingot container',
  dirtIngotContainer: 'dirt ingot container',
  dusirtIngotContainer: 'dusirt ingot container',
  breadContainer: 'bread container',
  burntFoodContainer: 'burnt food container',
  lavaContainer: 'lava container',
  glassContainer: 'glass container',
  brokenGlassContainer: 'broken glass container'
} as const;

export const IDLE_FARM_ITEMS_PACKING_ITEMS = {
  ...IDLE_FARM_ITEMS_BOX,
  ...IDLE_FARM_ITEMS_CONTAINER
} as const;

export const IDLE_FARM_ITEMS = {
  workerTokens: 'worker tokens',
  ...IDLE_FARM_ITEMS_MATERIAL,
  ...IDLE_FARM_ITEMS_REFINED,
  ...IDLE_FARM_ITEMS_PRODUCT,
  ...IDLE_FARM_ITEMS_CONSUMABLE,
  ...IDLE_FARM_ITEMS_BOX,
  ...IDLE_FARM_ITEMS_CONTAINER
} as const;

export const IDLE_FARM_ITEMS_BOX_TYPE = {
  wood: 'woodBox',
  stick: 'stickBox',
  apple: 'appleBox',
  leaf: 'leafBox',
  water: 'waterBox',
  rock: 'rockBox',
  sand: 'sandBox',
  algae: 'algaeBox',
  potato: 'potatoBox',
  dirt: 'dirtBox',
  root: 'rootBox',
  wheat: 'wheatBox',
  seed: 'seedBox',
  bug: 'bugBox',
  brokenBottle: 'brokenBottleBox',
  goldNugget: 'goldNuggetBox',
  cotton: 'cottonBox',
  coal: 'coalBox',
  ironOre: 'ironOreBox',
  copperOre: 'copperOreBox',
  dust: 'dustBox',
  aluminiumOre: 'aluminiumOreBox',
  milk: 'milkBox',
  meat: 'meatBox',
  leather: 'leatherBox',
  horn: 'hornBox',
  sawdust: 'sawdustBox'
} as const;


export const IDLE_FARM_ITEMS_CONTAINER_TYPE = {
  plank: 'plankContainer',
  thread: 'threadContainer',
  ironIngot: 'ironIngotContainer',
  copperIngot: 'copperIngotContainer',
  aluminiumIngot: 'aluminiumIngotContainer',
  steelIngot: 'steelIngotContainer',
  goldIngot: 'goldIngotContainer',
  yoghurt: 'yoghurtContainer',
  bacteria: 'bacteriaContainer',
  cheese: 'cheeseContainer',
  dustIngot: 'dustIngotContainer',
  dirtIngot: 'dirtIngotContainer',
  dusirtIngot: 'dusirtIngotContainer',
  bread: 'breadContainer',
  burntFood: 'burntFoodContainer',
  lava: 'lavaContainer',
  glass: 'glassContainer',
  brokenGlass: 'brokenGlassContainer'
} as const;

export const IDLE_FARM_ITEMS_PACKING_PAIR = {
  ...IDLE_FARM_ITEMS_BOX_TYPE,
  ...IDLE_FARM_ITEMS_CONTAINER_TYPE
} as const;
