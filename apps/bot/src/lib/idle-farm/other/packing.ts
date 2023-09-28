import {Client, Message, User} from 'discord.js';

interface IIdlePacking {
  client: Client;
  author: User;
  message: Message;
  isSlashCommand?: boolean;
}

export const idlePacking = ({message, client, isSlashCommand, author}: IIdlePacking) => {
  
};