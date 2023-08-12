import {BaseMessageOptions, User} from 'discord.js';
import {userService} from '../../../../../services/database/user.service';
import {toggleDisplayList} from '../toggle.list';
import {renderEmbed} from '../toggle.embed';
import {getUpdateQuery, IUpdateToggle} from '../toggle.helper';
import {IUser, IUserToggle} from '@idle-helper/models';
import {PREFIX} from '@idle-helper/constants';

interface IGetUserToggle {
  author: User;
}

export const getUserToggle = async ({author}: IGetUserToggle) => {
  let userToggle = await userService.getUserToggle({
    userId: author.id,
  });
  if (!userToggle) return null;

  function render(userToggle: IUserToggle): BaseMessageOptions {
    const embed = getEmbed(userToggle);
    return {
      embeds: [embed],
    };
  }

  function getEmbed(userToggle: IUserToggle) {
    return getUserToggleEmbed({
      author,
      userToggle,
    });
  }

  async function update({on, off}: IUpdateToggle) {
    const query = getUpdateQuery<IUser>({
      on,
      off,
      toggleInfo: toggleDisplayList.user(userToggle!),
    });
    const userAccount = await userService.updateUserToggle({
      query,
      userId: author.id,
    });
    if (!userAccount) return null;
    userToggle = userAccount.toggle;
    return render(userToggle);
  }

  async function reset() {
    const userAccount = await userService.resetUserToggle({
      userId: author.id,
    });
    if (!userAccount) return null;
    userToggle = userAccount.toggle;
    return render(userToggle);
  }

  return {
    render: () => render(userToggle!),
    update,
    reset,
  };
};

interface IGetUserToggleEmbed {
  userToggle: IUserToggle;
  author: User;
}

const getUserToggleEmbed = ({userToggle, author}: IGetUserToggleEmbed) => {
  return renderEmbed({
    embedsInfo: toggleDisplayList.user(userToggle),
  })
    .setAuthor({
      name: `${author.username}'s toggle`,
      iconURL: author.avatarURL() ?? undefined,
    })
    .setDescription(
      `**Syntax 1:** \`${PREFIX.bot}t <on/off> <ID> [ID] [ID]\` - turn on/off any settings
      > *\`${PREFIX.bot}t on a1 a5 b3a c2-c5\`*
      **Syntax 2:** \`${PREFIX.bot}t reset\` - reset all settings`
    );
};
