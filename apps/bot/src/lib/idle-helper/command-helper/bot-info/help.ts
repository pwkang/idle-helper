import type {BaseMessageOptions, Client} from 'discord.js';
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder} from 'discord.js';
import type {IHelpCommand, IHelpCommandsGroup} from '@idle-helper/constants';
import {
  BOT_COLOR,
  BOT_INVITE_LINK,
  HELP_COMMANDS,
  HELP_COMMANDS_GROUP,
  PREFIX,
  SUPPORT_SERVER_INVITE_LINK
} from '@idle-helper/constants';
import Fuse from 'fuse.js';


interface IHelp {
  client: Client<true>;
  search?: string;
}

export const _help = async ({
  client,
  search
}: IHelp): Promise<BaseMessageOptions> => {
  if (!search) {
    const embed = generateEmbedHome({
      groups: HELP_COMMANDS_GROUP,
      client
    });
    return {
      embeds: [embed],
      components: [generateButtons()]
    };
  }

  const searchResult = searchCommand({search, commands: HELP_COMMANDS});

  if (searchResult.length) {
    const embed = generateEmbedCommand(searchResult[0].item);
    return {
      embeds: [embed]
    };
  }

  return {
    content: 'No command found'
  };
};

interface ISearchCommand {
  commands: IHelpCommand[];
  search: string;
}

const searchCommand = ({search, commands}: ISearchCommand) => {
  const fuseCommand = new Fuse(
    commands.filter((cmd) => cmd.type === 'command'),
    {
      keys: ['prefixCommands'],
      threshold: 0.2
    }
  );
  const fuseFeatures = new Fuse(
    commands.filter((cmd) => cmd.type === 'feature'),
    {
      keys: ['name'],
      threshold: 0.4
    }
  );

  return [...fuseCommand.search(search), ...fuseFeatures.search(search)];
};

interface IGenerateEmbed {
  groups: IHelpCommandsGroup[];
  client: Client<true>;
}

export const generateEmbedHome = ({groups, client}: IGenerateEmbed) => {
  const embed = new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setTitle('IDLE Helper Help')
    .setDescription(`Prefix: \`${PREFIX.bot}\` | \`@${client.user.username}\``);

  for (const group of groups) {
    if (!group.commands?.length || !group.fieldLabel) continue;
    if (group.type === 'commands')
      embed.addFields({
        name: group.fieldLabel,
        value: group.commands
          .filter((command) => command?.prefixCommands?.length)
          .map((command) => `\`${command?.prefixCommands?.[0]}\``)
          .join(', ')
      });
    if (group.type === 'features')
      embed.addFields({
        name: group.fieldLabel,
        value: group.commands
          .map((command) => `\`${command?.name}\``)
          .join(', ')
      });
  }

  embed.addFields({
    name: '\u200b',
    value: `Type \`${PREFIX.bot}help [command /feature]\` to get more information`
  });

  return embed;
};

export const generateButtons = () => {
  return new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel('Invite')
        .setURL(BOT_INVITE_LINK)
    )
    .addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel('Support Server')
        .setURL(SUPPORT_SERVER_INVITE_LINK)
    );
};

const generateEmbedCommand = (command: IHelpCommand) => {
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed);

  if (command.name) embed.setTitle(command.name);

  if (command.description) embed.setDescription(command.description);

  embed.addFields(
    {
      name: 'Commands',
      value: command.prefixCommands
        ? command.prefixCommands.map((prefix) => `\`${prefix}\``).join(', ')
        : '-'
    },
    {
      name: 'Usage',
      value: command.usage ?? '-'
    }
  );

  return embed;
};
