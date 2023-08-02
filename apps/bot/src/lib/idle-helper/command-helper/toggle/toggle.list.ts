import type {IToggleEmbedsInfo} from './toggle.embed';
import {IUserToggle} from '@idle-helper/models';


export const user = (userToggle: IUserToggle): IToggleEmbedsInfo[] => {
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

export const toggleDisplayList = {
  user,
};
