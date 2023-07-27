import {Client, Message, User} from 'discord.js';
import {userService} from '../services/database/user.service';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@idle-helper/constants';
import {djsMessageHelper} from '../lib/discordjs/message';
import embedProvider from '../lib/idle-helper/embeds';
import {ICommandPreCheck} from '../types/utils';

interface IPreCheckPrefixCommand {
  client: Client;
  preCheck: ICommandPreCheck;
  author: User;
  channelId: string;
}

export const preCheckPrefixCommand = async ({preCheck, author, channelId, client}: IPreCheckPrefixCommand) => {
  const status: Record<keyof PrefixCommand['preCheck'], boolean> = {
    userNotRegistered: true,
    userAccOff: true,
  };
  const userAccount = await userService.findUser({userId: author.id});
  if (preCheck.userNotRegistered !== undefined) {
    switch (preCheck.userNotRegistered) {
      case USER_NOT_REGISTERED_ACTIONS.skip:
        status.userNotRegistered = true;
        break;
      case USER_NOT_REGISTERED_ACTIONS.abort:
        status.userNotRegistered = !!userAccount;
        break;
      case USER_NOT_REGISTERED_ACTIONS.askToRegister:
        status.userNotRegistered = !!userAccount;
        if (!userAccount)
          await djsMessageHelper.send({
            client,
            channelId,
            options: {
              embeds: [
                embedProvider.howToRegister({
                  author: author,
                }),
              ],
            },
          });
        break;
    }
  }

  if (preCheck.userAccOff !== undefined) {
    switch (preCheck.userAccOff) {
      case USER_ACC_OFF_ACTIONS.skip:
        status.userAccOff = true;
        break;
      case USER_ACC_OFF_ACTIONS.abort:
        status.userAccOff = !!userAccount?.config.onOff;
        break;
      case USER_ACC_OFF_ACTIONS.askToTurnOn:
        status.userAccOff = !!userAccount && !!userAccount?.config.onOff;
        if (!!userAccount && !userAccount?.config.onOff)
          await djsMessageHelper.send({
            client,
            channelId,
            options: {
              embeds: [embedProvider.turnOnAccount()],
            },
          });
        break;
    }
  }

  return Object.values(status).every((value) => value);
};