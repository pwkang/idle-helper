import {BaseInteraction, BaseMessageOptions, Client, Guild, Message, PermissionsBitField, User} from 'discord.js';
import {userService} from '../services/database/user.service';
import {djsMessageHelper} from '../lib/discordjs/message';
import {ICommandPreCheck} from '../types/utils';
import {djsMemberHelper} from '../lib/discordjs/member';
import {serverService} from '../services/database/server.service';
import djsInteractionHelper from '../lib/discordjs/interaction';
import embedProvider from '../lib/idle-helper/embeds';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@idle-helper/constants';

type IPreCheckCommand = {
  client: Client;
  preCheck: ICommandPreCheck;
  author: User;
  channelId: string;
  server: Guild;
  interaction?: BaseInteraction;
  message?: Message;
};

export const preCheckCommand = async (
  {
    preCheck,
    author,
    channelId,
    client,
    server,
    interaction,
    message,
  }: IPreCheckCommand) => {
  const status: Record<keyof PrefixCommand['preCheck'], boolean> = {
    userNotRegistered: true,
    userAccOff: true,
    isServerAdmin: true,
  };

  if (preCheck.isServerAdmin) {
    const member = await djsMemberHelper.getMember({
      client,
      serverId: server.id,
      userId: author.id,
    });
    const serverAccount = await serverService.getServer({
      serverId: server.id,
    });
    const adminRoles = serverAccount?.settings.admin.rolesId ?? [];
    const adminUsers = serverAccount?.settings.admin.usersId ?? [];
    const userRoles = member?.roles.cache.map((role) => role.id) ?? [];
    const isUserNotAdmin =
      !member?.permissions.has(PermissionsBitField.Flags.ManageGuild) &&
      !adminRoles.some((role) => userRoles.includes(role)) &&
      !adminUsers.includes(author.id);
    if (isUserNotAdmin) {
      await response({
        client,
        interaction,
        message,
        messageOptions: {
          content: 'You do not have permission to use this command.',
        },
      });

      status.isServerAdmin = false;
    }
  }

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
          await response({
            client,
            message,
            interaction,
            messageOptions: {
              embeds: [
                embedProvider.howToRegister({
                  author,
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
          await response({
            client,
            messageOptions: {
              embeds: [embedProvider.turnOnAccount()],
            },
            message,
            interaction,
          });
        break;
    }
  }

  return Object.values(status).every((value) => value);
};

interface IResponse {
  client: Client;
  messageOptions: BaseMessageOptions;
  interaction?: BaseInteraction;
  message?: Message;
}

const response = async ({message, interaction, client, messageOptions}: IResponse) => {
  if (interaction) {
    await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options: messageOptions,
    });
  } else if (message) {
    await djsMessageHelper.reply({
      client,
      message,
      options: messageOptions,
    });
  }
};
