import {Client} from 'discord.js';
import {handlerFileFilter, handlerRoot} from './constant';
import {importFiles, logger} from '@idle-helper/utils';

async function loadPrefixCommands(client: Client) {
  const commands = await importFiles<PrefixCommand>({
    path: `./${handlerRoot}/commands/prefix`,
    options: {
      fileFilter: [handlerFileFilter],
    },
  });
  logger({
    message: `Loaded (${commands.length}) prefix commands`,
    clusterId: client.cluster?.id,
  });
  commands.forEach(({data}) => {
    if (!data?.name) return;
    client.prefixCommands.set(`${data.type}:${data.name}`, data);
  });
}

async function loadSlashCommands(client: Client) {
  const commands = await importFiles<SlashCommand>({
    path: `./${handlerRoot}/commands/slash`,
    options: {
      fileFilter: [handlerFileFilter, '!*.type.ts'],
      directoryFilter: ['!subcommand'],
    },
  });
  logger({
    message: `Loaded (${commands.length}) slash commands`,
    clusterId: client.cluster?.id,
  });
  commands.forEach(({data}) => {
    if (!data?.name) return;
    const commandName: string[] = [];
    if (data.type === 'command' && data.builder) {
      commandName.push(data.name);
    } else if (data.type === 'subcommand') {
      commandName.push(data.commandName);
      if (data.groupName) commandName.push(data.groupName);
      commandName.push(data.name);
    }
    client.slashCommands.set(commandName.join(' '), data);
  });
}

async function loadSlashMessages(client: Client) {
  const commands = await importFiles<SlashMessage>({
    path: `./${handlerRoot}/commands/slash-message`,
    options: {
      fileFilter: [handlerFileFilter],
    },
  });
  logger({
    message: `Loaded (${commands.length}) slash messages`,
    clusterId: client.cluster?.id,
  });
  commands.forEach(({data}) => {
    if (!data?.name) return;
    client.slashMessages.set(data.name, data);
  });
}

async function loadBotMessages(client: Client) {
  const commands = await importFiles<BotMessage>({
    path: `./${handlerRoot}/commands/bot-message`,
    options: {
      fileFilter: [handlerFileFilter],
    },
  });
  logger({
    message: `Loaded (${commands.length}) bot messages`,
    clusterId: client.cluster?.id,
  });
  commands.forEach(({data}) => {
    if (!data?.name) return;
    client.botMessages.set(data.name, data);
  });
}

export default function loadCommands(client: Client) {
  return Promise.all([
    loadPrefixCommands(client),
    loadSlashCommands(client),
    loadSlashMessages(client),
    loadBotMessages(client),
  ]);
}
