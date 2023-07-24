import {BaseInteraction, Client, Events, GuildMember, User} from 'discord.js';
import {djsMessageHelper} from '../../lib/discordjs/message';
import djsInteractionHelper from '../../lib/discordjs/interaction';

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

    if(!hasPermission) return djsInteractionHelper.replyInteraction({
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
}