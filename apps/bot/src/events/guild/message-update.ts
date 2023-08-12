import {Client, Events, Message} from 'discord.js';
import {emitMessageEdited} from '../../utils/message-edited-listener';
import {preCheckCommand} from '../../utils/command-precheck';

export default <BotEvent>{
  eventName: Events.MessageUpdate,
  execute: async (client, oldMessage: Message, newMessage: Message) => {
    if (!newMessage.inGuild()) return;
    if (
      isBotSlashCommand(newMessage) &&
      isFirstUpdateAfterDeferred(oldMessage) &&
      !!newMessage.interaction
    ) {
      const messages = searchSlashMessages(client, newMessage);
      if (!messages.size) return;
      messages.map(async (cmd) => {
        const toExecute = await preCheckCommand({
          client,
          author: newMessage.interaction!.user,
          server: newMessage.guild,
          preCheck: cmd.preCheck,
          channelId: newMessage.channelId,
        });
        if (!toExecute) return;
        await cmd.execute(client, newMessage, newMessage.interaction!.user);
      });
    }

    await emitMessageEdited(newMessage);
  },
};

const isBotSlashCommand = (message: Message) => message.interaction && message.author.bot;

const isFirstUpdateAfterDeferred = (oldMessage: Message) =>
  oldMessage.content === '' && oldMessage.embeds.length === 0;

const searchSlashMessages = (client: Client, message: Message) =>
  client.slashMessages.filter((cmd) =>
    cmd.commandName.some(
      (name) => name.toLowerCase() === message.interaction?.commandName?.toLowerCase(),
    ),
  );
