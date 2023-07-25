import {EmbedBuilder} from 'discord.js';
import {BOT_COLOR, BOT_INVITE_LINK, SUPPORT_SERVER_INVITE_LINK} from '@idle-helper/constants';


export const _invite = async (): Promise<EmbedBuilder> => {
  const embed = new EmbedBuilder()
    .setColor(BOT_COLOR.embed);

  embed.addFields({
      name: 'Invite IDLE Helper to your server',
      value: `**[Invite Link](${BOT_INVITE_LINK})**`,
    },
    {
      name: 'Join the IDLE Helper support server',
      value: `**[Support Server](${SUPPORT_SERVER_INVITE_LINK})**`,
    });

  return embed;
};
