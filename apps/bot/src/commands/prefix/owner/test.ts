import {PREFIX_COMMAND_TYPE} from '@idle-helper/constants';
import {leaderboard} from '../../../lib/idle-helper/leaderboard';

export default <PrefixCommand>{
  name: 'test',
  commands: ['test'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async () => {
    leaderboard.workers();
  },
};
