import {PREFIX_COMMAND_TYPE} from '@idle-helper/constants';

export default <PrefixCommand>{
  name: 'test',
  commands: ['test'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async () => {
  },
};
