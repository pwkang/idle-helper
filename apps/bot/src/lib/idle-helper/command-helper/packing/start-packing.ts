import type {Client, Message, User} from 'discord.js';
import {EmbedBuilder} from 'discord.js';
import {userService} from '../../../../services/database/user.service';
import type {IDLE_FARM_DONOR_TIER} from '@idle-helper/constants';
import {
  BOT_COLOR,
  BOT_EMOJI,
  IDLE_FARM_ITEMS_BOX,
  IDLE_FARM_ITEMS_BOX_TYPE,
  IDLE_FARM_ITEMS_MATERIAL,
  PREFIX,
  TAX_RATE_BOX
} from '@idle-helper/constants';
import {djsMessageHelper} from '../../../discordjs/message';
import {createIdleFarmCommandListener} from '../../../../utils/idle-farm-command-listener';
import {messageChecker} from '../../../idle-farm/message-checker';
import messageReaders from '../../../idle-farm/message-readers';
import {parseNumber} from '../../../../utils/parse-number';
import {typedObjectEntries} from '@idle-helper/utils';
import {createMessageEditedListener} from '../../../../utils/message-edited-listener';
import {infoService} from '../../../../services/database/info.service';
import {calculatePackingProfits} from '../../../../utils/calc-packing-profits';
import ms from 'ms';
import embedProvider from '../../embeds';

interface IStartPacking {
  client: Client;
  author: User;
  message: Message;
  args: string[];
}

export const _startPacking = async ({
  author,
  message,
  client,
  args
}: IStartPacking) => {
  const userAccount = await userService.findUser({
    userId: author.id
  });
  if (!userAccount) return;
  const sendMessage = async (content: string) =>
    sendCommandEmbed({
      message: content,
      client,
      channelId: message.channel.id
    });
  let idlons: number;
  let workerTokens: number;
  let boxAmount: number = 0;
  let materialAmount: number = 0;
  let multiplier = userAccount.packing.multiplier;
  const targetIdlons = parseNumber(args[2]);
  const selectedItem = args.slice(3).join(' ');
  const marketItems = await infoService.getMarketItems();
  const materialName = typedObjectEntries(IDLE_FARM_ITEMS_MATERIAL).find(
    ([, label]) => label.toLowerCase() === selectedItem.toLowerCase()
  )?.[0];

  if (!userAccount.config.donorTier) {
    await djsMessageHelper.send({
      options: {
        embeds: [embedProvider.setDonor()]
      },
      client,
      channelId: message.channel.id
    });
    return;
  }

  if (targetIdlons === null) {
    return sendMessage('Invalid amount, please enter a valid number');
  }

  if (selectedItem !== '' && !materialName) {
    return sendMessage('Item not found');
  }

  if (!materialName) {
    return sendMessage('Item not found');
  }
  const materialPrice = marketItems[materialName].price;

  const materialBoxType = IDLE_FARM_ITEMS_BOX_TYPE[materialName];
  const boxPrice = marketItems[materialBoxType].price;

  let event = createIdleFarmCommandListener({
    author,
    channelId: message.channel.id,
    client,
    readAuthorMessage: true
  });
  if (!event) return;

  event.on('content', async (content, collected) => {
    if (idlons === undefined || workerTokens === undefined) return;
    if (messageChecker.packing.isIdlePacking({message: collected, author})) {
      const packingResult = messageReaders.packing(collected);
      if (packingResult.materialType !== materialName) {
        return sendMessage('Hey, You are packing something else!');
      }
      workerTokens -= packingResult.materialAmount / 100;
      multiplier = packingResult.multiplier;
      boxAmount += packingResult.boxGained;
      materialAmount -= packingResult.materialAmount;
      nextAction();
    }
    if (messageChecker.sell.isSold({author, message: collected})) {
      const sellResult = messageReaders.sell(collected);
      if (sellResult.soldItem === materialName) {
        materialAmount -= sellResult.soldAmount;
      } else if (sellResult.soldItem === materialBoxType) {
        boxAmount -= sellResult.soldAmount;
      } else {
        return sendMessage('Hey, You are selling something else!');
      }
      idlons += sellResult.idlonsGained;
      nextAction();
    }
    if (messageChecker.buy.isBought({author, message: collected})) {
      const buyResult = messageReaders.buy(collected);
      if (buyResult.boughtItem === materialName) {
        materialAmount += buyResult.boughtAmount;
      } else {
        return sendMessage('Hey, You are buying something else!');
      }
      idlons -= buyResult.idlonsSpent;
      nextAction();
    }
  });
  event.on('embed', async (embed, collected) => {
    if (messageChecker.profile.isProfile({embed, author})) {
      if (idlons !== undefined) return;
      const profileInfo = messageReaders.profile({embed});
      idlons = profileInfo.idlons;
      nextAction();
    }
    if (messageChecker.inventory.isInventory({embed, author})) {
      readInventory(collected);
      trackWorkerToken(collected);
    }
  });
  event.on('end', () => {
    event = undefined;
  });
  event.on('author', (content) => {
    if (content.toLowerCase().trim() === 'stop') {
      endPacking({
        client,
        channelId: message.channel.id
      });
      event?.stop();
    }
  });

  nextAction();

  async function nextAction() {
    if (!targetIdlons || !materialName || !userAccount) return;
    if (idlons === undefined) {
      return sendMessage(`Type \`${PREFIX.idleFarm}profile\``);
    }
    if (workerTokens === undefined) {
      return sendMessage(
        `Type \`${PREFIX.idleFarm}inv\` to show worker tokens`
      );
    }
    if (idlons >= targetIdlons) {
      event?.stop();
      event = undefined;
      return sendMessage(`You have got **${idlons.toLocaleString()}** idlons`);
    }
    if (workerTokens <= 0 && boxAmount <= 0 && materialAmount < 100) {
      event?.stop();
      event = undefined;
      return sendMessage('You have no more worker tokens');
    }
    event?.resetTimer(ms('1m'));
    await sendNextCommand({
      materialPrice,
      currentIdlons: idlons,
      targetIdlons,
      currentWorkerTokens: workerTokens,
      materialName,
      client,
      channelId: message.channel.id,
      materialAmount,
      boxAmount,
      multiplier,
      boxPrice,
      donorTier: userAccount.config.donorTier,
      profitsPerToken: calculatePackingProfits({
        boxPrice,
        multiplier,
        itemPrice: materialPrice,
        taxValue: TAX_RATE_BOX[userAccount.config.donorTier]
      })
    });
  }

  async function trackWorkerToken(inventoryMsg: Message) {
    const event = await createMessageEditedListener({
      messageId: inventoryMsg.id
    });
    if (!event) return;
    event.on(inventoryMsg.id, (collected) => {
      readInventory(collected);
    });
  }

  function readInventory(inventoryMsg: Message) {
    const inventoryInfo = messageReaders.inventory({
      embed: inventoryMsg.embeds[0]
    });

    const isChanged = {
      workerTokens: false,
      material: false,
      box: false
    };
    if (materialName && inventoryInfo[materialName] !== undefined && materialAmount === 0) {
      materialAmount = inventoryInfo[materialName] ?? 0;
      isChanged.material = true;
    }

    if (
      inventoryInfo.workerTokens !== undefined &&
      workerTokens === undefined
    ) {
      workerTokens = inventoryInfo.workerTokens;
      isChanged.workerTokens = true;
    }

    if (materialBoxType && inventoryInfo[materialBoxType] !== undefined && boxAmount === 0) {
      boxAmount = inventoryInfo[materialBoxType] ?? 0;
      isChanged.box = true;
    }

    if (isChanged.workerTokens || (workerTokens !== undefined && (isChanged.material || isChanged.box))) {
      nextAction();
    }
  }
};

interface ISendCommandEmbed {
  message: string;
  channelId: string;
  client: Client;
}

const sendCommandEmbed = async ({
  message,
  client,
  channelId
}: ISendCommandEmbed) => {
  const embed = new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setDescription(message);

  await djsMessageHelper.send({
    options: {
      embeds: [embed]
    },
    channelId,
    client
  });
};

interface ISendNextCommand {
  materialName: keyof typeof IDLE_FARM_ITEMS_MATERIAL;
  materialPrice: number;
  currentIdlons: number;
  targetIdlons: number;
  currentWorkerTokens: number;
  client: Client;
  channelId: string;
  materialAmount: number;
  boxAmount: number;
  boxPrice: number;
  profitsPerToken: number;
  multiplier: number;
  donorTier: ValuesOf<typeof IDLE_FARM_DONOR_TIER>;
}

async function sendNextCommand({
  client,
  channelId,
  materialPrice,
  currentIdlons,
  targetIdlons,
  currentWorkerTokens,
  materialName,
  materialAmount,
  boxAmount,
  boxPrice,
  profitsPerToken,
  multiplier,
  donorTier
}: ISendNextCommand) {
  let title: string;
  let nextCommand: string;
  let newIdlons = currentIdlons;
  let newWorkerTokens = currentWorkerTokens;
  let newMaterialAmount = materialAmount;
  let newBoxAmount = boxAmount;

  if (boxAmount) {

    // sell boxes

    title = `Sell ${boxAmount.toLocaleString()} ${
      IDLE_FARM_ITEMS_BOX[IDLE_FARM_ITEMS_BOX_TYPE[materialName]]
    }`;
    nextCommand = `${PREFIX.idleFarm}sell ${
      IDLE_FARM_ITEMS_BOX[IDLE_FARM_ITEMS_BOX_TYPE[materialName]]
    } ${boxAmount}`;

    newIdlons += boxAmount * boxPrice * TAX_RATE_BOX[donorTier];
    newBoxAmount = 0;
  } else if (materialAmount >= 100) {

    // pack materials
    const materialsToPax = Math.floor(materialAmount / 100);

    const availablePackingAmount = Math.min(
      materialsToPax,
      currentWorkerTokens
    );

    title = `Pack ${availablePackingAmount.toLocaleString()} ${
      IDLE_FARM_ITEMS_MATERIAL[materialName]
    }`;
    nextCommand = `${PREFIX.idleFarm}packing ${IDLE_FARM_ITEMS_MATERIAL[materialName]} ${availablePackingAmount}`;

    newBoxAmount += availablePackingAmount * multiplier;
    newBoxAmount = Math.floor(newBoxAmount);
    newMaterialAmount -= availablePackingAmount * 100;
    newWorkerTokens -= availablePackingAmount;
  } else {

    // buy materials
    const idlonsLeftToTarget = targetIdlons - currentIdlons;

    const tokensNeeded = Math.ceil(idlonsLeftToTarget / profitsPerToken) + 10; // add 10 more tokens for safety

    const maxBuyAbleMaterial = Math.floor(currentIdlons / materialPrice);
    const tokensNeedToPackAllMaterial = Math.floor(maxBuyAbleMaterial / 100);

    const finalTokenToUse = Math.min(
      tokensNeeded,
      tokensNeedToPackAllMaterial,
      currentWorkerTokens
    );

    const materialsToBuy = finalTokenToUse * 100;

    newIdlons -= materialsToBuy * materialPrice;
    newMaterialAmount += materialsToBuy;

    title = `Buy ${materialsToBuy.toLocaleString()} ${
      IDLE_FARM_ITEMS_MATERIAL[materialName]
    }`;
    nextCommand = `${PREFIX.idleFarm}buy ${IDLE_FARM_ITEMS_MATERIAL[materialName]} ${materialsToBuy}`;
  }

  const embed = new EmbedBuilder().setColor(BOT_COLOR.embed);

  embed.setTitle(title).setDescription(`\`${nextCommand}\``);

  const isIdlonChanged = currentIdlons !== newIdlons;
  const isWorkerTokenChanged = currentWorkerTokens !== newWorkerTokens;
  const isMaterialAmountChanged = materialAmount !== newMaterialAmount;
  const isBoxAmountChanged = boxAmount !== newBoxAmount;

  let idlonsText = `${
    BOT_EMOJI.other.idlon
  } **Idlons:** ${currentIdlons.toLocaleString()}`;
  if (isIdlonChanged) idlonsText += ` -> ${newIdlons.toLocaleString()}`;

  let workerTokensText = `${
    BOT_EMOJI.items.workerTokens
  } **Worker tokens:** ${currentWorkerTokens.toLocaleString()}`;
  if (isWorkerTokenChanged)
    workerTokensText += ` -> ${newWorkerTokens.toLocaleString()}`;

  let materialAmountText = `${BOT_EMOJI.items[materialName]} **${
    IDLE_FARM_ITEMS_MATERIAL[materialName]
  }:** ${materialAmount.toLocaleString()}`;
  if (isMaterialAmountChanged)
    materialAmountText += ` -> ${newMaterialAmount.toLocaleString()}`;

  let boxAmountText = `${
    BOT_EMOJI.items[IDLE_FARM_ITEMS_BOX_TYPE[materialName]]
  } **${
    IDLE_FARM_ITEMS_BOX[IDLE_FARM_ITEMS_BOX_TYPE[materialName]]
  }:** ${boxAmount.toLocaleString()}`;
  if (isBoxAmountChanged)
    boxAmountText += ` -> ${newBoxAmount.toLocaleString()}`;

  const summaries = [
    `🎲 **Multiplier:** x${multiplier.toLocaleString()}`,
    idlonsText,
    workerTokensText,
    materialAmountText,
    boxAmountText
  ];

  embed.addFields([
    {
      name: 'Summary',
      value: summaries.join('\n')
    }
  ]);

  embed.setFooter({
    text: `Target Idlons: ${currentIdlons.toLocaleString()} / ${targetIdlons.toLocaleString()}`
  });

  embed.addFields({
    name: '\u200b',
    value: 'Type `stop` to stop packing'
  });

  await djsMessageHelper.send({
    client,
    channelId,
    options: {
      embeds: [embed]
    }
  });
}

interface IEndPacking {
  client: Client;
  channelId: string;
}

export const endPacking = async ({client, channelId}: IEndPacking) => {
  const embed = new EmbedBuilder()
    .setColor(BOT_COLOR.embed)
    .setDescription('Packing helper stopped');

  await djsMessageHelper.send({
    options: {
      embeds: [embed]
    },
    channelId,
    client
  });
};
