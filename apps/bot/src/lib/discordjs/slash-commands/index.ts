import {_createGlobalSlashCommand} from './_create-global-slash-command';
import {_getGlobalSlashCommands} from './_get-global-slash-commands';
import {_deleteGlobalSlashCommand} from './_delete-global-slash-command';
import {_createGuildSlashCommand} from './_create-guild-slash-command';
import {_deleteGuildSlashCommand} from './_delete-guild-slash-command';
import {_getGuildSlashCommands} from './_get-guild-slash-commands';
import {_findGuildSlashCommand} from './_find-guild-slash-command';

const djsRestHelper = {
  slashCommand: {
    global: {
      createOne: _createGlobalSlashCommand,
      getAll: _getGlobalSlashCommands,
      deleteOne: _deleteGlobalSlashCommand,
    },
    guild: {
      createOne: _createGuildSlashCommand,
      deleteOne: _deleteGuildSlashCommand,
      getAll: _getGuildSlashCommands,
      findOne: _findGuildSlashCommand,
    },
  },
};

export default djsRestHelper;
