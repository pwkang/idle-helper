import {
  ActionRowBuilder,
  BaseMessageOptions,
  Guild,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
} from 'discord.js';
import {serverService} from '../../../../services/database/server.service';
import {_getRandomEventSettingsEmbed} from './embed/random-event.embed';
import {SERVER_SETTINGS_PAGE_TYPE} from './constant';

interface IServerSettings {
  server: Guild;
}

interface IRender {
  type: ValuesOf<typeof SERVER_SETTINGS_PAGE_TYPE>;
  displayOnly?: boolean;
}

export const _serverSettings = async ({server}: IServerSettings) => {
  const serverAccount = await serverService.getServer({
    serverId: server.id,
  });
  if (!serverAccount) return null;

  const render = ({type, displayOnly}: IRender): BaseMessageOptions => {
    let embed;
    switch (type) {
      case SERVER_SETTINGS_PAGE_TYPE.randomEvent:
        embed = _getRandomEventSettingsEmbed({
          serverAccount,
          guild: server,
        });
        break;
    }
    let components: ActionRowBuilder<StringSelectMenuBuilder>[] = [];

    if (!displayOnly) {
      components = [_getServerSettingsPageSelector({pageType: type})];
    }

    return {
      embeds: [embed],
      components,
    };
  };

  const responseInteraction = (interaction: StringSelectMenuInteraction): BaseMessageOptions => {
    const pageType = interaction.values[0] as ValuesOf<typeof SERVER_SETTINGS_PAGE_TYPE>;
    return render({type: pageType});
  };

  return {
    render,
    responseInteraction,
  };
};

interface IGetServerSettingsPageSelector {
  pageType?: ValuesOf<typeof SERVER_SETTINGS_PAGE_TYPE>;
}

interface IPage {
  id: ValuesOf<typeof SERVER_SETTINGS_PAGE_TYPE>;
  label: string;
}

const SERVER_SETTINGS_PAGES: IPage[] = [
  {
    id: SERVER_SETTINGS_PAGE_TYPE.randomEvent,
    label: 'Random event',
  },
];

const _getServerSettingsPageSelector = ({
  pageType = SERVER_SETTINGS_PAGE_TYPE.randomEvent,
}: IGetServerSettingsPageSelector) =>
  new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('page-type')
      .setPlaceholder('Select a page')
      .setOptions(
        SERVER_SETTINGS_PAGES.map(({id, label}) => ({
          label,
          value: id,
          default: id === pageType,
        }))
      )
  );
