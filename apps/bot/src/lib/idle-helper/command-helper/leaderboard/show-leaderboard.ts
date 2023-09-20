import {infoService} from '../../../../services/database/info.service';
import {ActionRowBuilder, BaseInteraction, EmbedBuilder, StringSelectMenuBuilder} from 'discord.js';
import {BOT_COLOR, BOT_EMOJI, IDLE_FARM_WORKER_TYPE} from '@idle-helper/constants';
import {IInfo} from '@idle-helper/models/dist/info/info.type';
import {generateNavigationRow} from '../../../../utils/pagination-row';
import {typedObjectEntries} from '@idle-helper/utils';

export const _showLeaderboard = async () => {
  let leaderboard = await infoService.getLeaderboard() as IInfo['leaderboard'] | undefined;
  let selectedType: keyof typeof SELECTOR_LABEL = IDLE_FARM_WORKER_TYPE.useless;
  let page = 0;

  const render = () => {
    return {
      components: generateSelector({
        page,
        currentSelectItem: selectedType,
        total: leaderboard?.[selectedType]?.length ?? 0,
      }),
      embeds: [
        generateEmbed({
          page,
          type: selectedType,
          leaderboard,
        }),
      ],
    };
  };

  const replyInteraction = (interaction: BaseInteraction) => {
    if (interaction.isStringSelectMenu()) {
      selectedType = interaction.values[0] as keyof typeof SELECTOR_LABEL;
      page = 0;
    }
    if (interaction.isButton()) {
      page = Number(interaction.customId);
    }
    return render();
  };

  const stop = () => {
    leaderboard = undefined;
  };

  return {
    render,
    replyInteraction,
    stop,
  };
};

const SELECTOR_LABEL = {
  [IDLE_FARM_WORKER_TYPE.useless]: {
    emoji: BOT_EMOJI.worker.useless,
    label: 'Useless',
  },
  [IDLE_FARM_WORKER_TYPE.deficient]: {
    emoji: BOT_EMOJI.worker.deficient,
    label: 'Deficient',
  },
  [IDLE_FARM_WORKER_TYPE.common]: {
    emoji: BOT_EMOJI.worker.common,
    label: 'Common',
  },
  [IDLE_FARM_WORKER_TYPE.talented]: {
    emoji: BOT_EMOJI.worker.talented,
    label: 'Talented',
  },
  [IDLE_FARM_WORKER_TYPE.wise]: {
    emoji: BOT_EMOJI.worker.wise,
    label: 'Wise',
  },
  [IDLE_FARM_WORKER_TYPE.expert]: {
    emoji: BOT_EMOJI.worker.expert,
    label: 'Expert',
  },
  [IDLE_FARM_WORKER_TYPE.masterful]: {
    emoji: BOT_EMOJI.worker.masterful,
    label: 'Masterful',
  },
};

const PAGES_TITLE = {
  [IDLE_FARM_WORKER_TYPE.useless]: `${BOT_EMOJI.worker.useless} ${BOT_EMOJI.workerText.useless1}${BOT_EMOJI.workerText.useless2}${BOT_EMOJI.workerText.useless3}${BOT_EMOJI.workerText.useless4}${BOT_EMOJI.workerText.useless5}${BOT_EMOJI.workerText.useless6}`,
  [IDLE_FARM_WORKER_TYPE.deficient]: `${BOT_EMOJI.worker.deficient} ${BOT_EMOJI.workerText.deficient1}${BOT_EMOJI.workerText.deficient2}${BOT_EMOJI.workerText.deficient3}${BOT_EMOJI.workerText.deficient4}${BOT_EMOJI.workerText.deficient5}${BOT_EMOJI.workerText.deficient6}${BOT_EMOJI.workerText.deficient7}`,
  [IDLE_FARM_WORKER_TYPE.common]: `${BOT_EMOJI.worker.common} ${BOT_EMOJI.workerText.common1}${BOT_EMOJI.workerText.common2}${BOT_EMOJI.workerText.common3}${BOT_EMOJI.workerText.common4}${BOT_EMOJI.workerText.common5}`,
  [IDLE_FARM_WORKER_TYPE.talented]: `${BOT_EMOJI.worker.talented} ${BOT_EMOJI.workerText.talented1}${BOT_EMOJI.workerText.talented2}${BOT_EMOJI.workerText.talented3}${BOT_EMOJI.workerText.talented4}${BOT_EMOJI.workerText.talented5}${BOT_EMOJI.workerText.talented6}${BOT_EMOJI.workerText.talented7}`,
  [IDLE_FARM_WORKER_TYPE.expert]: `${BOT_EMOJI.worker.expert} ${BOT_EMOJI.workerText.expert1}${BOT_EMOJI.workerText.expert2}${BOT_EMOJI.workerText.expert3}${BOT_EMOJI.workerText.expert4}${BOT_EMOJI.workerText.expert5}`,
  [IDLE_FARM_WORKER_TYPE.wise]: `${BOT_EMOJI.worker.wise} ${BOT_EMOJI.workerText.wise1}${BOT_EMOJI.workerText.wise2}${BOT_EMOJI.workerText.wise3}${BOT_EMOJI.workerText.wise4}`,
  [IDLE_FARM_WORKER_TYPE.masterful]: `${BOT_EMOJI.worker.masterful} ${BOT_EMOJI.workerText.masterful1}${BOT_EMOJI.workerText.masterful2}${BOT_EMOJI.workerText.masterful3}${BOT_EMOJI.workerText.masterful4}${BOT_EMOJI.workerText.masterful5}${BOT_EMOJI.workerText.masterful6}${BOT_EMOJI.workerText.masterful7}`,
};

interface IGenerateEmbed {
  type: keyof typeof SELECTOR_LABEL;
  leaderboard?: IInfo['leaderboard'];
  page: number;
}

const ITEMS_PER_PAGE = 15;

const generateEmbed = ({type, leaderboard, page}: IGenerateEmbed) => {
  const embed = new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setTitle(':trophy: LEADERBOARD :trophy:')
    .setFooter({
      text: 'Leaderboard is updated every hour',
    });

  const leaderboardPage = leaderboard?.[type].slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE,
  ) ?? [];

  const description = [PAGES_TITLE[type]];
  description.push(
    leaderboardPage.length
      ? leaderboardPage
        .map(
          (lb, index) => `${page * ITEMS_PER_PAGE + index + 1}. **${lb.name}** ~-~ ${lb.value}`,
        )
        .join('\n')
      : 'No data found',
  );
  embed.setDescription(description.join('\n'));

  return embed;
};

interface IGenerateSelector {
  page: number;
  total: number;
  currentSelectItem: keyof typeof SELECTOR_LABEL;
}

const generateSelector = ({page, total, currentSelectItem}: IGenerateSelector) => {
  const rows = [];
  const paginateRow = generateNavigationRow({
    page,
    itemsPerPage: ITEMS_PER_PAGE,
    total,
  });
  rows.push(paginateRow);

  const selectorRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('leaderboard-selector')
      .setPlaceholder('Select a type')
      .addOptions(
        typedObjectEntries(SELECTOR_LABEL).map(([type, value]) => ({
          value: type,
          label: value.label,
          default: type === currentSelectItem,
          emoji: value.emoji,
        })),
      ),
  );
  rows.push(selectorRow);
  return rows;
};
