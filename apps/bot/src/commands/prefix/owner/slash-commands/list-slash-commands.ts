import {listSlashCommands} from '../../../../utils/slash-commands-listing';
import {EmbedBuilder} from 'discord.js';
import {djsMessageHelper} from '../../../../lib/discordjs/message';
import djsRestHelper from '../../../../lib/discordjs/slash-commands';
import {BOT_COLOR, PREFIX_COMMAND_TYPE} from '@idle-helper/constants';

export default <PrefixCommand>{
  name: 'listSlash',
  commands: ['slash'],
  type: PREFIX_COMMAND_TYPE.dev,
  preCheck: {},
  execute: async (client, message) => {
    const slashCommands = await listSlashCommands();
    const guildSlashCommands = await djsRestHelper.slashCommand.guild.getAll({
      client,
      guild: message.guild!,
    });
    const globalSlashCommands = await djsRestHelper.slashCommand.global.getAll({client});

    const registeredGlobalSlashCommands: SlashCommand['name'][] = [];
    const registeredGuildSlashCommands: SlashCommand['name'][] = [];

    for (const slashCommand of slashCommands) {
      if (globalSlashCommands.find((gsc) => gsc.name === slashCommand.builder.name)) {
        registeredGlobalSlashCommands.push(slashCommand.name);
      }
      if (guildSlashCommands.find((gsc) => gsc.name === slashCommand.builder.name)) {
        registeredGuildSlashCommands.push(slashCommand.name);
      }
    }

    const embed = new EmbedBuilder()
      .setColor(BOT_COLOR.devEmbed)
      .setTitle('Slash Commands')
      .setDescription(
        `
\`\`\`
| global |  guild | name 
| --------------------------------
${slashCommands
          .map(
            (sc) =>
              `| ${registeredGlobalSlashCommands.includes(sc.name) ? '  ✓   ' : '  ✗   '} | ${
                registeredGuildSlashCommands.includes(sc.name) ? '  ✓   ' : '  ✗   '
              } | ${sc.name}`
          )
          .join('\n')}
\`\`\` 
      `
      )
      .addFields(
        {
          name: 'Commands',
          value: '`register [name1] [name2] ...`\n`delete [name1] [name2] ...`',
          inline: true,
        },
        {
          name: 'Flags',
          value: '`--guild` `--global`',
          inline: true,
        }
      );

    await djsMessageHelper.send({
      client,
      options: {
        embeds: [embed],
      },
      channelId: message.channelId,
    });
  },
};
