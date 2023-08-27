interface ICalcWorkerDmg {
  atk: number;
  def: number;
  type: 'player' | 'team';
}

const DAMAGE = {
  player: 80,
  team: 100,
} as const;

export const calcWorkerDmg = ({atk, def, type}: ICalcWorkerDmg) => {
  return Math.round(DAMAGE[type] * (atk / def));
};
