import {IDLE_FARM_RANDOM_EVENTS} from '@idle-helper/constants';


export interface IServer {
  serverId: string;
  name: string;
  settings: {
    admin: {
      rolesId: string[];
      usersId: string[];
    };
    randomEvent: Record<keyof typeof IDLE_FARM_RANDOM_EVENTS, string>;
  };
}
