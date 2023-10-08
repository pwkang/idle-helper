import {redisService} from './redis.service';

const prefix = 'idle-helper:guild-members:';

interface IRedisData {
  serverId: string;
  guildRoleId: string;
  userId: string;
}

interface ISetGuildMember {
  serverId: string;
  guildRoleId: string;
  userId: string;
}

const setGuildMember = async ({
  serverId,
  guildRoleId,
  userId
}: ISetGuildMember) => {
  await redisService.set(
    `${prefix}${userId}`,
    toRedis({serverId, guildRoleId, userId})
  );
};

interface IGetGuildInfo {
  userId: string;
}

const getGuildInfo = async ({
  userId
}: IGetGuildInfo): Promise<IRedisData | null> => {
  const data = await redisService.get(`${prefix}${userId}`);
  if (!data) return null;
  return fromRedis(data);
};

interface IRemoveGuildInfo {
  userId: string;
}

const removeGuildInfo = async ({userId}: IRemoveGuildInfo) => {
  await redisService.del(`${prefix}${userId}`);
};

const fromRedis = (data: any): IRedisData => {
  const parsed = JSON.parse(data);
  return {
    guildRoleId: parsed.guildRoleId,
    serverId: parsed.serverId,
    userId: parsed.userId
  };
};

interface IToRedis {
  serverId: string;
  guildRoleId: string;
  userId: string;
}

const toRedis = ({serverId, guildRoleId, userId}: IToRedis) => {
  return JSON.stringify({
    serverId,
    guildRoleId,
    userId
  });
};

export const redisGuildMembers = {
  setGuildMember,
  getGuildInfo,
  removeGuildInfo
};
