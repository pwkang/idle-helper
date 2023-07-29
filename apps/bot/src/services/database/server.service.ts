import {mongoClient} from '@idle-helper/services';
import {IServer, serverSchema} from '@idle-helper/models';
import {IDLE_FARM_RANDOM_EVENTS} from '@idle-helper/constants';
import {UpdateQuery} from 'mongoose';
import {typedObjectEntries} from '@idle-helper/utils';

const dbServer = mongoClient.model('servers', serverSchema);

interface IRegisterServerProps {
  serverId: string;
  name: string;
}

const registerServer = async ({serverId, name}: IRegisterServerProps): Promise<IServer> => {
  const server = await dbServer.findOne({serverId});

  if (!server) {
    const newServer = new dbServer({
      serverId,
      name,
    });

    await newServer.save();
    return newServer;
  }
  return server;
};

interface IGetServerProps {
  serverId: string;
}

const getServer = async ({serverId}: IGetServerProps): Promise<IServer | null> => {
  const server = await dbServer.findOne({serverId});

  return server ?? null;
};

const listRegisteredServersId = async (): Promise<string[]> => {
  const servers = await dbServer.find(
    {},
    {
      serverId: 1,
    },
  );
  return servers?.map((server) => server.serverId) ?? [];
};

const findServerById = async (serverId: string): Promise<IServer | null> => {
  const server = await dbServer.findOne({serverId});

  if (!server) {
    return null;
  }
  return server;
};


interface IUpdateRandomEvents {
  serverId: string;
  randomEvents: Partial<Record<ValuesOf<typeof IDLE_FARM_RANDOM_EVENTS>, string | null>>;
}

const updateRandomEvents = async (
  {
    serverId,
    randomEvents,
  }: IUpdateRandomEvents): Promise<IServer | null> => {
  const query: UpdateQuery<IServer> = {
    $set: {},
    $unset: {},
  };
  for (const [key, value] of typedObjectEntries(randomEvents)) {
    if (value === null) {
      query.$unset![`settings.randomEvent.${key}`] = '';
    } else {
      query.$set![`settings.randomEvent.${key}`] = value;
    }
  }
  return dbServer.findOneAndUpdate({serverId}, query, {new: true});
};

export const serverService = {
  registerServer,
  getServer,
  listRegisteredServersId,
  findServerById,
  updateRandomEvents,
};
