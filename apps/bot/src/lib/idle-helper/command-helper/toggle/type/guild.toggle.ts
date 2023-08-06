import {toggleDisplayList} from '../toggle.list';
import {renderEmbed} from '../toggle.embed';
import {getUpdateQuery, IUpdateToggle} from '../toggle.helper';
import {IGuild} from '@idle-helper/models';
import {guildService} from '../../../../../services/database/guild.service';

interface IGetGuildToggle {
  serverId: string;
  roleId: string;
}

export const getGuildToggle = async ({serverId, roleId}: IGetGuildToggle) => {
  const guildAccount = await guildService.findGuild({
    serverId,
    roleId,
  });
  if (!guildAccount) return null;

  const render = (guildAccount: IGuild) => {
    const embed = getGuildToggleEmbed({
      guildAccount,
    });
    return {
      embeds: [embed],
    };
  };

  const update = async ({on, off}: IUpdateToggle) => {
    const query = getUpdateQuery<IGuild>({
      on,
      off,
      toggleInfo: toggleDisplayList.guild(guildAccount.toggle),
    });
    const updatedGuildAccount = await guildService.updateToggle({
      query,
      roleId,
      serverId,
    });
    if (!updatedGuildAccount) return null;
    return render(updatedGuildAccount);
  };

  const reset = async () => {
    const updatedGuildAccount = await guildService.resetToggle({
      roleId,
      serverId,
    });
    if (!updatedGuildAccount) return null;
    return render(updatedGuildAccount);
  };

  return {
    render: () => render(guildAccount),
    update,
    reset,
  };
};

interface IGetGuildToggleEmbed {
  guildAccount: IGuild;
}

export const getGuildToggleEmbed = ({guildAccount}: IGetGuildToggleEmbed) => {
  return renderEmbed({
    embedsInfo: toggleDisplayList.guild(guildAccount.toggle),
  }).setAuthor({
    name: `${guildAccount.info.name ?? ''} Toggle Settings`,
  });
};
