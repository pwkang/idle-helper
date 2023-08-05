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
