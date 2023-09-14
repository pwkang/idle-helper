import {
  BOT_CLICKABLE_SLASH_COMMANDS,
  IDLE_FARM_CLICKABLE_SLASH_COMMANDS,
  PREFIX,
  SUPPORT_SERVER_INVITE_LINK,
} from '@idle-helper/constants';
import messageFormatter from '../../../discordjs/message-formatter';

const {
  help,
  accountRegister,
  accountOn,
  accountSettings,
  accountDonor,
  accountOff,
  accountReminderChannel,
  accountClaimReminder,
  accountDelete,
  guildReminder,
  guildDelete,
  guildSettings,
  guildToggleSet,
  guildToggleReset,
  guildToggleShow,
  guildSetup,
  guildMemberTracker,
  guildLeader,
  toggleSet,
  toggleShow,
  toggleReset,
  lastClaim,
  serverSettings,
  serverRandomEvents,
  invite,
} = BOT_CLICKABLE_SLASH_COMMANDS;

export type IHelpConfig = Category[]

export interface Category {
  id: string;
  label: string;
  home: Home;
  selectMenu: SelectMenu;
}

export interface Home {
  description: string[];
  title: string;
  fields?: Embed[];
}

export interface Embed {
  name: string;
  value: string[];
  inline?: boolean;
}

export interface SelectMenu {
  name: string;
  items: SelectMenuItem[];
}

export type SelectMenuItem = {
  id: string;
  label: string;
  emoji: string;
  description?: string;
} & (
  | {commands: Command[]; info?: never;}
  | {info: Info[]; commands?: never;}
  )

export interface Command {
  name: string[];
  description: string[];
}

export interface Info {
  title: string;
  description: string[];
  image?: string;
}


export const helpConfig: IHelpConfig = [
  {
    id: 'commands',
    label: 'Commands',
    home: {
      description: [
        `**Prefix:** \`${PREFIX.bot}\`, \`@IDLE Helper\``,
      ],
      title: 'IDLE Helper Help',
      fields: [
        {
          name: 'Start',
          value: [
            `- Use ${BOT_CLICKABLE_SLASH_COMMANDS.accountRegister} to register to the bot`,
            `- Register your workers via ${IDLE_FARM_CLICKABLE_SLASH_COMMANDS.workerStats}`,
            '- Start idling',
          ],
        },
        {
          name: 'Have a question?',
          value: [
            '- Checkout the Guide and FAQ buttons below',
            `- Or join the ${messageFormatter.hyperlink({
              text: 'Support Server',
              url: SUPPORT_SERVER_INVITE_LINK,
            })} if you can't find an answer here`],
          inline: false,
        },
      ],
    },
    selectMenu: {
      name: 'Browse commands',
      items: [
        {
          id: 'account',
          label: 'Account',
          emoji: '🕵️',
          description: 'View and modify account settings',
          commands: [
            {
              name: [accountRegister, 'register'],
              description: ['Register to the bot'],
            },
            {
              name: [accountSettings, 'settings'],
              description: ['View all personal settings'],
            },
            {
              name: [accountOn, 'on'],
              description: ['Enable the bot'],
            },
            {
              name: [accountOff, 'off'],
              description: [
                'Disable the bot',
                'Bot will not track any of your message except message start with bot prefix',
                'You will not able to use any features',
              ],
            },
            {
              name: [accountDonor, 'donor'],
              description: [
                'Set IDLE FARM donor tier',
                'Update your donor tier to adjust market tax, etc.',
              ],
            },
            {
              name: [accountReminderChannel],
              description: [
                'Set the channel to send reminder',
              ],
            },
            {
              name: [accountClaimReminder],
              description: [
                'Setup to send reminders when you have idle for certain hours',
                'Support multiple hours, e.g. 1 4 8 10 12',
                'Min: 1h, Max: 24h',
              ],
            },
            {
              name: [accountDelete, 'delete'],
              description: [
                'Delete your account',
                'This will delete all your data from the bot',
              ],
            },
            {
              name: [toggleShow, 'toggle', 't'],
              description: ['Show which features are on/off'],
            },
            {
              name: [toggleSet, 'toggle set', 't set'],
              description: ['Turn any features on/off'],
            },
            {
              name: [toggleReset, 'toggle reset', 't reset'],
              description: ['Reset all features to default'],
            },
          ],
        },
        {
          id: 'server',
          label: 'Server',
          emoji: '🌏',
          description: 'View server settings or information',
          commands: [
            {
              name: [serverSettings],
              description: ['View the settings of the server'],
            },
            {
              name: [serverRandomEvents],
              description: ['Configure message to send when random events spawned'],
            },
          ],
        },
        {
          id: 'guild',
          label: 'Guild',
          emoji: '🏛️',
          description: 'View guild settings or information',
          commands: [
            {
              name: [guildSetup],
              description: [
                'Setup a new guild',
                'You need to bind a unique role to each guild',
              ],
            },
            {
              name: [guildSettings],
              description: ['View the settings of the guild'],
            },
            {
              name: [guildDelete],
              description: ['Delete the guild'],
            },
            {
              name: [guildReminder],
              description: ['Configure message to send when guild upgrade or raid is ready'],
            },
            {
              name: [guildLeader],
              description: [
                'Update guild leader',
                'This user can update guild settings without having `MANAGE_SERVER` permission',
              ],
            },
            {
              name: [guildToggleSet],
              description: ['turn any guild features on/off'],
            },
            {
              name: [guildToggleReset],
              description: ['Reset all guild features to default'],
            },
            {
              name: [guildToggleShow],
              description: ['Show all guild features'],
            },
            {
              name: [guildMemberTracker],
              description: ['Track guild member status'],
            },
            {
              name: ['guild power'],
              description: [
                'alias: `guild p`',
                'View list of guild members sorted by total top 3 power',
              ],
            },
          ],
        },
        {
          id: 'features',
          label: 'Features',
          emoji: '✨',
          description: 'View all features',
          commands: [
            {
              name: [lastClaim, 'lastClaim', 'lc'],
              description: ['View the duration since your last claim'],
            },
            {
              name: ['top'],
              description: [
                'Show global leaderboard',
              ],
            },
            {
              name: ['worker', 'wo'],
              description: [
                'View registered workers',
              ],
            },
            {
              name: ['worker top', 'wo top'],
              description: [
                'Show your top 3 power workers',
              ],
            },
          ],
        },
        {
          id: 'other',
          label: 'Other',
          emoji: '⚙️',
          description: 'Miscellaneous commands',
          commands: [
            {
              name: [help, 'help', 'h'],
              description: ['This command'],
            },
            {
              name: [invite],
              description: ['Invite the bot to your server'],
            },
            {
              name: ['info'],
              description: ['View bot information'],
            },
          ],
        },
      ],
    },
  },
  {
    id: 'otherFeatures',
    label: 'Other Features',
    home: {
      title: 'Other Features',
      description: [
        '- Raid Helper',
        '- Claim Reminder',
        '- Team Raid Helper',
        '- Random Events Pings',
        '- Last Claim Duration',
        '- Global Worker Leaderboard',
        '- Inventory idlons Calculator',
        '- etc...',
      ],
    },
    selectMenu: {
      name: 'Browse features',
      items: [
        {
          id: 'list1',
          label: 'Features List 1',
          emoji: '⚙️',
          info: [
            {
              title: 'Inventory idlons Calculator',
              description: [
                'Calculate total amount of idlons you have from your inventory',
                `Commands: \`${PREFIX.idleFarm}inv calc\` / \`${PREFIX.idleFarm}i c\``,
                'Set your IDLE FARM donor tier to adjust market tax',
              ],
              image: 'https://cdn.discordapp.com/attachments/817697861964660746/1149750965075968112/CleanShot_2023-09-09_at_00.59.422x.png',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'qna',
    label: 'Guide & FAQ',
    home: {
      title: 'IDLE Helper Guide & FAQ',
      description: ['You can find the answer of most frequently asked question here\n'],
      fields: [
        {
          name: 'Have other questions?',
          value: ['Join the [support server](https://discord.gg/NXUUX45ySv) and ask us'],
        },
      ],
    },
    selectMenu: {
      name: 'Browse Guide',
      items: [
        {
          id: 'user',
          label: 'Player related',
          emoji: '🕵️',
          commands: [
            {
              name: ['How to enable raid helper?'],
              description: [
                'After you have registered your workers, raid helper will be enabled automatically',
                'Use `worker` to check whether your workers are registered',
                'You can use `toggle` to turn it off anytime',
              ],
            },
          ],
        },
      ],
    },
  },
];