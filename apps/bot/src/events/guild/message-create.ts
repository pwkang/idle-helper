import {Client, Events, Message} from 'discord.js';
import {
  DEVS_ID,
  IDLE_FARM_ID,
  PREFIX,
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@idle-helper/constants';
import {userService} from '../../services/database/user.service';
import {djsMessageHelper} from '../../lib/discordjs/message';
import embedProvider from '../../lib/idle-helper/embeds';

export default <BotEvent>{
  eventName: Events.MessageCreate,
  once: false,
  execute: async (client, message: Message) => {
    if (isBotSlashCommand(message) && isNotDeferred(message)) {
      const messages = searchSlashMessages(client, message);
      if (!messages.size) return;

      messages.forEach((cmd) => cmd.execute(client, message, message.interaction?.user!));
    }

    if (isSentByUser(message)) {
      const result = searchCommand(client, message);
      if (!result) return;


      const toExecute = await preCheckPrefixCommand({
        client,
        message,
        preCheck: result.command.preCheck,
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
  trimWhitespace(message.content).toLowerCase().startsWith(`${PREFIX.idleFarm.toLowerCase()} `) ||
  message.mentions.has(IDLE_FARM_ID);

const isBotCommand = (message: Message) =>
  PREFIX.bot && trimWhitespace(message.content).toLowerCase().startsWith(PREFIX.bot.toLowerCase());

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
    if (messageContent.startsWith(`${PREFIX.idleFarm} `)) {
      args = messageContent.split(' ').slice(1);
    } else if (message.mentions.has(IDLE_FARM_ID)) {
      args = messageContent
        .replace(`<@${IDLE_FARM_ID}>`, '')
        .split(' ')
        .filter((arg) => arg !== '');
    }

    commandType = PREFIX_COMMAND_TYPE.idleFarm;
  }

  if (PREFIX.bot && isBotCommand(message)) {
    args = messageContent.slice(PREFIX.bot.length).trim().split(' ');

    commandType = PREFIX_COMMAND_TYPE.bot;
  }
  if (DEVS_ID.includes(message.author.id) && PREFIX.dev && messageContent.startsWith(PREFIX.dev)) {
    args = messageContent.slice(PREFIX.dev.length).trim().split(' ');

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
        status.userAccOff = !!userAccount && !!userAccount?.config.onOff;
        if (!!userAccount && !userAccount?.config.onOff)
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