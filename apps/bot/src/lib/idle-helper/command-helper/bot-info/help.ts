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

  function render(): BaseMessageOptions {
    const embed = getEmbed(client);
    return {
      embeds: [embed],
    };
  }

  return {
    render,
  };
};

const getEmbed = (client: Client) => new EmbedBuilder()
  .setColor(BOT_COLOR.embed)
  .setTitle('IDLE Helper Help')
  .setDescription(`**Prefix:** \`${PREFIX.bot}\` (not-customizable)`)
  .setThumbnail(client.user?.avatarURL() ?? null)
  .addFields({
    name: 'Basic',
    value: [
      `- Use ${BOT_CLICKABLE_SLASH_COMMANDS.accountRegister} to register to the bot`,
      `- Register your workers via ${IDLE_FARM_CLICKABLE_SLASH_COMMANDS.workerStats}`,
    ].join('\n'),
  }, {
    name: 'Features',
    value: [
      `- Raid Helper - send en embed with your & enemy's workers lvl & power during a raid`,
      '- Setup server random event pings',
      '- More coming soon...',
    ].join('\n'),
  }, {
    name: 'Have a question?',
    value: [
      `- Join the [support server](${SUPPORT_SERVER_INVITE_LINK})`,
    ].join('\n'),
  });
