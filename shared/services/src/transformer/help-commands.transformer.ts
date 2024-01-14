import type {Entry, EntryCollection} from 'contentful';
import type {BotHelpSkeleton} from '../contentful/bot-help.contentful';

export interface IHelpCommand {
  name?: string;
  prefixCommands?: string[];
  description?: string;
  usage?: string;
  type?: 'feature' | 'command';
}

export const toHelpCommands = (
  entries: EntryCollection<
    BotHelpSkeleton,
    'WITHOUT_UNRESOLVABLE_LINKS',
    string
  >,
) => {
  const data: IHelpCommand[] = [];
  for (const item of entries.items) {
    const {prefixCommands, description, usage, name, type} = item.fields;
    data.push({
      name,
      prefixCommands,
      description,
      usage,
      type,
    });
  }
  return data;
};

export const toHelpCommand = (
  entry: Entry<BotHelpSkeleton, 'WITHOUT_UNRESOLVABLE_LINKS'>,
) => {
  const {prefixCommands, description, usage, name, type} = entry.fields;
  return {
    name,
    prefixCommands,
    description,
    usage,
    type,
  };
};
