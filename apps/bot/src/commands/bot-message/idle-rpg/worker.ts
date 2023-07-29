import {IDLE_FARM_ID} from '@idle-helper/constants';
import embedReaders from '../../../lib/idle-farm/embed-readers';
import {infoService} from '../../../services/database/info.service';

export default <BotMessage>{
  name: 'idle-rpg-worker',
  bot: IDLE_FARM_ID,
  match: (message) => {
    return false; // disable this feature
    // const embed = message.embeds[0];
    // if (!embed) return false;
    // return embed.description?.includes('These are your workers') &&
    //   embed.author?.name?.includes('— workers');
  },
  execute: async (client, message) => {
    const embed = message.embeds[0];
    const workers = embedReaders.worker({embed});
    await updateWorkersPower(workers);
  },
};

const updateWorkersPower = async (userWorkers: ReturnType<typeof embedReaders.worker>) => {
  for (let worker of userWorkers) {
    await infoService.updateWorkerPower({
      worker: worker.type,
      power: worker.power,
      level: worker.level,
    });
  }
};