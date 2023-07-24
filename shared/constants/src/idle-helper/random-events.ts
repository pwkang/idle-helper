
export const IDLE_FARM_RANDOM_EVENTS = {
  packing: 'packing',
  worker: 'worker',
  energy: 'energy',
  dice: 'dice',
} as const;

export const IDLE_FARM_RANDOM_EVENTS_NAME: Record<keyof typeof IDLE_FARM_RANDOM_EVENTS, string> = {
  worker: "Worker",
  packing: "Packing",
  dice: 'Dice',
  energy: 'Energy',
} as const;

export const IDLE_FARM_RANDOM_EVENTS_COMMAND: Record<keyof typeof IDLE_FARM_RANDOM_EVENTS, string> = {
  worker: "Hire",
  packing: "Pack",
  energy: "OHMMM",
  dice: 'Join',
} as const;
