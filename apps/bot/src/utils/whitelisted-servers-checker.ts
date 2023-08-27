export default function isServerWhitelisted(serverId: string) {
  const whitelistedServers = process.env.WHITELIST_SERVERS;
  if (!whitelistedServers) return true;
  const whitelistedServersArray = whitelistedServers.split(',');
  return whitelistedServersArray.includes(serverId);
}
