import {Collection} from 'discord.js';
import {ClusterClient} from 'discord-hybrid-sharding';

declare module 'discord.js' {
  export interface Client {
    cluster?: ClusterClient<Client>;
    prefixCommands: Collection<string, PrefixCommand>;
    slashCommands: Collection<string, SlashCommand>;
    slashMessages: Collection<string, SlashMessage>;
    botMessages: Collection<string, BotMessage>;
  }
}
