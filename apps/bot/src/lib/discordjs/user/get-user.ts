import {logger} from '@idle-helper/utils';
import {User} from 'discord.js';

interface IGetUser {
  userId: string;
  client: any;
}

export const _getUser = async ({userId, client}: IGetUser): Promise<User | null> => {
  const user = client.users.cache.get(userId);
  if (!user) {
    try {
      return await client.users.fetch(userId);
    } catch (e) {
      logger({
        clusterId: client.cluster?.id,
        logLevel: 'error',
        message: `Failed to fetch user ${userId}`,
      });
      return null;
    }
  }
  return user;
};
