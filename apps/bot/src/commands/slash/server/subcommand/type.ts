import {ChatInputCommandInteraction, Client} from 'discord.js';

export interface IServerConfig {
  client: Client;
  interaction: ChatInputCommandInteraction;
}
