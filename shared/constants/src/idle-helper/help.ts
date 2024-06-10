export interface IHelpCommand {
  name?: string;
  prefixCommands?: string[];
  description?: string;
  usage?: string;
  type?: 'feature' | 'command';
}

export const HELP_COMMANDS: IHelpCommand[] = [{
  name: 'Market',
  prefixCommands: ['market', 'ma'],
  description: '- Show all items info in a single page',
  type: 'command'
}, {
  name: 'Packing helper',
  prefixCommands: ['packing start', 'pa start'],
  description: 'Bot will guide you to do packing until you get target idlons\nUsage: \\`${PREFIX.bot}packing start [target idlons] [item name]\\`\nExample: \\`${PREFIX.bot}packing start 650m aluminium ore\\`\n\nSupported quantity: `k` `m` `b` `t`\n\nWanna use all worker tokens? Do 100t',
  type: 'command'
}, {
  name: 'Packing',
  prefixCommands: ['packing', 'pa'],
  description: 'View the most profitable packing item\nDo `wh packing [any item] 100` to register your multiplier value\n\n**What is multiplier value?**\nIt is the extra boxes you can get when you do packing based on your packing level',
  type: 'command'
}, {
  name: 'Worker assign helper',
  prefixCommands: ['worker assign', 'wo assign'],
  description: 'You will need to list your current workers and farm\nBot will then send a message with your farms and buttons of your workers\nall you need to do is click buttons to assign worker to the farms\n\nOnce you have done, bot will send list of commands for you to copy to assign the worker',
  type: 'command'
}, {
  name: 'Top 3 worker',
  prefixCommands: ['worker top', 'wo top'],
  description: 'Show your top 3 power workers',
  type: 'command'
}, {
  name: 'Show registered workers',
  prefixCommands: ['worker', 'wo'],
  description: 'Show your registered workers',
  type: 'command'
}, {
  name: 'Worker leaderboard',
  prefixCommands: ['top'],
  description: 'Show global worker leaderboard',
  type: 'command'
}, {
  name: 'Last claim',
  prefixCommands: ['lastclaim', 'lc', '/last-claim'],
  description: 'View the duration since your last claim',
  type: 'command'
}, {
  name: 'Get invite link',
  prefixCommands: ['invite'],
  description: 'Get invite link to invite bot or join support server',
  type: 'command'
}, {
  name: 'Help',
  prefixCommands: ['help', 'h'],
  description: 'This command',
  usage: '`help [command / feature]` - Read more info about a command / feature',
  type: 'command'
}, {
  name: 'Check guild member power',
  prefixCommands: ['guild power', 'guild p'],
  description: 'View list of guild members sorted by total top 3 power',
  type: 'command'
}, {
  name: 'Guild member tracker',
  prefixCommands: ['/guild member-tracker'],
  description: 'Track whether all guild member has guild role, or any non-guild members have the role',
  type: 'command'
}, {
  name: 'Toggle guild feature',
  prefixCommands: ['/guild toggle'],
  description: '- Turn and guild features on / off',
  type: 'command'
}, {
  name: 'Set guild leader',
  prefixCommands: ['/guild leader'],
  description: 'Update guild leader\nThis user can update guild settings without having `MANAGE_SERVER` permission',
  type: 'command'
}, {
  name: 'Guild reminder',
  prefixCommands: ['/guild reminder'],
  description: 'Configure message to send when guild upgrade or raid is ready',
  type: 'command'
}, {
  name: 'Delete guild',
  description: 'Delete guild',
  usage: '`/guild delete`',
  type: 'command'
}, {
  name: 'View guild settings',
  prefixCommands: ['/guild settings'],
  description: 'View the settings of the guild',
  usage: '`/guild settings`',
  type: 'command'
}, {
  name: 'Setup guild',
  prefixCommands: ['/guild setup'],
  description: 'Setup a new guild\nYou need to bind a unique role to each guild\nYou can setup multiple guilds in the server (no limit)',
  usage: '`/guild setup role:@guild`',
  type: 'command'
}, {
  name: 'Set server random event',
  prefixCommands: ['/server random-events'],
  description: 'Configure message to send when random events spawned',
  usage: '`/server random-events lucky-reward: @events join`',
  type: 'command'
}, {
  name: 'View server settings',
  prefixCommands: ['/server settings'],
  description: 'View the settings of the server',
  usage: '`/server settings`',
  type: 'command'
}, {
  name: 'Toggle',
  prefixCommands: ['toggle', 't', '/toggle'],
  description: 'Turn any features on or off\n',
  usage: '`hw t <on/off> <ID> [ID] [ID]` - turn on/off any settings\n`hw t reset` - reset all settings',
  type: 'command'
}, {
  name: 'Account delete',
  prefixCommands: ['delete', '/account delete'],
  description: 'Delete your account\nThis will delete all your data from the bot',
  usage: '`delete`',
  type: 'command'
}, {
  name: 'Claim reminder',
  prefixCommands: ['/account claim-reminder'],
  description: 'Setup to send reminders when you have idle for certain hours\nSupport multiple hours, e.g. `1 4 8 10 12`\nmin: 1h, Max: 12h',
  usage: '`/account claim-reminder hours:1 4 12` ',
  type: 'command'
}, {
  name: 'Set reminder channel',
  description: 'Set which channel should the bot to send all the reminder',
  usage: '</account reminder-channel:1133445157145030788>',
  type: 'command'
}, {
  name: 'Set IDLE FARM donor tier',
  prefixCommands: ['donor'],
  description: 'Set your IDLE FARM donor tier. The following features will be displayed based on your donor tier.\n- idlons calculator\n- claim calculator\n- packing multiplier',
  usage: '`donor`',
  type: 'command'
}, {
  name: 'View account settings',
  prefixCommands: ['settings', 's'],
  description: 'View your account settings',
  usage: '`settings`',
  type: 'command'
}, {
  name: 'Turn off account',
  prefixCommands: ['off'],
  description: 'Turn off your account. Bot will stop tracking your IDLE FARM progress. Some of the features will be disabled. ',
  usage: '`off`',
  type: 'command'
}, {
  name: 'Account Register',
  prefixCommands: ['register'],
  description: 'Register your account before start using the bot',
  usage: '`register`',
  type: 'command'
}, {
  name: 'Turn on account',
  prefixCommands: ['on'],
  description: 'Turn on your account. Bot will track your IDLE FARM progress such as profile, inventory, workers, farms.',
  usage: '`on`',
  type: 'command'
}];

export interface IHelpCommandsGroup {
  name?: string;
  fieldLabel?: string;
  commands?: IHelpCommand[];
  order?: number;
  type?: 'commands' | 'features';
}

export const HELP_COMMANDS_GROUP: IHelpCommandsGroup[] = [{
  type: 'commands',
  commands: [{
    name: 'Account Register',
    prefixCommands: ['register'],
    description: 'Register your account before start using the bot',
    usage: '`register`',
    type: 'command'
  }, {
    name: 'View account settings',
    prefixCommands: ['settings', 's'],
    description: 'View your account settings',
    usage: '`settings`',
    type: 'command'
  }, {
    name: 'Turn on account',
    prefixCommands: ['on'],
    description: 'Turn on your account. Bot will track your IDLE FARM progress such as profile, inventory, workers, farms.',
    usage: '`on`',
    type: 'command'
  }, {
    name: 'Turn off account',
    prefixCommands: ['off'],
    description: 'Turn off your account. Bot will stop tracking your IDLE FARM progress. Some of the features will be disabled. ',
    usage: '`off`',
    type: 'command'
  }, {
    name: 'Account delete',
    prefixCommands: ['delete', '/account delete'],
    description: 'Delete your account\nThis will delete all your data from the bot',
    usage: '`delete`',
    type: 'command'
  }, {
    name: 'Set IDLE FARM donor tier',
    prefixCommands: ['donor'],
    description: 'Set your IDLE FARM donor tier. The following features will be displayed based on your donor tier.\n- idlons calculator\n- claim calculator\n- packing multiplier',
    usage: '`donor`',
    type: 'command'
  }, {
    name: 'Set reminder channel',
    description: 'Set which channel should the bot to send all the reminder',
    usage: '</account reminder-channel:1133445157145030788>',
    type: 'command'
  }, {
    name: 'Toggle',
    prefixCommands: ['toggle', 't', '/toggle'],
    description: 'Turn any features on or off\n',
    usage: '`hw t <on/off> <ID> [ID] [ID]` - turn on/off any settings\n`hw t reset` - reset all settings',
    type: 'command'
  }, {
    name: 'Claim reminder',
    prefixCommands: ['/account claim-reminder'],
    description: 'Setup to send reminders when you have idle for certain hours\nSupport multiple hours, e.g. `1 4 8 10 12`\nmin: 1h, Max: 12h',
    usage: '`/account claim-reminder hours:1 4 12` ',
    type: 'command'
  }],
  order: 1,
  name: 'Account',
  fieldLabel: '👤 Account commands 👤'
}, {
  type: 'commands',
  commands: [{
    name: 'View server settings',
    prefixCommands: ['/server settings'],
    description: 'View the settings of the server',
    usage: '`/server settings`',
    type: 'command'
  }, {
    name: 'Set server random event',
    prefixCommands: ['/server random-events'],
    description: 'Configure message to send when random events spawned',
    usage: '`/server random-events lucky-reward: @events join`',
    type: 'command'
  }],
  order: 2,
  name: 'Server',
  fieldLabel: '🏛️ Server commands 🏛️'
}, {
  type: 'commands',
  commands: [{
    name: 'Setup guild',
    prefixCommands: ['/guild setup'],
    description: 'Setup a new guild\nYou need to bind a unique role to each guild\nYou can setup multiple guilds in the server (no limit)',
    usage: '`/guild setup role:@guild`',
    type: 'command'
  }, {
    name: 'View guild settings',
    prefixCommands: ['/guild settings'],
    description: 'View the settings of the guild',
    usage: '`/guild settings`',
    type: 'command'
  }, {
    name: 'Delete guild',
    description: 'Delete guild',
    usage: '`/guild delete`',
    type: 'command'
  }, {
    name: 'Guild reminder',
    prefixCommands: ['/guild reminder'],
    description: 'Configure message to send when guild upgrade or raid is ready',
    type: 'command'
  }, {
    name: 'Set guild leader',
    prefixCommands: ['/guild leader'],
    description: 'Update guild leader\nThis user can update guild settings without having `MANAGE_SERVER` permission',
    type: 'command'
  }, {
    name: 'Toggle guild feature',
    prefixCommands: ['/guild toggle'],
    description: '- Turn and guild features on / off',
    type: 'command'
  }, {
    name: 'Guild member tracker',
    prefixCommands: ['/guild member-tracker'],
    description: 'Track whether all guild member has guild role, or any non-guild members have the role',
    type: 'command'
  }, {
    name: 'Check guild member power',
    prefixCommands: ['guild power', 'guild p'],
    description: 'View list of guild members sorted by total top 3 power',
    type: 'command'
  }],
  order: 3,
  name: 'Guild',
  fieldLabel: '🏵️ Guild command 🏵️'
}, {
  type: 'commands',
  commands: [{
    name: 'Last claim',
    prefixCommands: ['lastclaim', 'lc', '/last-claim'],
    description: 'View the duration since your last claim',
    type: 'command'
  }, {
    name: 'Worker leaderboard',
    prefixCommands: ['top'],
    description: 'Show global worker leaderboard',
    type: 'command'
  }, {
    name: 'Show registered workers',
    prefixCommands: ['worker', 'wo'],
    description: 'Show your registered workers',
    type: 'command'
  }, {
    name: 'Top 3 worker',
    prefixCommands: ['worker top', 'wo top'],
    description: 'Show your top 3 power workers',
    type: 'command'
  }, {
    name: 'Worker assign helper',
    prefixCommands: ['worker assign', 'wo assign'],
    description: 'You will need to list your current workers and farm\nBot will then send a message with your farms and buttons of your workers\nall you need to do is click buttons to assign worker to the farms\n\nOnce you have done, bot will send list of commands for you to copy to assign the worker',
    type: 'command'
  }, {
    name: 'Packing',
    prefixCommands: ['packing', 'pa'],
    description: 'View the most profitable packing item\nDo `wh packing [any item] 100` to register your multiplier value\n\n**What is multiplier value?**\nIt is the extra boxes you can get when you do packing based on your packing level',
    type: 'command'
  }, {
    name: 'Packing helper',
    prefixCommands: ['packing start', 'pa start'],
    description: 'Bot will guide you to do packing until you get target idlons\nUsage: \\`${PREFIX.bot}packing start [target idlons] [item name]\\`\nExample: \\`${PREFIX.bot}packing start 650m aluminium ore\\`\n\nSupported quantity: `k` `m` `b` `t`\n\nWanna use all worker tokens? Do 100t',
    type: 'command'
  }, {
    name: 'Market',
    prefixCommands: ['market', 'ma'],
    description: '- Show all items info in a single page',
    type: 'command'
  }],
  order: 4,
  name: 'Utils',
  fieldLabel: '⚙️ Utilities commands ⚙️'
}, {
  type: 'commands',
  commands: [{
    name: 'Get invite link',
    prefixCommands: ['invite'],
    description: 'Get invite link to invite bot or join support server',
    type: 'command'
  }, {
    name: 'Help',
    prefixCommands: ['help', 'h'],
    description: 'This command',
    usage: '`help [command / feature]` - Read more info about a command / feature',
    type: 'command'
  }],
  order: 5,
  name: 'Info',
  fieldLabel: '🧾 Information commands 🧾'
}];
