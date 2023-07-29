import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import {serverService} from '../../../../services/database/server.service';
import commandHelper from '../../../../lib/idle-helper/command-helper';
import {IServerConfig} from './type';
import {SERVER_SETTINGS_PAGE_TYPE} from '../../../../lib/idle-helper/command-helper/server-settings/constant';
import {IDLE_FARM_RANDOM_EVENTS_NAME} from '@idle-helper/constants';

export const setRandomEventMessages = async ({client, interaction}: IServerConfig) => {
  const packing = interaction.options.getString(
    IDLE_FARM_RANDOM_EVENTS_NAME.packing.replaceAll(' ', '-').toLowerCase(),
  );
  const worker = interaction.options.getString(
    IDLE_FARM_RANDOM_EVENTS_NAME.worker.replaceAll(' ', '-').toLowerCase(),
  );
  const energy = interaction.options.getString(
    IDLE_FARM_RANDOM_EVENTS_NAME.energy.replaceAll(' ', '-').toLowerCase(),
  );
  const lucky = interaction.options.getString(
    IDLE_FARM_RANDOM_EVENTS_NAME.lucky.replaceAll(' ', '-').toLowerCase(),
  );

  const serverAccount = await serverService.updateRandomEvents({
    serverId: interaction.guildId!,
    randomEvents: {
      worker: worker ? (worker === 'clear' ? null : worker) : undefined,
      energy: energy ? (energy === 'clear' ? null : energy) : undefined,
      lucky: lucky ? (lucky === 'clear' ? null : lucky) : undefined,
      packing: packing ? (packing === 'clear' ? null : packing) : undefined,
    },
  });
  if (!serverAccount) return null;
  const serverSettings = await commandHelper.serverSettings.settings({
    server: interaction.guild!,
  });
  if (!serverSettings) return null;
  await djsInteractionHelper.replyInteraction({
    client,
    interaction,
    options: serverSettings.render({
      type: SERVER_SETTINGS_PAGE_TYPE.randomEvent,
      displayOnly: true,
    }),
  });
};
