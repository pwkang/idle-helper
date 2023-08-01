import {SlashCommandBuilder} from 'discord.js';
import {slashRegisterAccount} from './subcommand/account-register';
import {slashShowUserAccount} from './subcommand/slash-show-user-account';
import {slashAccountOn} from './subcommand/slash-account-on';
import {slashAccountOff} from './subcommand/slash-account-off';
import {slashAccountDelete} from './subcommand/account-delete';
import {USER_ACC_OFF_ACTIONS} from '@idle-helper/constants';
import {setClaimReminder} from './subcommand/account-claim-reminder';
import {slashBindReminderChannel} from './subcommand/bind-reminder-channel';

export default <SlashCommand>{
  name: 'account',
  builder: new SlashCommandBuilder()
    .setName('account')
    .setDescription('Account related commands')
    .addSubcommand((subcommand) =>
      subcommand.setName('register').setDescription('Register your account'),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('settings').setDescription('View your account settings'),
    )
    .addSubcommand((subcommand) => subcommand.setName('on').setDescription('Turn on your account'))
    .addSubcommand((subcommand) =>
      subcommand.setName('off').setDescription('Turn off your account'),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('delete').setDescription('Delete your account'),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('claim-reminder')
        .setDescription('Set reminder to claim your farm')
        .addStringOption((option) =>
          option
            .setName('hours')
            .setDescription('Separated multiple time by comma, e.g. 4,12,24')
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('reminder-channel')
        .setDescription('Bind reminder channel to current channel'),
    )
  ,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_ACC_OFF_ACTIONS.skip,
  },
  execute: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case 'register':
        await slashRegisterAccount({client, interaction});
        break;
      case 'settings':
        await slashShowUserAccount({client, interaction});
        break;
      case 'on':
        await slashAccountOn({client, interaction});
        break;
      case 'off':
        await slashAccountOff({client, interaction});
        break;
      case 'delete':
        await slashAccountDelete({client, interaction});
        break;
      case 'claim-reminder':
        await setClaimReminder({client, interaction});
        break;
      case 'reminder-channel':
        await slashBindReminderChannel({client, interaction});
        break;

    }
  },
};
