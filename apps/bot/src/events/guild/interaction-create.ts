import {BaseInteraction, Client, Events} from 'discord.js';
import {preCheckCommand} from '../../utils/command-precheck';
import isServerWhitelisted from '../../utils/whitelisted-servers-checker';

export default <BotEvent>{
  eventName: Events.InteractionCreate,
  once: false,
  execute: async (client, interaction: BaseInteraction) => {
    if (!interaction.inGuild()) return;
    if (!isServerWhitelisted(interaction.guildId)) return;

    if (interaction.isChatInputCommand() && interaction.guild) {
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
