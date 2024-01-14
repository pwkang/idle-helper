import type {IHelpCommand} from './help-commands.transformer';
import {toHelpCommand} from './help-commands.transformer';
import type {EntryCollection} from 'contentful';
import type {BotHelpGroupSkeleton} from '../contentful/bot-help.contentful';

export interface IHelpCommandsGroup {
  name?: string;
  fieldLabel?: string;
  commands?: IHelpCommand[];
  order?: number;
  type?: 'commands' | 'features';
}

export const toHelpCommandsGroup = (
  entries: EntryCollection<BotHelpGroupSkeleton, 'WITHOUT_UNRESOLVABLE_LINKS'>,
) => {
  const data: IHelpCommandsGroup[] = [];
  for (const item of entries.items) {
    const {commands, order, name, type, fieldLabel} = item.fields;
    data.push({
      type,
      commands: commands?.map((command) => toHelpCommand(command as never)),
      order,
      name,
      fieldLabel,
    });
  }
  return data;
};
