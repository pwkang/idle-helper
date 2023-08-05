import {UpdateQuery} from 'mongoose';
import {Client} from 'discord.js';
import {guildSchema, IGuild} from '@idle-helper/models';
import {mongoClient} from '@idle-helper/services';
import {redisGuildReminder} from '../redis/guild-reminder.redis';

guildSchema.post('findOneAndUpdate', async (doc: IGuild) => {
  if (doc.teamRaid.readyAt && doc.teamRaid.readyAt > new Date()) {
    await redisGuildReminder.setReminderTime({
      serverId: doc.serverId,
      readyAt: doc.teamRaid.readyAt,
      guildRoleId: doc.roleId,
    });
  } else {
    await redisGuildReminder.deleteReminderTime({
      serverId: doc.serverId,
      guildRoleId: doc.roleId,
    });
  }
});

const dbGuild = mongoClient.model('guilds', guildSchema);

interface IRegisterGuild {
  serverId: string;
  roleId: string;
  leaderId?: string;
}

const registerGuild = async ({serverId, roleId, leaderId}: IRegisterGuild): Promise<IGuild> => {
  return await dbGuild.create({
    serverId,
    roleId,
    leaderId,
  });
};

interface IIsRoleUsed {
  serverId: string;
  roleId: string;
}

const isRoleUsed = async ({serverId, roleId}: IIsRoleUsed): Promise<boolean> => {
  const guild = await dbGuild.findOne({serverId, roleId});
  return !!guild;
};

interface IFindGuild {
  serverId: string;
  roleId: string;
}

const findGuild = async ({serverId, roleId}: IFindGuild) => {
  return dbGuild.findOne({serverId, roleId}).lean();
};

interface IFindFirstGuild {
  serverId: string;
}

const findFirstGuild = async ({serverId}: IFindFirstGuild) => {
  return dbGuild.findOne({serverId}).lean();
};


interface IGetAllGuilds {
  serverId: string;
}

const getAllGuilds = async ({serverId}: IGetAllGuilds) => {
  return dbGuild.find({serverId}).lean();
};

interface IUpdateGuildReminder {
  serverId: string;
  roleId: string;
  channelId?: string;
  reminderMessage?: string;
}

const updateGuildReminder = async (
  {
    serverId,
    roleId,
    channelId,
    reminderMessage,
  }: IUpdateGuildReminder): Promise<IGuild | null> => {
  const updateQuery: UpdateQuery<IGuild> = {
    $set: {},
  };

  if (channelId) {
    updateQuery.$set!['teamRaid.channelId'] = channelId;
  }

  if (reminderMessage) {
    updateQuery.$set!['teamRaid.message'] = reminderMessage;
  }

  return dbGuild.findOneAndUpdate({serverId, roleId}, updateQuery, {
    new: true,
  }).lean();
};

interface ICalcTotalGuild {
  serverId: string;
}

const calcTotalGuild = async ({serverId}: ICalcTotalGuild) => {
  return dbGuild.countDocuments({serverId});
};

interface IDeleteGuild {
  serverId: string;
  roleId: string;
}

const deleteGuild = async ({serverId, roleId}: IDeleteGuild) => {
  return dbGuild.findOneAndDelete({serverId, roleId});
};

interface IUpdateLeader {
  serverId: string;
  roleId: string;
  leaderId: string;
}

const updateLeader = async ({serverId, roleId, leaderId}: IUpdateLeader) => {
  return dbGuild.findOneAndUpdate({serverId, roleId}, {$set: {leaderId}}, {new: true}).lean();
};

interface IGetAllGuildRoles {
  serverId: string;
}

const getAllGuildRoles = async ({serverId}: IGetAllGuildRoles) => {
  return dbGuild.find({serverId}).select('roleId');
};

interface IRegisterReminder {
  serverId: string;
  roleId: string;
  readyIn: number;
}

const registerReminder = async ({serverId, roleId, readyIn}: IRegisterReminder) => {
  const query: UpdateQuery<IGuild> = {};
  if (readyIn) {
    query.$set = {
      'teamRaid.readyAt': new Date(Date.now() + readyIn),
    };
  } else {
    query.$unset = {
      'teamRaid.readyAt': 1,
    };
  }

  return dbGuild.findOneAndUpdate({serverId, roleId}, query, {new: true});
};

interface IUpdateGuildInfo {
  serverId: string;
  name?: string;
}

const updateGuildInfo = async ({serverId, name}: IUpdateGuildInfo) => {
  const query: UpdateQuery<IGuild> = {
    $set: {},
  };
  if (name !== undefined) query.$set!['info.name'] = name;
  if (Object.keys(query.$set!).length === 0) return Promise.resolve(null);
  return dbGuild.findOneAndUpdate({serverId}, query, {new: true});
};

interface IUpdateToggle {
  serverId: string;
  roleId: string;
  query: UpdateQuery<IGuild>;
}

const updateToggle = async ({serverId, roleId, query}: IUpdateToggle): Promise<IGuild | null> => {
  const guild = await dbGuild.findOneAndUpdate(
    {
      serverId,
      roleId,
    },
    query,
    {
      new: true,
    },
  );
  return guild ?? null;
};

interface IResetToggle {
  serverId: string;
  roleId: string;
}

const resetToggle = async ({serverId, roleId}: IResetToggle): Promise<IGuild | null> => {
  const guild = await dbGuild.findOneAndUpdate(
    {
      serverId,
      roleId,
    },
    {
      $unset: {
        toggle: '',
      },
    },
    {
      new: true,
    },
  );
  return guild ?? null;
};

export const guildService = {
  registerGuild,
  isRoleUsed,
  findGuild,
  findFirstGuild,
  updateGuildReminder,
  calcTotalGuild,
  getAllGuilds,
  deleteGuild,
  updateLeader,
  getAllGuildRoles,
  registerReminder,
  updateGuildInfo,
  updateToggle,
  resetToggle,
};
