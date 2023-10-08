interface IMessageUrl {
  serverId: string;
  channelId: string;
}

export const _channelUrl = ({serverId, channelId}: IMessageUrl) =>
  `https://discord.com/channels/${serverId}/${channelId}`;

export const _getInfoFromChannelUrl = (messageUrl: string) => {
  const isValid = messageUrl.match(/discord.com\/channels\/(\d+)\/(\d+)/);
  if (!isValid) return null;
  const [, serverId, channelId] = isValid;
  return {
    serverId,
    channelId
  };
};
