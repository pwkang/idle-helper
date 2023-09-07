import {BaseMessageOptions, Client, EmbedBuilder} from 'discord.js';
import {
  BOT_CLICKABLE_SLASH_COMMANDS,
  BOT_COLOR,
  IDLE_FARM_CLICKABLE_SLASH_COMMANDS,
  PREFIX,
  SUPPORT_SERVER_INVITE_LINK,
} from '@idle-helper/constants';

interface IHelp {
  client: Client;
}

export const _help = ({client}: IHelp) => {
  const page = 0;
  let category: string | undefined;

  function render(): BaseMessageOptions {
    const embed = getEmbed({client, page, category});
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
  category?: string;
}

const getEmbed = ({client, category, page}: IGetEmbed) => {
  const embed = new EmbedBuilder()
    .setTitle('IDLE Helper')
    .setColor(BOT_COLOR.embed)
    .setThumbnail(client.user?.displayAvatarURL() ?? null);

  if (!category) {
    setHomePage(embed);
  }

  return embed;
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