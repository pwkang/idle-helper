import {SLASH_COMMAND} from '../../constant';

export default <SlashCommand>{
  name: SLASH_COMMAND.guild.toggle.name,
  description: SLASH_COMMAND.guild.toggle.description,
  commandName: SLASH_COMMAND.guild.name,
  type: 'subcommandGroup'
};
