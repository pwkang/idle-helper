import {
  ActionRowBuilder,
  BaseMessageOptions,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  User,
} from 'discord.js';
import {userService} from '../../../../services/database/user.service';
import {BOT_CLICKABLE_SLASH_COMMANDS, BOT_COLOR} from '@idle-helper/constants';

interface ISlashAccountDelete {
  author: User;
}

export const _deleteAccount = ({author}: ISlashAccountDelete) => {
  function render(): BaseMessageOptions {
    return {
      embeds: [embed],
      components: [actionRow],
    };
  }

  async function responseInteraction(customId: string): Promise<BaseMessageOptions> {
    if (customId === 'confirm') {
      await userService.deleteUser({userId: author.id});
      return {
        components: [],
        embeds: [deletedEmbed],
      };
    } else {
      return {
        components: [],
        embeds: [cancelledEmbed],
      };
    }
  }

  return {
    render,
    responseInteraction,
  };
};

const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder().setCustomId('confirm').setLabel('Confirm').setStyle(ButtonStyle.Primary),
  new ButtonBuilder().setCustomId('cancel').setLabel('Cancel').setStyle(ButtonStyle.Secondary),
);

const embed = new EmbedBuilder()
  .setColor(BOT_COLOR.embed)
  .setTitle('Are you sure you want to delete your account?')
  .setDescription(
    'The following information will be deleted:\n' +
    '- Account information\n' +
    '- All settings\n',
  );

const deletedEmbed = new EmbedBuilder()
  .setColor(BOT_COLOR.embed)
  .setTitle('Successfully deleted your account!')
  .setDescription(
    `You can create a new account by using ${BOT_CLICKABLE_SLASH_COMMANDS.accountRegister} again`,
  );

const cancelledEmbed = new EmbedBuilder()
  .setColor(BOT_COLOR.embed)
  .setDescription('You have cancelled your account deletion');
