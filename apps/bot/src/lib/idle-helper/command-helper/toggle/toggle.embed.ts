import type {EmbedField} from 'discord.js';
import {EmbedBuilder} from 'discord.js';
import {BOT_COLOR, BOT_EMOJI} from '@idle-helper/constants';

export interface IToggleEmbedsInfo {
  id: string;
  title: string;
  value?: boolean;
  path?: string;
  description?: string;
  inline: boolean;
  children: {
    label: string;
    value: boolean;
    path: string;
    children?: {
      path: string;
      label: string;
      value: boolean;
    }[];
  }[];
}

interface IGetToggleEmbed {
  embedsInfo: IToggleEmbedsInfo[];
}

export const renderEmbed = ({embedsInfo}: IGetToggleEmbed): EmbedBuilder => {
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed);

  const fields: EmbedField[] = embedsInfo.map((info, index) =>
    renderFieldValue({
      info,
      index
    })
  );
  embed.addFields(fields);
  return embed;
};

interface IRenderFieldValue {
  info: IToggleEmbedsInfo;
  index: number;
}

const renderFieldValue = ({info, index}: IRenderFieldValue): EmbedField => {
  const embedValue: string[] = [];
  const {value, children: parent, inline} = info;
  const groupId = String.fromCharCode(65 + index);
  const toGrey = value === false;

  for (const i in parent) {
    const child = parent[i];
    const {value, children, label} = child;
    const toGreySubChildren = !value;
    const childId = Number(i) + 1;
    const emoji = renderEmoji({status: value, grey: toGrey && i !== '0'});
    embedValue.push(`${emoji} \`${groupId}${childId}\` ${label}`);

    if (children?.length) {
      for (const j in children) {
        const subChild = children[j];
        const {value, label} = subChild;
        const emoji = renderEmoji({status: value, grey: toGreySubChildren});
        const subChildId = String.fromCharCode(97 + Number(j));
        embedValue.push(
          `${emoji}--\`${groupId}${childId}${subChildId}\` ${label}`
        );
      }
    }
  }

  return {
    value: embedValue.join('\n'),
    inline,
    name: info.title
  };
};

interface IRenderEmoji {
  grey: boolean;
  status: boolean;
}

const renderEmoji = ({status, grey}: IRenderEmoji) => {
  if (grey) return status ? BOT_EMOJI.utils.onGrey : BOT_EMOJI.utils.offGrey;
  else return status ? BOT_EMOJI.utils.on : BOT_EMOJI.utils.off;
};
