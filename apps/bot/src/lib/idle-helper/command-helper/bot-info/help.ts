import {BaseMessageOptions, Client, EmbedBuilder} from 'discord.js';
import {
  BOT_CLICKABLE_SLASH_COMMANDS,
  BOT_COLOR,
  IDLE_FARM_CLICKABLE_SLASH_COMMANDS,
  PREFIX,
  SUPPORT_SERVER_INVITE_LINK,
} from '@idle-helper/constants';
import {helpConfig} from './help.config';
import messageFormatter from '../../../discordjs/message-formatter';

interface IHelp {
  client: Client;
  channelId: string;
  serverId: string;
}

export const _help = ({client, channelId, serverId}: IHelp) => {
  const page = 0;
  const categoryId: string | undefined = 'commands';
  const selectMenuId: string | undefined = 'user';

  function render(): BaseMessageOptions {
    const embed = getEmbed({
      client, page, categoryId, selectMenuId, channelId, serverId,
    });
    return {
      embeds: [embed],
    };
  }

  return {
    render,
  };
};

interface IGetEmbed {
  client: Client;
  page: number;
  categoryId?: string;
  selectMenuId?: string;
  serverId: string;
  channelId: string;
}

const LINES_PER_PAGE = 8;

const getEmbed = ({client, categoryId, page, selectMenuId, channelId, serverId}: IGetEmbed) => {
  const embed = new EmbedBuilder()
    .setTitle('IDLE Helper')
    .setColor(BOT_COLOR.embed)
    .setThumbnail(client.user?.displayAvatarURL() ?? null);

  const category = helpConfig.find(v => v.id === categoryId);
  if (!category) {
    setHomePage(embed);
  } else {
    const selectedMenuItem = category.selectMenu.items?.find(v => v.id === selectMenuId);
    embed.setTitle(category.home.title);
    embed.setDescription(category.home.description.join('\n'));

    if (selectedMenuItem && selectedMenuItem.commands) {
      const range = {
        start: page * LINES_PER_PAGE,
        end: (page + 1) * LINES_PER_PAGE,
      };
      let currentLines = 0;
      let description = '';
      for (let i = 0; i < selectedMenuItem.commands.length; i++) {
        const command = selectedMenuItem.commands[i];
        if (currentLines >= range.start && currentLines < range.end) {
          description += [command.name.map(name => convertCommandName({
            name,
            channelId,
            serverId,
          })).join(' | '),
          command.description.map(d => `- ${d}`).join('\n'),
          '',
          '',
          ].join('\n');
          currentLines += command.description.length;
        }
      }
      embed.setDescription(description);

    } else if (selectedMenuItem && selectedMenuItem.info) {
      const info = selectedMenuItem.info[page];
      embed.setTitle(info.title);
      embed.setDescription(info.description.join('\n'));
      if (info.image) embed.setImage(info.image);
    } else {
      embed.addFields(...category.home.fields.map(v => ({
        name: v.name,
        value: v.value.join('\n'),
        inline: v.inline,
      })));
    }


  }

  return embed;
};

interface IConvertName {
  name: string;
  channelId: string;
  serverId: string;
}

const convertCommandName = ({name, channelId, serverId}: IConvertName) => {
  if (name.startsWith('</')) {
    return name;
  } else {
    return `[${name}](${messageFormatter.channelUrl({
      serverId,
      channelId,
    })})`;
  }
};

function setHomePage(embed: EmbedBuilder) {
  embed.setDescription([
    `**Prefix:** \`${PREFIX.bot}\`, \`@IDLE Helper\``,
    `- Use ${BOT_CLICKABLE_SLASH_COMMANDS.accountRegister} to register to the bot`,
    `- Register your workers via ${IDLE_FARM_CLICKABLE_SLASH_COMMANDS.workerStats}`,
    '- Start idling',
  ].join('\n'))
    .addFields(
      {
        name: 'Features',
        value: [
          'Raid Helper',
          'Claim Reminder',
          'Team Raid Helper',
          'Random Events Pings',
          'Last Claim Duration',
          'Global Worker Leaderboard',
          'Inventory idlons Calculator',
          'etc...',
        ].map(v => `- ${v}`).join('\n'),
      }, {
        name: 'Have a question?',
        value: `Join our [Support server](${SUPPORT_SERVER_INVITE_LINK})`,
      },
    );
}