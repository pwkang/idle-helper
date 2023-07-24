import {serverService} from '../../../../services/database/server.service';
import {djsMessageHelper} from '../../../../lib/discordjs/message';
import {IDLE_FARM_ID} from '@idle-helper/constants';

export default <BotMessage>{
  name: 'random-events-packing',
  bot: IDLE_FARM_ID,
  match: (message) => {
    const embed = message.embeds[0];
    if (!embed) return false;
    return embed.fields[0]?.name.includes('need some packing');
  },
  execute: async (client, message) => {
    const serverProfile = await serverService.getServer({
      serverId: message.guild!.id,
    });
    if (!serverProfile) return;
    const randomEvent = serverProfile.settings.randomEvent;
    if (!randomEvent.packing) return;
    await djsMessageHelper.send({
      client,
      options: {
        content: randomEvent.packing,
      },
      channelId: message.channel.id,
    });
  },
};

