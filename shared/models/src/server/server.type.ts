import {IDLE_FARM_COMMAND_TYPE, IDLE_FARM_RANDOM_EVENTS} from '@idle-helper/constants';

export interface IEnchantChannel {
  channelId: string;
  muteDuration?: number;
}

export interface ITTVerificationRules {
  roleId: string;
  minTT: number;
  maxTT?: number;
  message?: string;
}

export interface IToken {
  userId: string;
  amount: number;
}

export interface IServer {
  serverId: string;
  name: string;
  settings: {
    admin: {
      rolesId: string[];
      usersId: string[];
    };
    randomEvent: Record<keyof typeof IDLE_FARM_RANDOM_EVENTS, string>;
    enchant: {
      muteDuration: number;
      channels: IEnchantChannel[];
    };
    ttVerification: {
      channelId: string;
      rules: ITTVerificationRules[];
    };
  };
  tokens: IToken[];
}
