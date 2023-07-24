import {IUser} from '@idle-helper/models';
import {redisService} from './redis.service';

const userRubyPrefix = 'epic-helper:user-ruby:';

interface IRedisUserRubyAmount {
  userId: string;
  ruby: number;
}

const setRuby = async (userId: string, ruby: number) => {
  const data: IRedisUserRubyAmount = {
    userId,
    ruby,
  };
  await redisService.set(`${userRubyPrefix}:${userId}`, JSON.stringify(data));
};

const getRuby = async (userId: string, cb: () => Promise<IUser>) => {
  const data = await redisService.get(`${userRubyPrefix}:${userId}`);
  if (!data) {
    const user = await cb();
    // TODO: check if user exists
    await setRuby(userId, user?.items.ruby ?? 0);
    return user.items.ruby;
  }
  const {ruby} = JSON.parse(data) as IRedisUserRubyAmount;
  return ruby;
};

const redisUserAccount = {
  setRuby,
  getRuby,
};

export default redisUserAccount;
