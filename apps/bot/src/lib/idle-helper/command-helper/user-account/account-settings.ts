import {
  ActionRowBuilder,
  BaseMessageOptions,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  User,
} from 'discord.js';
import {userService} from '../../../../services/database/user.service';
import {_getUserSettingsEmbed} from './embeds/user-settings.embed';

interface IAccountSettings {
  author: User;
}

interface IRender {
  type: ValuesOf<typeof PAGE_TYPE>;
}

export const _accountSettings = async ({author}: IAccountSettings) => {
  const userProfile = await userService.findUser({
    userId: author.id,
  });
  if (!userProfile) return null;

  const userSettingsEmbed = _getUserSettingsEmbed({
    author,
    userProfile,
  });

  function render({type}: IRender) {
    switch (type) {
      case PAGE_TYPE.settings:
        return {
          embeds: [userSettingsEmbed],
          components: [getActionRow({selected: PAGE_TYPE.settings})],
        };
    }
  }

  function responseInteraction(interaction: StringSelectMenuInteraction): BaseMessageOptions {
    const selected = interaction.values[0] as ValuesOf<typeof PAGE_TYPE>;
    return render({type: selected});
  }

  return {
    render,
    responseInteraction,
  };
};

const PAGE_TYPE = {
  settings: 'settings',
} as const;

interface IGetActionRow {
  selected: ValuesOf<typeof PAGE_TYPE>;
}

const getActionRow = ({selected}: IGetActionRow) => {
  return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('cmd_type')
      .setPlaceholder('Select a command')
      .setOptions({
        label: 'Settings',
        value: 'settings',
        default: selected === PAGE_TYPE.settings,
      })
  );
};
