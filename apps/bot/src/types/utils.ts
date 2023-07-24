import {Embed, Message, User} from 'discord.js';

export interface IMessageContentChecker {
  message: Message;
  author: User;
}

export interface IMessageEmbedChecker {
  embed: Embed;
  author: User;
}
