import {BaseInteraction, Client, Events, GuildMember} from 'discord.js';
import {preCheckCommand} from '../../utils/command-precheck';

export default <BotEvent>{
  eventName: Events.InteractionCreate,
  once: false,
  execute: async (client, interaction: BaseInteraction) => {
    if (!interaction.guild) return;

    if (interaction.isChatInputCommand()) {

      const command = searchSlashCommand(client, interaction);

      if (!command) return;
      if (!interaction.isCommand()) return;

      const toExecute = await preCheckCommand({
        author: interaction.user,
        client,
        preCheck: command.preCheck,
        interaction,
        channelId: interaction.channelId,
        server: interaction.guild,
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
  const subcommandName = interaction.options.getSubcommand(false);
  const searchCommandName = [commandName, subcommandGroupName, subcommandName]
    .filter((name) => !!name)
    .join(' ');
  return client.slashCommands.get(searchCommandName);
};

interface ICheckPermission {
  permissions?: bigint[];
  member: GuildMember;
}
