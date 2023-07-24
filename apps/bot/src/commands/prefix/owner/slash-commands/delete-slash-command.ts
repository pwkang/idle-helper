import {listSlashCommands} from '../../../../utils/slash-commands-listing';
import {ApplicationCommand, Message} from 'discord.js';
import {sleep} from '@idle-helper/utils';
import {djsMessageHelper} from '../../../../lib/discordjs/message';
import djsRestHelper from '../../../../lib/discordjs/slash-commands';
import {PREFIX_COMMAND_TYPE} from '@idle-helper/constants';

export default <PrefixCommand>{
  name: 'deleteSlash',
  commands: ['slash delete'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async (client, message, args) => {
    const slashCommands = await listSlashCommands();

    const isGuild = checkIsGuild(message);
    const isGlobal = checkIsGlobal(message);

    const commandsToDelete = slashCommands.filter((sc) => args.includes(sc.name));
    if (!commandsToDelete.length)
      return djsMessageHelper.send({
        client,
        channelId: message.channel.id,
        options: {
          content: 'No commands to delete',
        },
      });
    if (!isGuild && !isGlobal) {
      return djsMessageHelper.send({
        client,
        channelId: message.channel.id,
        options: {
          content: 'Please specify `--guild` or `--global`',
        },
      });
    }
    let deleted = 0;
    const sentMessage = await djsMessageHelper.send({
      client,
      channelId: message.channel.id,
      options: {
        content: getStatusMessage(),
      },
    });

    if (!sentMessage) return;

    let registeredGuildSlashCommands: ApplicationCommand[] = [];
    let registeredGlobalSlashCommands: ApplicationCommand[] = [];

    if (isGuild) {
      registeredGuildSlashCommands = await djsRestHelper.slashCommand.guild.getAll({
        guild: message.guild!,
        client,
      });
      for (let command of commandsToDelete) {
        const guildCommand = registeredGuildSlashCommands.find(
          (gsc) => gsc.name === command.builder.name
        );
        if (guildCommand)
          await djsRestHelper.slashCommand.guild.deleteOne({
            client,
            commandId: guildCommand.id,
            guild: message.guild!,
          });
        deleted++;
        await djsMessageHelper.edit({
          client,
          message: sentMessage,
          options: {
            content: getStatusMessage(),
          },
        });
        await sleep(1000);
      }
    } else {
      registeredGlobalSlashCommands = await djsRestHelper.slashCommand.global.getAll({client});
      for (let command of commandsToDelete) {
        const globalCommand = registeredGlobalSlashCommands.find(
          (gsc) => gsc.name === command.builder.name
        );
        if (globalCommand)
          await djsRestHelper.slashCommand.global.deleteOne({
            client,
            commandId: globalCommand.id,
          });
        deleted++;
        await djsMessageHelper.edit({
          client,
          message: sentMessage,
          options: {
            content: getStatusMessage(),
          },
        });
        await sleep(1000);
      }
    }

    function getStatusMessage() {
      return `Deleting ${commandsToDelete.length} slash commands..., (${deleted}/${commandsToDelete.length})`;
    }
  },
};

const checkIsGuild = (message: Message) => message.content.includes('--guild');
const checkIsGlobal = (message: Message) => message.content.includes('--global');
