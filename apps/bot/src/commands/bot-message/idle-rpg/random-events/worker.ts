import {serverService} from '../../../../services/database/server.service';
import {djsMessageHelper} from '../../../../lib/discordjs/message';
import {IDLE_FARM_ID} from '@idle-helper/constants';

export default <BotMessage>{
  name: 'random-events-worker',
  bot: IDLE_FARM_ID,
  match: (message) => {
    const embed = message.embeds[0];
    if (!embed) return false;
    return embed.fields[0]?.name.includes('ANYONE LOOKING TO HIRE');
  },
  execute: async (client, message) => {
    const serverProfile = await serverService.getServer({
      serverId: message.guild!.id
    });
    if (!serverProfile) return;
    const randomEvent = serverProfile.settings.randomEvent;
    if (!randomEvent.worker) return;
    await djsMessageHelper.send({
      client,
      options: {
        content: randomEvent.worker
      },
      channelId: message.channel.id
    });
  }
};
