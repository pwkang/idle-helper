import {ClusterClient, getInfo} from 'discord-hybrid-sharding';
import {Client, Collection, IntentsBitField, Options} from 'discord.js';

import * as dotenv from 'dotenv';
import loadCommands from './handler/on-start/commands.handler';
import loadBotEvents from './handler/on-start/bot-events.handler';
import loadCronJob from './handler/on-start/cron.handler';
import {logger} from '@idle-helper/utils';
import {loadRedis} from './handler/on-start/redis.handler';
import {initSentry} from './handler/on-start/sentry.handler';

dotenv.config();
const environment = process.env.NODE_ENV || 'development';

const shards = environment === 'development' ? 'auto' : getInfo().SHARD_LIST;
const shardCount = environment === 'development' ? 1 : getInfo().TOTAL_SHARDS;

const client = new Client({
  intents: new IntentsBitField().add([
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ]),
  shardCount,
  shards,
  sweepers: {
    messages: {
      lifetime: 1800,
      interval: 900,
    },
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
  }),
});

client.prefixCommands = new Collection();
client.slashCommands = new Collection();
client.slashMessages = new Collection();
client.botMessages = new Collection();

if (environment === 'production') {
  client.cluster = new ClusterClient(client); // initialize the Client, so we access the .broadcastEval()
  initSentry();
}

Promise.all([loadCommands(client), loadBotEvents(client), loadRedis(), loadCronJob(client)]).then(
  async () => {
    logger({
      message: 'All handlers loaded, connecting to Discord...',
      clusterId: client.cluster?.id,
    });
    client.login(process.env.BOT_TOKEN).catch((error) => {
      logger({
        message: error.message,
        clusterId: client.cluster?.id,
        logLevel: 'error',
      });
    });
  },
);
