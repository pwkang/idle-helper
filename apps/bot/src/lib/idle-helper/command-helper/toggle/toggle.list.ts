import type {IToggleEmbedsInfo} from './toggle.embed';
import {IGuildToggle, IUserToggle} from '@idle-helper/models';

const user = (userToggle: IUserToggle): IToggleEmbedsInfo[] => {
  return [
    {
      id: 'common',
      title: 'Common Features',
      inline: true,
      children: [
        {
          value: userToggle.raidHelper,
          path: 'toggle.raidHelper',
          label: 'Raid Helper',
        },
        {
          value: userToggle.reminder.claim,
          path: 'toggle.reminder.claim',
          label: 'Claim Reminder',
        },
        {
          value: userToggle.calculator.all,
          path: 'toggle.calculator.all',
          label: 'Idlons Calculator',
          children: [
            {
              value: userToggle.calculator.inventory,
              path: 'toggle.calculator.inventory',
              label: 'Inventory Calculator',
            },
            {
              value: userToggle.calculator.claim,
              path: 'toggle.calculator.claim',
              label: 'Claim Calculator',
            },
          ],
        },
      ],
    },

  ];
};

const guild = (guildToggle: IGuildToggle): IToggleEmbedsInfo[] => {
  return [
    {
      id: 'general',
      title: 'General',
      inline: true,
      children: [
        {
          value: guildToggle.teamRaid.helper,
          label: 'Team Raid Helper',
          path: 'toggle.teamRaid.helper',
        },
        {
          value: guildToggle.teamRaid.reminder,
          path: 'toggle.teamRaid.reminder',
          label: 'Team Raid Reminder',
        },
      ],
    },
  ];
};

export const toggleDisplayList = {
  user,
  guild,
};
