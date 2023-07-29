import {serverService} from '../../../../services/database/server.service';
import {djsMessageHelper} from '../../../../lib/discordjs/message';
import {IDLE_FARM_ID} from '@idle-helper/constants';

export default <BotMessage>{
  name: 'random-events-lucky',
  bot: IDLE_FARM_ID,
  match: (message) => {
    const embed = message.embeds[0];
    if (!embed) return false;
    return embed.fields[0]?.name.includes('Lucky reward!');
  },
  execute: async (client, message) => {
    const serverProfile = await serverService.getServer({
      serverId: message.guild!.id,
    });
    if (!serverProfile) return;
    const randomEvent = serverProfile.settings.randomEvent;
    if (!randomEvent.lucky) return;
    await djsMessageHelper.send({
      client,
      options: {
        content: randomEvent.lucky,
      },
      channelId: message.channel.id,
    });
  },
};

