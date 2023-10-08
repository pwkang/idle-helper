import type {ClientOptions, Message} from 'discord.js';
import { IntentsBitField, Options} from 'discord.js';
import {IDLE_FARM_ID} from '@idle-helper/constants';
import ms from 'ms';

const messageFilter = (message: Message) =>
  !isSentByIdleFarm(message) || hasPassedMinutes(message, 15);

const isSentByIdleFarm = (message: Message) =>
  message.author.id === IDLE_FARM_ID;

const hasPassedMinutes = (message: Message, minutes: number) =>
  message.createdAt.getTime() < Date.now() - ms(`${minutes}m`);

export const DiscordClientConfig: ClientOptions = {
  intents: new IntentsBitField().add([
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent
  ]),
  sweepers: {
    messages: {
      interval: 450,
      filter: () => messageFilter
    }
  },
  makeCache: Options.cacheWithLimits({
    BaseGuildEmojiManager: 0,
    GuildBanManager: 0,
    GuildEmojiManager: 0,
    GuildStickerManager: 0,
    GuildInviteManager: 0,
    GuildTextThreadManager: 0,
    ReactionManager: 0,
    ApplicationCommandManager: 0,
    AutoModerationRuleManager: 0,
    GuildForumThreadManager: 0,
    GuildScheduledEventManager: 0,
    PresenceManager: 0,
    ReactionUserManager: 0,
    StageInstanceManager: 0,
    ThreadManager: 0,
    ThreadMemberManager: 0,
    VoiceStateManager: 0,
    MessageManager: 25
  })
};
