import type {IToggleEmbedsInfo} from './toggle.embed';
import type {IGuildToggle, IUserToggle} from '@idle-helper/models';

const user = (userToggle: IUserToggle): IToggleEmbedsInfo[] => {
  return [
    {
      id: 'common',
      title: 'Common Features',
      inline: true,
      children: [
        {
          value: userToggle.raid.helper,
          path: 'toggle.raid.helper',
          label: 'Raid Helper',
          children: [
            {
              value: userToggle.raid.solution,
              path: 'toggle.raid.solution',
              label: 'Gives best solution'
            },
            {
              value: userToggle.raid.compact,
              path: 'toggle.raid.compact',
              label: 'Compact Mode (best solution only)'
            }
          ]
        },
        {
          value: userToggle.calculator.all,
          path: 'toggle.calculator.all',
          label: 'Idlons Calculator',
          children: [
            {
              value: userToggle.calculator.inventory,
              path: 'toggle.calculator.inventory',
              label: 'Inventory Calculator'
            },
            {
              value: userToggle.calculator.claim,
              path: 'toggle.calculator.claim',
              label: 'Claim Calculator'
            }
          ]
        },
        {
          value: userToggle.autoSend.profile,
          path: 'toggle.autoSend.profile',
          label: 'Send last-claim @ `idle p`'
        }
      ]
    },
    {
      id: 'reminder',
      title: 'Reminder',
      inline: true,
      children: [
        {
          value: userToggle.reminder.vote,
          path: 'toggle.reminder.vote',
          label: 'Vote Reminder'
        },
        {
          value: userToggle.reminder.daily,
          path: 'toggle.reminder.daily',
          label: 'Daily Reminder'
        },
        {
          value: userToggle.reminder.claim,
          path: 'toggle.reminder.claim',
          label: 'Claim Reminder'
        }
      ]
    }
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
          value: guildToggle?.teamRaid?.helper,
          label: 'Team Raid Helper',
          path: 'toggle.teamRaid.helper'
        },
        {
          value: guildToggle?.teamRaid?.reminder,
          path: 'toggle.teamRaid.reminder',
          label: 'Team Raid Reminder'
        }
      ]
    }
  ];
};

export const toggleDisplayList = {
  user,
  guild
};
