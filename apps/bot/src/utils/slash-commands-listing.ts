import {handlerFileFilter, handlerRoot} from '../handler/on-start/constant';
import {
  Collection,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder
} from 'discord.js';
import {importFiles} from '@idle-helper/utils';

interface ISlashCommand {
  name: string;
  builder: SlashCommandBuilder;
}

export const listSlashCommands = async (): Promise<ISlashCommand[]> => {
  const commands = await importFiles<SlashCommand>({
    options: {
      fileFilter: [handlerFileFilter]
    },
    path: `./${handlerRoot}/commands/slash`
  });
  const generated = generateSlashCommands(commands.map(({data}) => data));
  return generated.map((value, key) => ({name: key, builder: value}));
};

export const generateSlashCommands = (slashCommands: SlashCommand[]) => {
  const generatedSlashCommands = new Collection<string, SlashCommandBuilder>();
  const commands = slashCommands.filter((sc) => sc?.type === 'command');
  for (const command of commands) {
    const _command = new SlashCommandBuilder()
      .setName(command.name)
      .setDescription(command.description);
    generatedSlashCommands.set(command.name, _command);
  }
  const subcommandGroups = slashCommands.filter(
    (sc) => sc?.type === 'subcommandGroup'
  );
  for (const subcommandGroup of subcommandGroups) {
    const {commandName, name} = subcommandGroup as SlashCommandSubcommandGroup;
    const subcommands = slashCommands.filter(
      (sc) =>
        sc?.type === 'subcommand' &&
        sc.groupName === name &&
        sc.commandName === commandName
    );
    const command = generatedSlashCommands.get(commandName);
    if (!command) continue;
    const _subcommandGroup = new SlashCommandSubcommandGroupBuilder()
      .setName(name)
      .setDescription(subcommandGroup.description);
    for (const subcommand of subcommands) {
      const {name, description, builder} = subcommand as SlashCommandSubcommand;
      const _subcommand = new SlashCommandSubcommandBuilder()
        .setName(name)
        .setDescription(description);
      if (builder) builder(_subcommand);
      _subcommandGroup.addSubcommand(_subcommand);
    }
    command.addSubcommandGroup(_subcommandGroup);
  }
  const subcommands = slashCommands.filter(
    (sc) => sc?.type === 'subcommand' && !sc.groupName
  );
  for (const subcommand of subcommands) {
    const {commandName, name, description, builder} =
      subcommand as SlashCommandSubcommand;
    const command = generatedSlashCommands.get(commandName);
    if (!command) continue;
    const _subcommand = new SlashCommandSubcommandBuilder()
      .setName(name)
      .setDescription(description);
    if (builder) builder(_subcommand);
    command.addSubcommand(_subcommand);
  }
  return generatedSlashCommands;
};
