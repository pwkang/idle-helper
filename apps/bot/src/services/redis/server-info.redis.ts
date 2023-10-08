import {redisService} from './redis.service';

interface IServerInfo {
  id: string;
  name: string;
}

const PREFIX = 'epic-helper:server-info:';

interface IGetServerInfo {
  serverId: string;
}

const getServerInfo = async ({serverId}: IGetServerInfo) => {
  const data = await redisService.get(getPrefix(serverId));
  return fromRedis(data);
};

interface ISetServerName {
  serverId: string;
  name: string;
}

const setServerName = async ({serverId, name}: ISetServerName) => {
  const data = await getServerInfo({serverId});
  data.name = name;
  data.id = serverId;
  await redisService.set(getPrefix(serverId), toRedis(data));
};

const toRedis = (data: IServerInfo) => {
  return JSON.stringify(data);
};

const fromRedis = (data: string | null): IServerInfo => {
  const parsed = data ? JSON.parse(data) : {};
  return {
    name: parsed.name,
    id: parsed.id
  };
};

const getPrefix = (serverId: string) => {
  return `${PREFIX}${serverId}`;
};

export const redisServerInfo = {
  getServerInfo,
  setServerName
};
