interface IMessageUrl {
  serverId: string;
  channelId: string;
  messageId: string;
}

export const _messageUrl = ({messageId, serverId, channelId}: IMessageUrl) =>
  `https://discord.com/channels/${serverId}/${channelId}/${messageId}`;

export const _getInfoFromMessageUrl = (messageUrl: string) => {
  const isValid = messageUrl.match(
    /discord.com\/channels\/(\d+)\/(\d+)\/(\d+)/
  );
  if (!isValid) return null;
  const [, serverId, channelId, messageId] = isValid;
  return {
    serverId,
    channelId,
    messageId
  };
};
