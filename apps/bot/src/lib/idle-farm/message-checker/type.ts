import {Embed, Message, User} from 'discord.js';

export interface IChecker {
  message: Message;
  author: User;
}

export interface IEmbedChecker {
  embed: Embed;
  author: User;
}