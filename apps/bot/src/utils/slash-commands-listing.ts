import {handlerRoot} from '../handler/on-start/constant';
import {SlashCommandBuilder} from 'discord.js';
import {importFiles} from '@idle-helper/utils';

interface ISlashCommand {
  name: string;
  builder: SlashCommandBuilder;
}

export const listSlashCommands = async (): Promise<ISlashCommand[]> => {
  const slashCommands: ISlashCommand[] = [];
  const commands = await importFiles<SlashCommand>({
    options: {fileFilter: '*.ts'},
    path: `./${handlerRoot}/commands/slash`,
  });
  commands.forEach(({data}) => {
    if (!data?.builder) return;
    slashCommands.push({
      name: data.name,
      builder: data.builder,
    });
  });
  return slashCommands;

  // return new Promise((resolve) => {
  //   readdirp(`./${handlerRoot}/commands/slash`, {fileFilter: '*.ts'})
  //     .on('data', async (entry) => {
  //       const {fullPath} = entry;
  //       const file = await import(fullPath);
  //       const command = file.default.default as SlashCommand;
  //       if (!command?.builder) return;
  //       slashCommands.push({
  //         name: command.name,
  //         builder: command.builder,
  //       });
  //     })
  //     .on('end', () => {
  //       resolve(slashCommands);
  //     });
  // });
};
