import {PREFIX_COMMAND_TYPE} from '@idle-helper/constants';
import {userService} from '../../../services/database/user.service';

export default <PrefixCommand>{
  name: 'test',
  commands: ['test'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async (client, message) => {
    await userService.claimFarm({
      userId: message.author.id,
    });
  },
};