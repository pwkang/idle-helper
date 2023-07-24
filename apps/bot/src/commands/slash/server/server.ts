import {SlashCommandBuilder} from 'discord.js';
import {
  IDLE_FARM_RANDOM_EVENTS_NAME,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@idle-helper/constants';
import {viewServerSettings} from './subcommand/view-server-settings';
import {setRandomEventMessages} from './subcommand/set-random-event-messages';

export default <SlashCommand>{
  name: 'server',
  builder: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Server configuration')
    .addSubcommand((subcommand) =>
      subcommand.setName('settings').setDescription('View the server settings')
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('random-events')
        .setDescription('set message to send when random events occur (type "clear" to remove)')
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
            .setName(IDLE_FARM_RANDOM_EVENTS_NAME.dice.replaceAll(' ', '-').toLowerCase())
            .setDescription(IDLE_FARM_RANDOM_EVENTS_NAME.dice)
        )
        .addStringOption((option) =>
          option
            .setName(IDLE_FARM_RANDOM_EVENTS_NAME.packing.replaceAll(' ', '-').toLowerCase())
            .setDescription(IDLE_FARM_RANDOM_EVENTS_NAME.packing)
        )
    ),
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip,
  },
  execute: async (client, interaction) => {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case 'settings':
        await viewServerSettings({client, interaction});
        break;
      case 'random-events':
        await setRandomEventMessages({client, interaction});
        break;
    }
  },
};
