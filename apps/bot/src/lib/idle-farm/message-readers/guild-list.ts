import type {Embed} from 'discord.js';

interface IGuildListReader {
  embed: Embed;
}

export const _guildListReader = ({embed}: IGuildListReader) => {
  const guildName =
    embed.fields[0].name.match(/^\*\*(.*)\*\* members$/)?.[1] ?? '';
  const userList = embed.fields.flatMap((field) =>
    field.value.split('\n').map((user) => user.trim())
  );

  const usernames = userList
    .filter((user) => !user.startsWith('ID:'))
    .map((user) => user.match(/^\*\*(.*)\*\*$/)?.[1] ?? '');
  const ids = userList
    .filter((user) => user.startsWith('ID:'))
    .map((user) => user.match(/^ID: \*\*(\d+)\*\*$/)?.[1] ?? '');
  return {
    guildName,
    usernames,
    ids
  };
};
