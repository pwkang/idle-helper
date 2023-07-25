import {ChatInputCommandInteraction, Client} from 'discord.js';

export interface IAccountSubcommand {
  client: Client;
  interaction: ChatInputCommandInteraction;
}
