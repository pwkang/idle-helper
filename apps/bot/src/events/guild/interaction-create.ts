import {BaseInteraction, Client, Events, GuildMember} from 'discord.js';
import djsInteractionHelper from '../../lib/discordjs/interaction';
import {preCheckPrefixCommand} from '../../utils/command-precheck';

export default <BotEvent>{
  eventName: Events.InteractionCreate,
  once: false,
  execute: async (client, interaction: BaseInteraction) => {
    if (!interaction.guild) return;

    if (interaction.isChatInputCommand()) {

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

      if (!interaction.isCommand()) return;

      const toExecute = await preCheckPrefixCommand({
        client,
        preCheck: command.preCheck,
        author: interaction.user,
        channelId: interaction.channelId!,
      });
      if (!toExecute) return;

      await command.execute(client, interaction);
    }
  },
};

const searchSlashCommand = (client: Client, interaction: BaseInteraction) => {
  if (!interaction.isCommand() || !interaction.isChatInputCommand()) return null;
  const commandName = interaction.commandName;
  const subcommandGroupName = interaction.options.getSubcommandGroup();
  const subcommandName = interaction.options.getSubcommand();
  const searchCommandName = [commandName, subcommandGroupName, subcommandName]
    .filter((name) => !!name)
    .join(' ');
  return client.slashCommands.get(searchCommandName);
};

interface ICheckPermission {
  permissions?: bigint[];
  member: GuildMember;
}

const checkPermission = ({permissions, member}: ICheckPermission) => {
  if (!permissions) return true;
  const memberPermissions = member.permissions;
  return permissions.every((permission) => memberPermissions.has(permission));
};
