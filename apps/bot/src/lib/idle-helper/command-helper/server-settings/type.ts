import {Guild} from 'discord.js';
import {IServer} from '@idle-helper/models';

export interface IServerSettings {
  serverAccount: IServer | null;
  guild: Guild;
}
