import type {Client} from 'discord.js';
import {handlerFileFilter, handlerRoot} from './constant';
import {importFiles, logger} from '@idle-helper/utils';

export default async function loadBotEvents(client: Client) {
  const commands = await importFiles<BotEvent>({
    path: `./${handlerRoot}/events`,
    options: {
      fileFilter: [handlerFileFilter]
    }
  });
  logger({
    message: `Loaded (${commands.length}) bot events`,
    clusterId: client.cluster?.id
  });
  commands.forEach(({data}) => {
    if (!data?.eventName) return;
    if (data.once) {
      client.once(data.eventName, (...args) => data.execute(client, ...args));
    } else {
      client.on(data.eventName, (...args) => data.execute(client, ...args));
    }
  });
}
