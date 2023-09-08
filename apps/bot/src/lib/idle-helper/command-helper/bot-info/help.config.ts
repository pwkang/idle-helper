import {BOT_CLICKABLE_SLASH_COMMANDS} from '@idle-helper/constants';

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
  fields: Embed[];
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
      description: ['**Prefix**: `wr` (not-changable)'],
      title: 'EPIC Helper Help',
      fields: [
        {
          name: 'Basic',
          value: ['Type `wrregister` to register to the bot',
            'Use `/cd` to register the reminder',
            'Type `wrdonor` if you are EPIC RPG donor',
            'Type `wrdonorp` if you wish to hunt with partner\'s cooldown',
            'You can now play EPIC RPG as usual! Bot will reminds you when your command is ready!'],
          inline: false,
        },
        {
          name: 'Have a question?',
          value: ['Checkout the Guide and FAQ buttons below',
            'Or join the [support server](https://discord.gg/NXUUX45ySv) if you can\'t find an answer here'],
          inline: false,
        },
      ],
    },
    selectMenu: {
      name: 'Browse commands',
      items: [
        {
          id: 'user',
          label: 'User',
          emoji: '🕵️',
          description: 'View and modify personal settings',
          commands: [
            {
              name: ['register', '/account register', BOT_CLICKABLE_SLASH_COMMANDS.accountRegister],
              description: ['Register and start using the bot'],
            },
            {
              name: ['on', '/account on'],
              description: ['Turn on everythings'],
            },
            {
              name: ['off', '/account off'],
              description: ['Turn off every things including `reminder`, `enchant mute`, `stats`, `rpg i <area>`, `update pets`'],
            },
            {
              name: ['settings', '/account settings'],
              description: ['View all your personal settings'],
            },
            {
              name: ['delete', '/account delete'],
              description: ['Delete your information from the bot except patreon records',
                'Your EPIC Tokens and boosted server will not be deleted'],
            },
            {
              name: ['donor', '/account donor'],
              description: ['Set your donor tier in EPIC RPG so bot reminds you with cooldown',
                'Bot reminds you based on your existing cooldown reduction'],
            },
            {
              name: ['donorp', '/account donorp'],
              description: ['Set your partner\'s donor tier in EPIC RPG so bot will reminds you with partner\'s cooldown'],
            },
            {
              name: ['huntswitch', 'hs', '/account huntswitch'],
              description: ['Switch hunt reminder message between **hunt** and **hunt t**',
                'E.g. When you do `hunt`, your next reminder will be `hunt t`, and vise versa',
                'Turning this on will ignore `donorp` and hunt with your own cooldown (`donor`)'],
            },
            {
              name: ['toggle', 't', '/toggle user'],
              description: ['Turn on/off any features'],
            },
            {
              name: ['setenchant', 'se', '/config user set-enchant'],
              description: ['Bot will mute the you and EPIC RPG for **5 seconds** when you got enchantment tier you want or higher'],
            },
            {
              name: ['/config user set-minimum-health-to-heal'],
              description: ['Set a minimum HP for the bot to reminds you to heal',
                'Bot will always reminds you to heal when your current HP is lower than HP lost'],
            },
            {
              name: ['/config user set-timezone'],
              description: ['Set your timezone to the bot for the following features',
                '`cd`, `/config guild set-duel-reset-cycle`'],
            },
            {
              name: ['/config user set-time-format'],
              description: ['Set the time format for time display in the following features',
                '`cd`, `/config guild set-duel-reset-cycle`'],
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
              name: ['serversettings', 'ss', '/server settings'],
              description: ['View all server settings'],
            },
            {
              name: ['tokenboost', 'tb', '/server token-boost'],
              description: ['View who used their EPIC Tokens on the server'],
            },
            {
              name: ['/server enchant-channels'],
              description: ['View all enchant channels'],
            },
            {
              name: ['slashcommand', 'sc'],
              description: ['Get the link to activate slash command'],
            },
            {
              name: ['/config server set-event'],
              description: ['Setup event ping (fish, chop, catch, etc.)'],
            },
            {
              name: ['/config server set-channel'],
              description: ['Setup channels of the following features in your server',
                'Enchant mute - A channel for enchant mute',
                'tt-verification - A channel for member to verify their tt to get some roles'],
            },
            {
              name: ['/config server set-role'],
              description: ['Setup roles of the following features in your server',
                'Mod - Person with this role can access to all server/guild commands',
                'Member - A role the bot will modify when locking/unlocking channel before sending random event ping if the channel is locked or hidden'],
            },
            {
              name: ['/config server set-donor-role'],
              description: ['Setup up to 5 roles for donor access within the server',
                'Your server needs 500 EPIC Tokens to setup this'],
            },
            {
              name: ['/config server set-enchant-mute-duration'],
              description: ['Modify mute duration during enchant muting',
                'Your server needs 5 EPIC Tokens to modify this'],
            },
            {
              name: ['/config server set-tt-verify-role'],
              description: ['Setup up to 10 roles to be given on tt verification',
                'Your server needs 12 EPIC Tokens to setup this'],
            },
            {
              name: ['/toggle server'],
              description: ['Turn on/off any server features',
                'Your server needs 12 EPIC Tokens to access this'],
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
              name: ['guildsettings', 'gs', '/guild settings'],
              description: ['View the settings of the guild'],
            },
            {
              name: ['guildlist', 'gl', '/guild list'],
              description: ['View all guild settings in summary'],
            },
            {
              name: ['guildweeklycount', 'gwc', '/guild weekly-count'],
              description: ['View the weekly count list of the guild'],
            },
            {
              name: ['/toggle guild'],
              description: ['Turn on/off any guild features'],
            },
            {
              name: ['/config guild set-role'],
              description: ['Set a role for your guild',
                'Guild members need this role to activate guild reminder and access to `/duel` commands'],
            },
            {
              name: ['/config guild set-reminder'],
              description: ['Set the information for guild reminder'],
            },
            {
              name: ['/config guild set-leader'],
              description: ['Set guild leader of your guild',
                'This member can guild settings of his guild'],
            },
            {
              name: ['/config guild set-duel-log-channel'],
              description: ['Set a channel to send duel log',
                'Member still can use use `/duel add` even this is not set'],
            },
            {
              name: ['/config guild set-duel-reset-cycle'],
              description: ['Set the cycle to reset duel logger'],
            },
            {
              name: ['/config guild delete-guild'],
              description: ['Delete a guild from the server'],
            },
            {
              name: ['/duel add'],
              description: ['Add your duel result to your guild'],
            },
            {
              name: ['/duel undo'],
              description: ['Undo your last duel record',
                'Only 1 history is saved, you can\'t undo multiple times in a row'],
            },
            {
              name: ['/duel list'],
              description: ['Show the XP gained of guild member'],
            },
            {
              name: ['/duel reset'],
              description: ['Reset the duel logger manually'],
            },
            {
              name: ['/duel modify'],
              description: ['Modify duel record of a guild member'],
            },
          ],
        },
        {
          id: 'donor',
          label: 'Donor',
          emoji: '✨',
          description: 'View donor-only commands',
          commands: [
            {
              name: ['boost', 'b', '/boost'],
              description: ['Use your EPIC Tokens on a server to gain extra perks'],
            },
            // {
            //     name: ["cleardm", "/cleardm"],
            //     description: ["Delete messages in DMs between you and EPIC Helper"]
            // },
            {
              name: ['petcd', '/pet cd'],
              description: ['Show all adventure pets'],
            },
            {
              name: ['/pet summary'],
              description: ['Summary your pets in different tier and skills'],
            },
            {
              name: ['/pet calc-fusion-score'],
              description: ['Select pets IDs and display it',
                'Show total and recommended score of selected pets'],
            },
            {
              name: ['/pet show-pet-by-category'],
              description: ['Filter and show the pets with selected skills or skills tier'],
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
              name: ['help', 'h', '/help'],
              description: ['This message'],
            },
            {
              name: ['stats', 'st', '/stats'],
              description: ['Display commands count'],
            },
            {
              name: ['calc', '/calc'],
              description: ['`calc <area>` - Material calculator',
                '`calc <area> <level>` - Estimated super time travel score calculator`'],
            },
            {
              name: ['cd', '/cd'],
              description: ['Show commands exact ready time in your timezone'],
            },
            {
              name: ['vote', '/vote'],
              description: ['Get the link to vote this bot on TOP.GG'],
            },
            {
              name: ['invite', 'inv', '/invite'],
              description: ['Get the link to invite this bot to your server'],
            },
            {
              name: ['donate', 'patreon', 'donor', '/donate'],
              description: ['Show the donate information'],
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
      title: 'EPIC Helper Guide & FAQ',
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
          id: 'user-guide',
          label: 'User related',
          emoji: '🕵️',
          commands: [
            {
              name: ['How to change the reminder channel?'],
              description: ['Reminders will always go to the newest channel you do `rpg cd`, `hunt`, `adventure`, `training`, `working`, and `farm`'],
            },
            {
              name: ['Can I setup separate channels for different reminder?'],
              description: ['No'],
            },
            {
              name: ['Why I can\'t see the daily hunt for today?'],
              description: ['Real time stats only available for donors'],
            },
            {
              name: ['When is the stats reset?'],
              description: ['Daily stats reset on UTC+0 00:00',
                'Weekly stats reset on every Mondy UTC+0 00:00'],
            },
            {
              name: ['Why I can\'t check others\' stats?'],
              description: ['This is to prevent people mentions others without asking and',
                'Prevent people asking for donor to check their daily stats'],
            },
            {
              name: ['What is `wrcd` or `/cd`?'],
              description: ['This is a command that will show the actual ready time based on your timezone'],
            },
            {
              name: ['How to configure my timezone?'],
              description: ['You can use `/config user set-timezone` to update your timezone'],
            },
            {
              name: ['What is enchant mute? (wrsetenchant)'],
              description: ['When you are enchanting your sword/armor, bot will watch your enchant result and mute you when you got the enchantment tier you set in `wrsetenchant`'],
            },
            {
              name: ['How to enable enchant mute?'],
              description: ['Type `wrsetenchant` to select desired enchantment tier',
                'Make sure you have enabled the bot (`wron`)',
                'Start enchanting in the server enchant server'],
            },
          ],
        },
        {
          id: 'server-guide',
          label: 'Server related',
          emoji: '🌏',
          commands: [
            {
              name: ['I don\'t see slash command in my server. What should I do?'],
              description: ['You can type `wrslashcommand` to get a link to activate slash command in your server'],
            },
            {
              name: ['Can I change the bot prefix?'],
              description: ['No'],
            },
            {
              name: ['What is `mod` option in `/config server set-role`?'],
              description: ['Only people with `manage server` permission or the role you set here can access to all admin commands of EPIC Helper in your server'],
            },
            {
              name: ['How to setup server event ping?'],
              description: ['Type `wrslashcommand` if the slash commands are not visible in your server',
                'Type and select `/config server set-event`',
                'Select the event (chop, fish, etc.) and type the message'],
            },
            {
              name: ['How to setup enchant mute in my server?'],
              description: ['Give epic helper manage roles permission so it can give mute the player and epic rpg.',
                'Use  `/config server set-channel` to select the channel you want enchant mute to work in'],
            },
            {
              name: ['I am server owner, can I use enchant mute in my server too?'],
              description: ['Yes, EPIC Helper will mute EPIC RPG too, so it can\'t read your enchant message',
                'Enable this in `/toggle server`'],
            },
          ],
        },
        {
          id: 'guild-guide',
          label: 'Guild related',
          emoji: '🏛️',
          commands: [
            {
              name: ['How to setup guild reminder?'],
              description: ['Use `/config guild set-role` to setup a role for your guild',
                'Use `/config guild set-reminder` to setup the channel, reminder message(upgrade, raid), and minimum stealth for EPIC Helper to switch from upgrade to raid',
                'Assign the role set it in Step 1 to all your EPIC RPG guild member, make sure only the guild member has the role or others people will overwrite your reminder',
                'Use `/rpg guild` to register the reminder, and the guild reminder will start working now. '],
            },
            // {
            //     name: ["How to setup 2 or more guild in my server?"],
            //     description: ["More guilds are only available to EPIC Helper donor by using EPIC Tokens in your server",
            //                 "Each token increase the guild limit by 1"]
            // },
            {
              name: ['I have setup everything in my server, why the bot still not remind me about guild reminder?'],
              description: ['Check if you and your guild member has the guild role which you have set in `/config guild set-role`'],
            },
            {
              name: ['What is duel logger?'],
              description: ['Duel logger is a feature that your guild members can report their guild xp gain from duel',
                'Guild member have to use `/duel add` and select XP manually'],
            },
            {
              name: ['How to enable duel logger?'],
              description: ['As long as you setup a role for your guild, people with the role can access to `/duel add` commands'],
            },
            {
              name: ['Member is doing the `/duel add` in other channel, can I make the bot only accept the commands made in 1 specific channel?'],
              description: ['You can set-up a channel in `/config guild set-duel-log-channel` , so the bot will send a log whenever a member do `/duel add` in the server',
                'Meanwhile, you can also use `/toggle guild` to toggle the type of the log to send'],
            },
            {
              name: ['Bot is sending the reminder with roles, but it\'s not pinging us'],
              description: ['Make sure EPIC Helper has the permission of `mentions @everyone, @here and All Roles`'],
            },
            {
              name: ['All of the guilds are not working in my server, why is that?'],
              description: ['This is because someone remove their EPIC Tokens from the server',
                'You can type `wrtb` to see existing booster'],
            },
          ],
        },
        {
          id: 'donor-guide',
          label: 'Donor related',
          emoji: '✨',
          commands: [
            {
              name: ['The patreon is lifetime basis or monthly basis?'],
              description: ['It is monthly basis, you need to keep donating every month to enjoy the donor perks'],
            },
            {
              name: ['Is the EPIC Token permanent?'],
              description: ['No, the EPIC Tokens will be removed from the server when your subscription ends'],
            },
            // {
            //     name: ["Why am I charged twice after few days when I subscribe to patreon at the end of the month?"],
            //     description: ["Patreon will charges you on the day you subscribe and every first day of the following month.",
            //                 "If you were charged twice, you will get another month when you unsubscribe to patreon"]
            // },
            {
              name: ['I have subscribe to patreon but still can\'t access to donor features, what should I do?'],
              description: ['You need to connect your Discord account in your patreon profile page',
                'If you have connected already but still not getting it, try to disconnect and link your Discord again in patreon'],
            },
            {
              name: ['Can I move the perks to another account?'],
              description: ['Yes, please join the support server and create a ticket for it.'],
            },
            {
              name: ['I am not the owner/admin of the server, can I contribute the EPIC Token to the server?'],
              description: ['Yes, you can use `/boost` in the server you want to use it'],
            },
          ],
        },
      ],
    },
  },
];