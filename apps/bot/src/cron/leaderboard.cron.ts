import {leaderboard} from '../lib/idle-helper/leaderboard';

export default <CronJob>{
  name: 'leaderboard',
  cronOptions: {},
  expression: '0 0 * * * *',
  disabled: false,
  firstClusterOnly: true,
  execute: async () => {
    leaderboard.workers();
  }
};
