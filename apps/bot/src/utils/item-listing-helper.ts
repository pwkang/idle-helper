import {
  BaseMessageOptions,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  Message,
} from 'discord.js';
import {generateNavigationRow, NAVIGATION_ROW_BUTTONS} from './pagination-row';
import {sleep} from '@idle-helper/utils';
import djsInteractionHelper from '../lib/discordjs/interaction';
import {djsMessageHelper} from '../lib/discordjs/message';

type TActionType =
  | {message: Message; interaction?: never}
  | {message?: never; interaction: ChatInputCommandInteraction};

type IItemListingHelper = {
  client: Client;
  totalItems: number;
  channelId: string;
  itemsPerPage: number;
  embedFn: (page: number) => Promise<EmbedBuilder>;
} & TActionType;

export const itemListingHelper = async ({
  client,
  totalItems,
  channelId,
  message,
  interaction,
  itemsPerPage,
  embedFn,
}: IItemListingHelper) => {
  let page = 0;
  const pageOptions = await createPage({
    embedFn,
    itemsPerPage,
    totalItems,
    page,
  });
  let event = await generateResponse({
    client,
    message,
    interaction,
    options: pageOptions,
  });
  if (!event) return;
  const events = {
    [NAVIGATION_ROW_BUTTONS.first]: () => {
      page = 0;
    },
    [NAVIGATION_ROW_BUTTONS.prev]: () => page--,
    [NAVIGATION_ROW_BUTTONS.next]: () => page++,
    [NAVIGATION_ROW_BUTTONS.last]: () => (page = Math.floor(totalItems / itemsPerPage)),
  };
  for (const [key, fn] of Object.entries(events)) {
    event.on(key, () => {
      fn();
      return createPage({
        embedFn,
        itemsPerPage,
        page,
        totalItems,
      });
    });
  }
  event.on(NAVIGATION_ROW_BUTTONS.all, async () => {
    showAllItems({
      channelId,
      client,
      totalItems,
      embedFn,
      itemsPerPage,
    });
    return {
      content: '‍',
      embeds: [],
      components: [],
    };
  });
};

interface IShowAllItems {
  client: Client;
  embedFn: (page: number) => Promise<EmbedBuilder>;
  totalItems: number;
  channelId: string;
  itemsPerPage: number;
}

const showAllItems = async ({
  client,
  totalItems,
  channelId,
  embedFn,
  itemsPerPage,
}: IShowAllItems) => {
  const totalPage = Math.floor(totalItems / itemsPerPage);
  for (let i = 0; i <= totalPage; i++) {
    const embed = await embedFn(i);
    await djsMessageHelper.send({
      client,
      channelId,
      options: {
        embeds: [embed],
      },
    });
    await sleep(1500);
  }
};

interface IGenerateResponse {
  message?: Message;
  interaction?: ChatInputCommandInteraction;
  client: Client;
  options: Awaited<ReturnType<typeof createPage>>;
}

const generateResponse = async ({client, message, interaction, options}: IGenerateResponse) => {
  let event;
  if (message) {
    event = await djsMessageHelper.interactiveSend({
      client,
      channelId: message.channel.id,
      options,
    });
  } else if (interaction) {
    event = await djsInteractionHelper.replyInteraction({
      client,
      interaction,
      options,
      interactive: true,
    });
  }
  return event;
};

interface ICreatePage {
  page: number;
  totalItems: number;
  itemsPerPage: number;
  embedFn: (page: number) => Promise<EmbedBuilder>;
}

const createPage = async ({
  page,
  totalItems,
  embedFn,
  itemsPerPage,
}: ICreatePage): Promise<BaseMessageOptions> => {
  const embed = await embedFn(page);
  const row = generateNavigationRow({
    page,
    total: totalItems,
    all: true,
    itemsPerPage,
  });
  return {
    embeds: [embed],
    components: [row],
  };
};
