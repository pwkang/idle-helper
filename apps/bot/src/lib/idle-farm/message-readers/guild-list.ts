import type {Embed, Guild} from 'discord.js';

interface IGuildListReader {
  embed: Embed;
  guild: Guild;
}

export const _guildListReader = ({embed, guild}: IGuildListReader) => {
  const guildName =
    embed.fields[0].name.match(/^\*\*(.*)\*\* members$/)?.[1] ?? '';
  const userList = embed.fields.flatMap((field) =>
    field.value.split('\n').map((user) => user.trim())
  );

  const usernames = userList
    .filter((user) => !user.startsWith('ID:'))
    .map((user) => user.match(/^\*\*(.*)\*\*/)?.[1] ?? '');
  const ids = userList
    .filter((user) => user.startsWith('ID:'))
    .map((user) => user.match(/^ID: \*\*(\d+)\*\*/)?.[1] ?? '');

  const members = guild.members.cache.filter((member) =>
    usernames.includes(member.user.username)
  ).map((member) => member.user.id);

  return {
    guildName,
    ids: [...ids, ...members]
  };
};
