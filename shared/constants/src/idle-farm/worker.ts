export const IDLE_FARM_WORKER_TYPE = {
  useless: 'useless',
  deficient: 'deficient',
  common: 'common',
  talented: 'talented',
  wise: 'wise',
  expert: 'expert',
  masterful: 'masterful',
} as const;

export const IDLE_FARM_WORKER_ID = {
  [IDLE_FARM_WORKER_TYPE.useless]: 1,
  [IDLE_FARM_WORKER_TYPE.deficient]: 2,
  [IDLE_FARM_WORKER_TYPE.common]: 3,
  [IDLE_FARM_WORKER_TYPE.talented]: 4,
  [IDLE_FARM_WORKER_TYPE.wise]: 5,
  [IDLE_FARM_WORKER_TYPE.expert]: 6,
  [IDLE_FARM_WORKER_TYPE.masterful]: 7,
} as const;

export const IDLE_FARM_WORKER_STATS = {
  [IDLE_FARM_WORKER_TYPE.useless]: {
    speed: 1,
    strength: 1,
    intelligence: 1,
  },
  [IDLE_FARM_WORKER_TYPE.deficient]: {
    speed: 1.5,
    strength: 1.5,
    intelligence: 1,
  },
  [IDLE_FARM_WORKER_TYPE.common]: {
    speed: 1.5,
    strength: 2,
    intelligence: 1.5,
  },
  [IDLE_FARM_WORKER_TYPE.talented]: {
    speed: 2,
    strength: 2,
    intelligence: 2,
  },
  [IDLE_FARM_WORKER_TYPE.wise]: {
    speed: 2.5,
    strength: 2,
    intelligence: 2.5,
  },
  [IDLE_FARM_WORKER_TYPE.expert]: {
    speed: 3,
    strength: 2.5,
    intelligence: 2.5,
  },
  [IDLE_FARM_WORKER_TYPE.masterful]: {
    speed: 3,
    strength: 3,
    intelligence: 3,
  },
} as const;
