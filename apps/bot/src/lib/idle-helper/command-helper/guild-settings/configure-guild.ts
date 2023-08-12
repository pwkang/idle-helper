import {
  ActionRowBuilder,
  BaseInteraction,
  BaseMessageOptions,
  ButtonBuilder,
  ButtonStyle,
  Client,
  EmbedBuilder,
  Guild,
  PermissionsBitField,
  StringSelectMenuInteraction,
  User,
} from 'discord.js';
import {guildService} from '../../../../services/database/guild.service';
import {_getGuildSettingsEmbed} from './embed/guild-settings.embed';
import messageFormatter from '../../../discordjs/message-formatter';
import {BOT_COLOR} from '@idle-helper/constants';
import {djsMemberHelper} from '../../../discordjs/member';
import {getUpdateQuery} from '../toggle/toggle.helper';
import {IGuild} from '@idle-helper/models';
import {toggleDisplayList} from '../toggle/toggle.list';
import {getGuildToggleEmbed} from '../toggle/type/guild.toggle';

interface IConfigureGuild {
  client: Client;
  author: User;
  server: Guild;
  roleId: string;
}

interface ISetupNewGuild {
  leader?: User;
}

interface IUpdateGuild {
  roleId: string;
  channelId?: string;
  reminderMessage?: string;
}

interface ISetLeader {
  leader: User;
}

interface IDeleteGuildConfirmation {
  interaction: BaseInteraction | StringSelectMenuInteraction;
}

interface IUpdateToggle {
  on?: string;
  off?: string;
}

export const _configureGuild = async ({author, server, client, roleId}: IConfigureGuild) => {
  const guildAccount = await guildService.findGuild({
    roleId,
    serverId: server.id,
  });
  const roleUsed = !!guildAccount;
  const member = await djsMemberHelper.getMember({
    client,
    serverId: server.id,
    userId: author.id,
  });
  const isServerAdmin = member?.permissions.has(PermissionsBitField.Flags.ManageGuild);
  const isGuildLeader = guildAccount?.leaderId === author.id;

  const deleteGuild = async (): Promise<BaseMessageOptions> => {
    if (!isServerAdmin) {
      return {
        content: 'You do not have permission to delete this guild.',
      };
    }
    if (!roleUsed) {
      return {
        content: 'There is no guild with this role.',
      };
    }
    return {
      content: 'Are you sure you want to delete this guild?',
      embeds: [
        _getGuildSettingsEmbed({
          guildAccount,
        }),
      ],
      components: [guildDeletionConfirmation],
    };
  };

  const deleteGuildConfirmation = async ({
    interaction,
  }: IDeleteGuildConfirmation): Promise<BaseMessageOptions> => {
    if (!interaction.isButton()) return {};
    const customId = interaction.customId;
    if (customId === 'yes') {
      await guildService.deleteGuild({
        roleId,
        serverId: server.id,
      });
      return {
        content: '',
        embeds: [
          new EmbedBuilder()
            .setDescription(`Successfully deleted guild - ${messageFormatter.role(roleId)}`)
            .setColor(BOT_COLOR.embed),
        ],
        components: [],
      };
    } else if (customId === 'no') {
      return {
        content: 'Cancelled',
        embeds: [],
        components: [],
      };
    }
    return {};
  };

  const setLeader = async ({leader}: ISetLeader): Promise<BaseMessageOptions> => {
    if (!roleUsed) {
      return {
        content: 'There is no guild with this role.',
      };
    }
    if (!isGuildLeader && !isServerAdmin) {
      return {
        content: 'You do not have permission to use this command.',
      };
    }
    const updatedGuild = await guildService.updateLeader({
      leaderId: leader.id,
      roleId,
      serverId: server.id,
    });

    if (!updatedGuild) {
      return {
        content: 'There is no guild with this role.',
      };
    }
    return {
      embeds: [
        _getGuildSettingsEmbed({
          guildAccount: updatedGuild,
        }),
      ],
    };
  };

  const setupNewGuild = async ({leader}: ISetupNewGuild): Promise<BaseMessageOptions> => {
    if (!isServerAdmin) {
      return {
        content: 'You do not have permission to setup a new guild.',
      };
    }
    if (roleUsed) {
      return {
        content: 'This role is already used by another guild.',
      };
    }
    const newGuild = await guildService.registerGuild({
      serverId: server.id,
      roleId,
      leaderId: leader?.id,
    });
    return {
      embeds: [
        _getGuildSettingsEmbed({
          guildAccount: newGuild,
        }),
      ],
    };
  };

  const updateGuild = async ({
    roleId,
    reminderMessage,
    channelId,
  }: IUpdateGuild): Promise<BaseMessageOptions> => {
    if (!isGuildLeader && !isServerAdmin) {
      return {
        content: 'You do not have permission to use this command.',
      };
    }
    if (!roleUsed) {
      return {
        content: 'There is no guild with this role.',
      };
    }

    const updatedGuild = await guildService.updateGuildReminder({
      channelId,
      roleId,
      reminderMessage,
      serverId: server.id,
    });

    if (!updatedGuild) {
      return {
        content: 'There is no guild with this role.',
      };
    }

    return {
      embeds: [
        _getGuildSettingsEmbed({
          guildAccount: updatedGuild,
        }),
      ],
    };
  };

  const updateToggle = async ({on, off}: IUpdateToggle): Promise<BaseMessageOptions> => {
    if (!isGuildLeader && !isServerAdmin) {
      return {
        content: 'You do not have permission to use this command.',
      };
    }
    if (!roleUsed) {
      return {
        content: 'There is no guild with this role.',
      };
    }

    const query = getUpdateQuery<IGuild>({
      on,
      off,
      toggleInfo: toggleDisplayList.guild(guildAccount.toggle),
    });
    const updatedGuild = await guildService.updateToggle({
      query,
      roleId,
      serverId: server.id,
    });
    if (!updatedGuild) return {};
    return {
      embeds: [
        getGuildToggleEmbed({
          guildAccount: updatedGuild,
        }),
      ],
    };
  };

  const resetToggle = async (): Promise<BaseMessageOptions> => {
    if (!isGuildLeader && !isServerAdmin) {
      return {
        content: 'You do not have permission to use this command.',
      };
    }
    if (!roleUsed) {
      return {
        content: 'There is no guild with this role.',
      };
    }

    const updatedGuild = await guildService.resetToggle({
      roleId,
      serverId: server.id,
    });
    if (!updatedGuild) return {};
    return {
      embeds: [
        getGuildToggleEmbed({
          guildAccount: updatedGuild,
        }),
      ],
    };
  };

  return {
    deleteGuild,
    deleteGuildConfirmation,
    setLeader,
    setupNewGuild,
    updateGuild,
    updateToggle,
    resetToggle,
  };
};

const guildDeletionConfirmation = new ActionRowBuilder<ButtonBuilder>()
  .addComponents(
    new ButtonBuilder().setCustomId('yes').setLabel('Yes').setStyle(ButtonStyle.Success)
  )
  .addComponents(new ButtonBuilder().setCustomId('no').setLabel('No').setStyle(ButtonStyle.Danger));
