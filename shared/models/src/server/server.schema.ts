import {Schema} from 'mongoose';
import {IServer} from './server.type';

export const serverSchema = new Schema<IServer>({
  serverId: {type: String, required: true},
  name: {type: String, required: true},
  settings: {
    admin: {
      usersId: [{type: String}],
      rolesId: [{type: String}],
    },
    randomEvent: {
      worker: {type: String},
      packing: {type: String},
      energy: {type: String},
      lucky: {type: String},
    },
  },
});
