import {UpdateQuery} from 'mongoose';
import {guildSchema, IGuild} from '@idle-helper/models';
import {mongoClient} from '@idle-helper/services';
import {redisGuildReminder} from '../redis/guild-reminder.redis';
import {redisGuildMembers} from '../redis/guild-members.redis';
import {toGuild} from '../transformer/guild.transformer';

guildSchema.post('findOneAndUpdate', async (doc: IGuild) => {
  if (!doc) return;
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
  return dbGuild.findOne({serverId, roleId});
};

interface IFindFirstGuild {
  serverId: string;
}

const findFirstGuild = async ({serverId}: IFindFirstGuild) => {
  return dbGuild.findOne({serverId});
};

interface IGetAllGuilds {
  serverId: string;
}

const getAllGuilds = async ({serverId}: IGetAllGuilds) => {
  return dbGuild.find({serverId});
};

interface IUpdateGuildReminder {
  serverId: string;
  roleId: string;
  channelId?: string;
  reminderMessage?: string;
}

const updateGuildReminder = async ({
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
  });
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
  return dbGuild.findOneAndUpdate({serverId, roleId}, {$set: {leaderId}}, {new: true});
};

interface IGetAllGuildRoles {
  serverId: string;
}

const getAllGuildRoles = async ({serverId}: IGetAllGuildRoles) => {
  const guilds = await dbGuild.find({serverId}).select('roleId').lean();
  return guilds?.map((guild) => guild.roleId) ?? [];
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
  roleId: string;
  name?: string;
}

const updateGuildInfo = async ({serverId, roleId, name}: IUpdateGuildInfo) => {
  const query: UpdateQuery<IGuild> = {
    $set: {},
  };
  if (name !== undefined) query.$set!['info.name'] = name;
  if (Object.keys(query.$set!).length === 0) return Promise.resolve(null);
  return dbGuild.findOneAndUpdate({serverId, roleId}, query, {new: true});
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

interface IRegisterToGuild {
  serverId: string;
  roleId: string;
  userId: string;
}

const registerUserToGuild = async ({serverId, roleId, userId}: IRegisterToGuild) => {
  await dbGuild.findOneAndUpdate({serverId, roleId}, {$addToSet: {membersId: userId}}, {new: true});
  await dbGuild.findOneAndUpdate(
    {
      $or: [{serverId: {$ne: serverId}}, {roleId: {$ne: roleId}}],
      membersId: {$in: [userId]},
    },
    {$pull: {membersId: userId}},
    {new: true},
  );

  await redisGuildMembers.setGuildMember({
    guildRoleId: roleId,
    serverId,
    userId,
  });
};

interface IRemoveUserFromGuild {
  serverId: string;
  roleId: string;
  userId: string;
}

const removeUserFromGuild = async ({serverId, roleId, userId}: IRemoveUserFromGuild) => {
  await dbGuild.findOneAndUpdate({serverId, roleId}, {$pull: {membersId: userId}}, {new: true});

  await redisGuildMembers.removeGuildInfo({
    userId,
  });
};

interface IGetAllGuildMembers {
  serverId: string;
  roleId: string;
}

const getAllGuildMembers = async ({serverId, roleId}: IGetAllGuildMembers) => {
  const guild = await dbGuild.findOne({serverId, roleId});
  return guild?.membersId ?? [];
};

interface IFindUserGuild {
  userId: string;
}

const findUserGuild = async ({userId}: IFindUserGuild) => {
  const cachedGuild = await redisGuildMembers.getGuildInfo({
    userId,
  });
  if (!cachedGuild) {
    const guild = await dbGuild.findOne({membersId: userId}).lean();
    if (!guild) return null;

    await redisGuildMembers.setGuildMember({
      guildRoleId: guild.roleId,
      serverId: guild.serverId,
      userId,
    });
    return toGuild(guild);
  }
  const guild = await findGuild({
    serverId: cachedGuild.serverId,
    roleId: cachedGuild.guildRoleId,
  });
  return guild ? toGuild(guild) : null;
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
  registerUserToGuild,
  removeUserFromGuild,
  getAllGuildMembers,
  findUserGuild,
};
