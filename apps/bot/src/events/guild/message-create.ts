import {Client, Events, Message} from 'discord.js';
import {DEVS_ID, IDLE_FARM_ID, PREFIX, PREFIX_COMMAND_TYPE} from '@idle-helper/constants';
import {preCheckPrefixCommand} from '../../utils/command-precheck';

export default <BotEvent>{
  eventName: Events.MessageCreate,
  once: false,
  execute: async (client, message: Message) => {
    if (isBotSlashCommand(message) && isNotDeferred(message)) {
      const messages = searchSlashMessages(client, message);
      if (!messages.size) return;

      for (const cmd of messages.values()) {
        const toExecute = await preCheckPrefixCommand({
          client,
          preCheck: cmd.preCheck,
          author: message.interaction?.user!,
          channelId: message.channelId,
        });
        if (!toExecute) return;
        await cmd.execute(client, message, message.interaction?.user!);
      }
    }

    if (isSentByUser(message)) {
      const result = searchCommand(client, message);
      if (!result) return;

      const toExecute = await preCheckPrefixCommand({
        client,
        preCheck: result.command.preCheck,
        author: message.author,
        channelId: message.channelId,
      });
      if (!toExecute) return;

      await result.command.execute(client, message, result.args);
    }

    if (isSentByBot(message)) {
      const commands = searchBotMatchedCommands(client, message);
      if (!commands.size) return;

      commands.forEach((cmd) => cmd.execute(client, message));
    }
  },
};

const searchSlashMessages = (client: Client, message: Message) =>
  client.slashMessages.filter((cmd) =>
    cmd.commandName.some(
      (name) => name.toLowerCase() === message.interaction?.commandName?.toLowerCase(),
    ),
  );

const trimWhitespace = (str: string) => str.split('\n').join('').replace(/\s+/g, ' ').trim();

const isRpgCommand = (message: Message) =>
  trimWhitespace(message.content).toLowerCase().startsWith(PREFIX.idleFarm.toLowerCase()) ||
  message.mentions.has(IDLE_FARM_ID);

const isBotCommand = (client: Client, message: Message) =>
  PREFIX.bot && trimWhitespace(message.content).toLowerCase().startsWith(PREFIX.bot.toLowerCase()) ||
  message.mentions.has(client.user!.id);

const validateCommand = (commands: string[], args: string[]) => {
  return commands.some((cmd) =>
    cmd.split(' ').every((name, i) => name?.toLowerCase() === args[i]?.toLowerCase()),
  );
};

const getMatchedCommandLength = (commands: string[], args: string[]) => {
  const matched = commands.find((cmd) =>
    cmd.split(' ').every((name, i) => name?.toLowerCase() === args[i]?.toLowerCase()),
  );
  return matched?.split(' ').length ?? 0;
};

function searchCommand(
  client: Client,
  message: Message,
): {command: PrefixCommand; args: string[]} | null {
  const messageContent = trimWhitespace(message.content.toLowerCase());
  if (messageContent === '') return null;
  let args: string[] = [];
  let command;
  let commandType: ValuesOf<typeof PREFIX_COMMAND_TYPE>;

  if (isRpgCommand(message)) {
    args = generateArgs({
      botId: IDLE_FARM_ID,
      prefix: PREFIX.idleFarm,
      message,
    });

    commandType = PREFIX_COMMAND_TYPE.idleFarm;
  }

  if (PREFIX.bot && isBotCommand(client, message)) {
    args = generateArgs({
      botId: client.user!.id,
      prefix: PREFIX.bot,
      message,
    });
    commandType = PREFIX_COMMAND_TYPE.bot;
  }

  if (DEVS_ID.includes(message.author.id) && PREFIX.dev && messageContent.startsWith(PREFIX.dev)) {
    args = generateArgs({
      prefix: PREFIX.dev,
      message,
    });
    commandType = PREFIX_COMMAND_TYPE.dev;
  }

  const matchedCommands = client.prefixCommands.filter(
    (cmd) => cmd.type === commandType && validateCommand(cmd.commands, args),
  );
  if (matchedCommands.size === 1) {
    command = matchedCommands.first();
  } else {
    command = matchedCommands
      .sort(
        (a, b) =>
          getMatchedCommandLength(b.commands, args) - getMatchedCommandLength(a.commands, args),
      )
      .first();
  }

  return command ? {command, args} : null;
}

const isBotSlashCommand = (message: Message) => message.interaction && message.author.bot;
const isSentByUser = (message: Message) => !message.author.bot;

const isSentByBot = (message: Message) => message.author.bot;

const isNotDeferred = (message: Message) => !(message.content === '' && !message.embeds.length);

const searchBotMatchedCommands = (client: Client, message: Message) =>
  client.botMessages.filter((cmd) => message.author.id === cmd.bot && cmd.match(message));

interface IGenerateArgs {
  prefix: string;
  botId?: string;
  message: Message;
}

const generateArgs = ({prefix, message, botId}: IGenerateArgs) => {
  const messageContent = trimWhitespace(message.content.toLowerCase());
  let args: string[] = [];
  if (messageContent.startsWith(prefix)) {
    args = messageContent.split(' ').slice(1);
  } else if (botId && message.mentions.has(botId)) {
    args = messageContent
      .replace(`<@${botId}>`, '')
      .split(' ')
      .filter((arg) => arg !== '');
  } else {
    args = messageContent.split(' ').filter((arg) => arg !== '');
  }
  return args;
};