import type {
  BaseMessageOptions,
  User} from 'discord.js';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} from 'discord.js';
import {userService} from '../../../../services/database/user.service';
import {BOT_COLOR, IDLE_FARM_DONOR_TIER} from '@idle-helper/constants';

interface ISetDonor {
  author: User;
}

export const _setDonor = ({author}: ISetDonor) => {
  function render(): BaseMessageOptions {
    return {
      embeds: [embed],
      components: [row]
    };
  }

  async function responseInteraction(
    customId: string
  ): Promise<BaseMessageOptions | null> {
    const tier = customId as ValuesOf<typeof IDLE_FARM_DONOR_TIER>;
    await userService.updateIdleFarmDonorTier({
      userId: author.id,
      tier
    });

    return {
      components: [],
      embeds: [getSuccessEmbed(tier)]
    };
  }

  return {
    render,
    responseInteraction
  };
};

const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder()
    .setCustomId(IDLE_FARM_DONOR_TIER.nonDonor)
    .setLabel('Non-donor')
    .setStyle(ButtonStyle.Primary),
  new ButtonBuilder()
    .setCustomId(IDLE_FARM_DONOR_TIER.common)
    .setLabel('Common')
    .setStyle(ButtonStyle.Primary),
  new ButtonBuilder()
    .setCustomId(IDLE_FARM_DONOR_TIER.talented)
    .setLabel('Talented')
    .setStyle(ButtonStyle.Primary),
  new ButtonBuilder()
    .setCustomId(IDLE_FARM_DONOR_TIER.wise)
    .setLabel('Wise +')
    .setStyle(ButtonStyle.Primary)
);

const RESPONSE_MSG = {
  [IDLE_FARM_DONOR_TIER.nonDonor]:
    'You have set your donor tier to **Non-donor**',
  [IDLE_FARM_DONOR_TIER.common]: 'You have set your donor tier to **Common**',
  [IDLE_FARM_DONOR_TIER.talented]:
    'You have set your donor tier to **Talented**',
  [IDLE_FARM_DONOR_TIER.wise]: 'You have set your donor tier to **Wise +**'
} as const;

const getSuccessEmbed = (tier: ValuesOf<typeof IDLE_FARM_DONOR_TIER>) => {
  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed);

  embed.setDescription(RESPONSE_MSG[tier]);

  return embed;
};

const embed = new EmbedBuilder()
  .setColor(BOT_COLOR.embed)
  .setDescription('Select your IDLE FARM donor tier');
