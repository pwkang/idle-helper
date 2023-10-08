import {listSlashCommands} from '../../../../utils/slash-commands-listing';
import {sleep} from '@idle-helper/utils';
import {djsMessageHelper} from '../../../../lib/discordjs/message';
import djsRestHelper from '../../../../lib/discordjs/slash-commands';
import {PREFIX_COMMAND_TYPE} from '@idle-helper/constants';

export default <PrefixCommand>{
  name: 'registerSlash',
  commands: ['slash register'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async (client, message, args) => {
    const slashCommands = await listSlashCommands();

    const isGuild = message.content.includes('--guild');
    const isGlobal = message.content.includes('--global');
    const commandsToRegister = slashCommands.filter((sc) =>
      args.includes(sc.name)
    );
    if (!commandsToRegister.length)
      return djsMessageHelper.send({
        client,
        channelId: message.channel.id,
        options: {
          content: 'No commands to register'
        }
      });
    if (!isGuild && !isGlobal) {
      return djsMessageHelper.send({
        client,
        channelId: message.channel.id,
        options: {
          content: 'Please specify `--guild` or `--global`'
        }
      });
    }
    let registered = 0;
    const sentMessage = await djsMessageHelper.send({
      client,
      channelId: message.channel.id,
      options: {
        content: getStatusMessage()
      }
    });

    if (!sentMessage) return;
    if (isGuild) {
      for (const command of commandsToRegister) {

        // ==== Register guild slash command ====
        await djsRestHelper.slashCommand.guild.createOne({
          client,
          guild: message.guild!,
          commands: command.builder.toJSON()
        });
        registered++;

        // ==== Update status message ====
        await djsMessageHelper.edit({
          client,
          message: sentMessage,
          options: {
            content: getStatusMessage()
          }
        });

        // ==== Wait 1 second ====
        await sleep(1000);
      }
    } else if (isGlobal) {
      for (const command of commandsToRegister) {

        // ==== Register global slash command ====
        await djsRestHelper.slashCommand.global.createOne({
          client,
          commands: command.builder.toJSON()
        });
        registered++;

        // ==== Update status message ====
        await djsMessageHelper.edit({
          client,

          message: sentMessage,
          options: {
            content: getStatusMessage()
          }
        });

        // ==== Wait 1 second ====
        await sleep(1000);
      }
    }

    function getStatusMessage() {
      return `Registering ${commandsToRegister.length} slash commands..., (${registered}/${commandsToRegister.length})`;
    }
  }
};
