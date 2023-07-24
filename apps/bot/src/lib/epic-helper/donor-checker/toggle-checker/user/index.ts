import {userService} from '../../../../../services/database/user.service';
import donorChecker from '../../index';
import {
  _toggleCountdown,
  _toggleDmReminder,
  _toggleEmoji,
  _toggleHeal,
  _toggleHuntSwitch,
  _toggleMentions,
  _togglePetCatch,
  _toggleQuest,
  _toggleReminder,
  _toggleSlash,
  _toggleTraining,
} from './toggle-user-checker-list';
import {RPG_COMMAND_TYPE} from '@idle-helper/constants';

interface IToggleUserChecker {
  userId: string;
}

export type IToggleUserCheckerReturnType = Awaited<ReturnType<typeof toggleUserChecker>>;

const toggleUserChecker = async ({userId}: IToggleUserChecker) => {
  const userToggle = await userService.getUserToggle(userId);
  const isDonor = await donorChecker.isDonor({
    userId,
  });
  if (!userToggle) return null;

  return {
    dm: {
      daily: _toggleDmReminder({toggle: userToggle, isDonor, type: RPG_COMMAND_TYPE.daily}),
      weekly: _toggleDmReminder({toggle: userToggle, isDonor, type: RPG_COMMAND_TYPE.weekly}),
      lootbox: _toggleDmReminder({toggle: userToggle, isDonor, type: RPG_COMMAND_TYPE.lootbox}),
      vote: _toggleDmReminder({toggle: userToggle, isDonor, type: RPG_COMMAND_TYPE.vote}),
      hunt: _toggleDmReminder({toggle: userToggle, isDonor, type: RPG_COMMAND_TYPE.hunt}),
      adventure: _toggleDmReminder({
        toggle: userToggle,
        isDonor,
        type: RPG_COMMAND_TYPE.adventure,
      }),
      training: _toggleDmReminder({toggle: userToggle, isDonor, type: RPG_COMMAND_TYPE.training}),
      duel: _toggleDmReminder({toggle: userToggle, isDonor, type: RPG_COMMAND_TYPE.duel}),
      quest: _toggleDmReminder({toggle: userToggle, isDonor, type: RPG_COMMAND_TYPE.quest}),
      working: _toggleDmReminder({toggle: userToggle, isDonor, type: RPG_COMMAND_TYPE.working}),
      farm: _toggleDmReminder({toggle: userToggle, isDonor, type: RPG_COMMAND_TYPE.farm}),
      horse: _toggleDmReminder({toggle: userToggle, isDonor, type: RPG_COMMAND_TYPE.horse}),
      arena: _toggleDmReminder({toggle: userToggle, isDonor, type: RPG_COMMAND_TYPE.arena}),
      dungeon: _toggleDmReminder({toggle: userToggle, isDonor, type: RPG_COMMAND_TYPE.dungeon}),
      epicItem: _toggleDmReminder({toggle: userToggle, isDonor, type: RPG_COMMAND_TYPE.epicItem}),
      pet: _toggleDmReminder({toggle: userToggle, isDonor, type: RPG_COMMAND_TYPE.pet}),
    },
    reminder: {
      daily: _toggleReminder({toggle: userToggle, isDonor, type: RPG_COMMAND_TYPE.daily}),
      weekly: _toggleReminder({toggle: userToggle, isDonor, type: RPG_COMMAND_TYPE.weekly}),
      lootbox: _toggleReminder({
        toggle: userToggle,
        isDonor,
        type: RPG_COMMAND_TYPE.lootbox,
      }),
      vote: _toggleReminder({toggle: userToggle, isDonor, type: RPG_COMMAND_TYPE.vote}),
      hunt: _toggleReminder({toggle: userToggle, isDonor, type: RPG_COMMAND_TYPE.hunt}),
      adventure: _toggleReminder({
        toggle: userToggle,
        isDonor,
        type: RPG_COMMAND_TYPE.adventure,
      }),
      training: _toggleReminder({
        toggle: userToggle,
        isDonor,
        type: RPG_COMMAND_TYPE.training,
      }),
      duel: _toggleReminder({toggle: userToggle, isDonor, type: RPG_COMMAND_TYPE.duel}),
      quest: _toggleReminder({toggle: userToggle, isDonor, type: RPG_COMMAND_TYPE.quest}),
      working: _toggleReminder({
        toggle: userToggle,
        isDonor,
        type: RPG_COMMAND_TYPE.working,
      }),
      farm: _toggleReminder({toggle: userToggle, isDonor, type: RPG_COMMAND_TYPE.farm}),
      horse: _toggleReminder({toggle: userToggle, isDonor, type: RPG_COMMAND_TYPE.horse}),
      arena: _toggleReminder({toggle: userToggle, isDonor, type: RPG_COMMAND_TYPE.arena}),
      dungeon: _toggleReminder({
        toggle: userToggle,
        isDonor,
        type: RPG_COMMAND_TYPE.dungeon,
      }),
      epicItem: _toggleReminder({
        toggle: userToggle,
        isDonor,
        type: RPG_COMMAND_TYPE.epicItem,
      }),
      pet: _toggleReminder({toggle: userToggle, isDonor, type: RPG_COMMAND_TYPE.pet}),
    },
    mentions: {
      daily: _toggleMentions({toggle: userToggle, isDonor, type: RPG_COMMAND_TYPE.daily}),
      weekly: _toggleMentions({toggle: userToggle, isDonor, type: RPG_COMMAND_TYPE.weekly}),
      lootbox: _toggleMentions({
        toggle: userToggle,
        isDonor,
        type: RPG_COMMAND_TYPE.lootbox,
      }),
      vote: _toggleMentions({toggle: userToggle, isDonor, type: RPG_COMMAND_TYPE.vote}),
      hunt: _toggleMentions({toggle: userToggle, isDonor, type: RPG_COMMAND_TYPE.hunt}),
      adventure: _toggleMentions({
        toggle: userToggle,
        isDonor,
        type: RPG_COMMAND_TYPE.adventure,
      }),
      training: _toggleMentions({
        toggle: userToggle,
        isDonor,
        type: RPG_COMMAND_TYPE.training,
      }),
      duel: _toggleMentions({toggle: userToggle, isDonor, type: RPG_COMMAND_TYPE.duel}),
      quest: _toggleMentions({toggle: userToggle, isDonor, type: RPG_COMMAND_TYPE.quest}),
      working: _toggleMentions({
        toggle: userToggle,
        isDonor,
        type: RPG_COMMAND_TYPE.working,
      }),
      farm: _toggleMentions({toggle: userToggle, isDonor, type: RPG_COMMAND_TYPE.farm}),
      horse: _toggleMentions({toggle: userToggle, isDonor, type: RPG_COMMAND_TYPE.horse}),
      arena: _toggleMentions({toggle: userToggle, isDonor, type: RPG_COMMAND_TYPE.arena}),
      dungeon: _toggleMentions({
        toggle: userToggle,
        isDonor,
        type: RPG_COMMAND_TYPE.dungeon,
      }),
      epicItem: _toggleMentions({
        toggle: userToggle,
        isDonor,
        type: RPG_COMMAND_TYPE.epicItem,
      }),
      pet: _toggleMentions({toggle: userToggle, isDonor, type: RPG_COMMAND_TYPE.pet}),
      trainingAnswer: _toggleMentions({
        toggle: userToggle,
        isDonor,
        type: 'trainingAnswer',
      }),
      petCatch: _toggleMentions({
        toggle: userToggle,
        isDonor,
        type: 'petCatch',
      }),
    },

    trainingRuby: _toggleTraining({toggle: userToggle, isDonor, type: 'ruby'}),
    trainingBasic: _toggleTraining({toggle: userToggle, isDonor, type: 'basic'}),

    huntSwitch: _toggleHuntSwitch({toggle: userToggle, isDonor}),
    petCatch: _togglePetCatch({toggle: userToggle, isDonor}),
    emoji: _toggleEmoji({toggle: userToggle, isDonor}),

    questArena: _toggleQuest({toggle: userToggle, isDonor, type: 'arena'}),
    questMiniboss: _toggleQuest({toggle: userToggle, isDonor, type: 'miniboss'}),

    heal: _toggleHeal({toggle: userToggle, isDonor}),
    slash: _toggleSlash({toggle: userToggle, isDonor}),

    countdown: _toggleCountdown({toggle: userToggle, isDonor}),
  };
};

export default toggleUserChecker;
