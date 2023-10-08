interface ICalcOneShotPower {
  enemyPower: number;
  enemyHp: number;
  decimalPlace?: number;
  raidType: 'player' | 'team';
}

const DAMAGE = {
  player: 100,
  team: 100
} as const;

export const calcOneShotPower = ({
  enemyPower,
  enemyHp,
  decimalPlace,
  raidType
}: ICalcOneShotPower) => {
  const result = (enemyPower * enemyHp) / DAMAGE[raidType];
  return decimalPlace !== undefined
    ? Number(result.toFixed(decimalPlace))
    : result;
};

// enemyHP = 100 * atk / def
// enemyHP * def = 100 * atk
// atk = enemyHP * def / 100

// 100 * attacker_power / (defender_power || 1)
