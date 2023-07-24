import {RPG_COMMAND_TYPE} from '@idle-helper/constants';
import {IUserToggle} from '@idle-helper/models';

interface IToggleUserCheckerItem {
  toggle: IUserToggle;
  isDonor: boolean;
}

interface IToggleDmReminder extends IToggleUserCheckerItem {
  type: ValuesOf<typeof RPG_COMMAND_TYPE>;
}

export const _toggleDmReminder = ({toggle, isDonor, type}: IToggleDmReminder) =>
  (isDonor && toggle.dm.all && toggle.dm[type]) || (!isDonor && toggle.dm.all);

interface IToggleReminder extends IToggleUserCheckerItem {
  type: ValuesOf<typeof RPG_COMMAND_TYPE>;
}

export const _toggleReminder = ({toggle, isDonor, type}: IToggleReminder) =>
  (isDonor && toggle.reminder.all && toggle.reminder[type]) || (!isDonor && toggle.reminder.all);

interface IToggleMentions extends IToggleUserCheckerItem {
  type: ValuesOf<typeof RPG_COMMAND_TYPE> | 'trainingAnswer' | 'petCatch';
}

export const _toggleMentions = ({toggle, isDonor, type}: IToggleMentions) =>
  (isDonor && toggle.mentions.all && toggle.mentions[type]) || (!isDonor && toggle.mentions.all);

interface IToggleTraining extends IToggleUserCheckerItem {
  type: 'ruby' | 'basic';
}

export const _toggleTraining = ({toggle, isDonor, type}: IToggleTraining) =>
  (isDonor && toggle.training.all && toggle.training[type]) || (!isDonor && toggle.training.all);

export const _toggleHuntSwitch = ({toggle}: IToggleUserCheckerItem) => toggle.huntSwitch;

export const _togglePetCatch = ({toggle}: IToggleUserCheckerItem) => toggle.petCatch;

export const _toggleEmoji = ({toggle}: IToggleUserCheckerItem) => toggle.emoji;

interface IToggleQuest extends IToggleUserCheckerItem {
  type: 'arena' | 'miniboss';
}

export const _toggleQuest = ({toggle, isDonor, type}: IToggleQuest) =>
  (isDonor && toggle.quest.all && toggle.quest[type]) || (!isDonor && toggle.quest.all);

export const _toggleHeal = ({toggle}: IToggleUserCheckerItem) => toggle.heal;

export const _toggleSlash = ({toggle}: IToggleUserCheckerItem) => toggle.slash;

export const _toggleCountdown = ({toggle}: IToggleUserCheckerItem) => toggle.countdown.all;
