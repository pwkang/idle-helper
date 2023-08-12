import djsInteractionHelper from '../../../../lib/discordjs/interaction';
import {serverService} from '../../../../services/database/server.service';
import commandHelper from '../../../../lib/idle-helper/command-helper';
import {SERVER_SETTINGS_PAGE_TYPE} from '../../../../lib/idle-helper/command-helper/server-settings/constant';
import {
  IDLE_FARM_RANDOM_EVENTS_NAME,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@idle-helper/constants';
import {SLASH_COMMAND} from '../../constant';
import {PermissionsBitField} from 'discord.js';

export default <SlashCommand>{
  name: SLASH_COMMAND.server.randomEvents.name,
  description: SLASH_COMMAND.server.randomEvents.description,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
    isServerAdmin: true,
  },
  type: 'subcommand',
  commandName: SLASH_COMMAND.server.name,
  builder: (subcommand) =>
    subcommand
      .addStringOption((option) =>
        option
          .setName(IDLE_FARM_RANDOM_EVENTS_NAME.energy.replaceAll(' ', '-').toLowerCase())
          .setDescription(IDLE_FARM_RANDOM_EVENTS_NAME.energy)
      )
      .addStringOption((option) =>
        option
          .setName(IDLE_FARM_RANDOM_EVENTS_NAME.worker.replaceAll(' ', '-').toLowerCase())
          .setDescription(IDLE_FARM_RANDOM_EVENTS_NAME.worker)
      )
      .addStringOption((option) =>
        option
          .setName(IDLE_FARM_RANDOM_EVENTS_NAME.lucky.replaceAll(' ', '-').toLowerCase())
          .setDescription(IDLE_FARM_RANDOM_EVENTS_NAME.lucky)
      )
      .addStringOption((option) =>
        option
          .setName(IDLE_FARM_RANDOM_EVENTS_NAME.packing.replaceAll(' ', '-').toLowerCase())
          .setDescription(IDLE_FARM_RANDOM_EVENTS_NAME.packing)
      ),
  permissions: [PermissionsBitField.Flags.ManageGuild],
  execute: async (client, interaction) => {
    const packing = interaction.options.getString(
      IDLE_FARM_RANDOM_EVENTS_NAME.packing.replaceAll(' ', '-').toLowerCase()
    );
    const worker = interaction.options.getString(
      IDLE_FARM_RANDOM_EVENTS_NAME.worker.replaceAll(' ', '-').toLowerCase()
    );
    const energy = interaction.options.getString(
      IDLE_FARM_RANDOM_EVENTS_NAME.energy.replaceAll(' ', '-').toLowerCase()
    );
    const lucky = interaction.options.getString(
      IDLE_FARM_RANDOM_EVENTS_NAME.lucky.replaceAll(' ', '-').toLowerCase()
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
  },
};
