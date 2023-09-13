import {IDLE_FARM_WORKER_ID, IDLE_FARM_WORKER_STATS, IDLE_FARM_WORKER_TYPE} from '@idle-helper/constants';

interface ICalcWorkerPower {
  type: ValuesOf<typeof IDLE_FARM_WORKER_TYPE>;
  level: number;
  decimalPlace?: number;
}

export const calcWorkerPower = ({type, level, decimalPlace}: ICalcWorkerPower) => {
  const speed = IDLE_FARM_WORKER_STATS[type].speed;
  const strength = IDLE_FARM_WORKER_STATS[type].strength;
  const intelligence = IDLE_FARM_WORKER_STATS[type].intelligence;
  const power = formula({
    intelligence,
    level,
    strength,
    speed,
    type: IDLE_FARM_WORKER_ID[type],
  });
  return decimalPlace !== undefined ? +power.toFixed(decimalPlace) : power;
};

interface IFormula {
  type: number;
  level: number;
  speed: number;
  strength: number;
  intelligence: number;
}

const formula = ({intelligence, level, type, strength, speed}: IFormula) =>
  (speed + strength + intelligence) * (1 + type / 4) * (1 + level / 2.5);
