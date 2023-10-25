export const IDLE_FARM_WORKER_TYPE = {
  useless: 'useless',
  deficient: 'deficient',
  common: 'common',
  talented: 'talented',
  wise: 'wise',
  expert: 'expert',
  masterful: 'masterful',
  spooky: 'spooky'
} as const;

export const IDLE_FARM_WORKER_LABEL = {
  [IDLE_FARM_WORKER_TYPE.useless]: 'useless',
  [IDLE_FARM_WORKER_TYPE.deficient]: 'deficient',
  [IDLE_FARM_WORKER_TYPE.common]: 'common',
  [IDLE_FARM_WORKER_TYPE.talented]: 'talented',
  [IDLE_FARM_WORKER_TYPE.wise]: 'wise',
  [IDLE_FARM_WORKER_TYPE.expert]: 'expert',
  [IDLE_FARM_WORKER_TYPE.masterful]: 'masterful',
  [IDLE_FARM_WORKER_TYPE.spooky]: 'spooky'
};

export const IDLE_FARM_WORKER_ID = {
  [IDLE_FARM_WORKER_TYPE.useless]: 1,
  [IDLE_FARM_WORKER_TYPE.deficient]: 2,
  [IDLE_FARM_WORKER_TYPE.common]: 3,
  [IDLE_FARM_WORKER_TYPE.talented]: 4,
  [IDLE_FARM_WORKER_TYPE.wise]: 5,
  [IDLE_FARM_WORKER_TYPE.expert]: 6,
  [IDLE_FARM_WORKER_TYPE.masterful]: 7,
  [IDLE_FARM_WORKER_TYPE.spooky]: 8
} as const;

export const IDLE_FARM_WORKER_STATS = {
  [IDLE_FARM_WORKER_TYPE.useless]: {
    speed: 1,
    strength: 1,
    intelligence: 1
  },
  [IDLE_FARM_WORKER_TYPE.deficient]: {
    speed: 1.5,
    strength: 1.5,
    intelligence: 1
  },
  [IDLE_FARM_WORKER_TYPE.common]: {
    speed: 1.5,
    strength: 2,
    intelligence: 1.5
  },
  [IDLE_FARM_WORKER_TYPE.talented]: {
    speed: 2,
    strength: 2,
    intelligence: 2
  },
  [IDLE_FARM_WORKER_TYPE.wise]: {
    speed: 2.5,
    strength: 2,
    intelligence: 2.5
  },
  [IDLE_FARM_WORKER_TYPE.expert]: {
    speed: 3,
    strength: 2.5,
    intelligence: 2.5
  },
  [IDLE_FARM_WORKER_TYPE.masterful]: {
    speed: 3,
    strength: 3,
    intelligence: 3
  },
  [IDLE_FARM_WORKER_TYPE.spooky]: {
    speed: 5,
    strength: 6,
    intelligence: 5
  }
} as const;

export const IDLE_FARM_WORKERS_LEVEL_AMOUNT: Record<number, number> = {
  1: 1,
  2: 2,
  3: 4,
  4: 10,
  5: 20,
  6: 40,
  7: 80,
  8: 160,
  9: 250,
  10: 500,
  11: 1000,
  12: 1600,
  13: 2500,
  14: 5000,
  15: 8000,
  16: 12000,
  17: 18000
} as const;
