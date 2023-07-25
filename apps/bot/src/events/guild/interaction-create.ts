import {BaseInteraction, Client, Events, GuildMember, Message} from 'discord.js';
import djsInteractionHelper from '../../lib/discordjs/interaction';
import {userService} from '../../services/database/user.service';
import {USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@idle-helper/constants';
import {djsMessageHelper} from '../../lib/discordjs/message';
import embedProvider from '../../lib/idle-helper/embeds';

export default <BotEvent>{
  eventName: Events.InteractionCreate,
  once: false,
  execute: async (client, interaction: BaseInteraction) => {
    if (!interaction.guild) return;

    const command = searchSlashCommand(client, interaction);

    if (!command) return;

    const hasPermission = checkPermission({
      permissions: command.permissions,
      member: interaction.member as GuildMember,
    });

    if (!hasPermission) return djsInteractionHelper.replyInteraction({
      client,
      options: {
        content: 'You do not have permission to use this command',
        ephemeral: true,
      },
      interaction,
    });


    await command.execute(client, interaction as typeof command.interactionType);
  },
};

const searchSlashCommand = (client: Client, interaction: BaseInteraction) =>
  client.slashCommands.find(
    (cmd) => interaction.isCommand() && cmd.builder.name === interaction.commandName,
  );

interface ICheckPermission {
  permissions?: bigint[];
  member: GuildMember;
}

const checkPermission = ({permissions, member}: ICheckPermission) => {
  if (!permissions) return true;
  const memberPermissions = member.permissions;
  return permissions.every((permission) => memberPermissions.has(permission));
};


interface IPreCheckPrefixCommand {
  client: Client;
  preCheck: PrefixCommand['preCheck'];
  message: Message;
}

const preCheckPrefixCommand = async ({preCheck, message, client}: IPreCheckPrefixCommand) => {
  const status: Record<keyof PrefixCommand['preCheck'], boolean> = {
    userNotRegistered: true,
    userAccOff: true,
  };
  const userAccount = await userService.findUser({userId: message.author.id});
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
            channelId: message.channelId,
            options: {
              embeds: [
                embedProvider.howToRegister({
                  author: message.author,
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
        status.userAccOff = !!userAccount?.config.onOff;
        if (!userAccount?.config.onOff)
          await djsMessageHelper.send({
            client,
            channelId: message.channelId,
            options: {
              embeds: [embedProvider.turnOnAccount()],
            },
          });
        break;
    }
  }

  return Object.values(status).every((value) => value);
};