import type {IInfo, TMarketItems} from './info.type';
import type { SchemaDefinition, SchemaDefinitionType} from 'mongoose';
import {Schema} from 'mongoose';
import {typedObjectEntries} from '@idle-helper/utils';
import {IDLE_FARM_ITEMS, IDLE_FARM_WORKER_TYPE} from '@idle-helper/constants';

export const infoSchema = new Schema<IInfo>({
  workerPower: {
    useless: {type: Schema.Types.Mixed},
    deficient: {type: Schema.Types.Mixed},
    common: {type: Schema.Types.Mixed},
    talented: {type: Schema.Types.Mixed},
    wise: {type: Schema.Types.Mixed},
    expert: {type: Schema.Types.Mixed},
    masterful: {type: Schema.Types.Mixed}
  },
  market: typedObjectEntries(IDLE_FARM_ITEMS).reduce((acc, [key]) => {
    acc[key] = {
      price: Number,
      isOverstocked: Boolean,
      lastUpdatedAt: Date
    };
    return acc;
  }, {} as SchemaDefinition<SchemaDefinitionType<TMarketItems>>),
  leaderboard: {
    ...typedObjectEntries(IDLE_FARM_WORKER_TYPE).reduce((acc, [key]) => {
      acc[key] = [{name: String, value: String}];
      return acc;
    }, {} as SchemaDefinition<SchemaDefinitionType<IInfo['leaderboard']>>)
  }
});
