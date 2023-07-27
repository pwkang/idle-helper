import {IInfo} from './info.type';
import {Schema} from 'mongoose';

export const infoSchema = new Schema<IInfo>({
  workerPower: {
    useless: {type: Schema.Types.Mixed},
    deficient: {type: Schema.Types.Mixed},
    common: {type: Schema.Types.Mixed},
    talented: {type: Schema.Types.Mixed},
    wise: {type: Schema.Types.Mixed},
    expert: {type: Schema.Types.Mixed},
    masterful: {type: Schema.Types.Mixed},
  },
});