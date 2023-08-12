import {IToggleEmbedsInfo} from './toggle.embed';
import {UpdateQuery} from 'mongoose';
import {getUserToggle} from './type/user.toggle';
import {getGuildToggle} from './type/guild.toggle';

export interface IGetUpdateQuery {
  on?: string;
  off?: string;
  toggleInfo: IToggleEmbedsInfo[];
}

const regexParent = /^([a-z])([0-9]+)$/;
const regexChild = /^([a-z])([0-9]+)([a-z])$/;
const regexRange = /^([a-z])([0-9]+)-([a-z])([0-9]+)$/;

const filterKeyword = (keyword: string): string[] =>
  keyword
    .toLowerCase()
    .split(' ')
    .filter((item) => regexParent.test(item) || regexChild.test(item) || regexRange);

export const getUpdateQuery = <T>({on, off, toggleInfo}: IGetUpdateQuery): UpdateQuery<T> => {
  const itemOn = on
    ? filterKeyword(on).flatMap((item) => getPathsFromKeyword(item, toggleInfo))
    : [];
  const itemOff = off
    ? filterKeyword(off).flatMap((item) => getPathsFromKeyword(item, toggleInfo))
    : [];
  const query: Record<string, boolean> = {};

  for (const item of itemOn) {
    if (!item) continue;
    query[item] = true;
  }

  for (const item of itemOff) {
    if (!item) continue;
    query[item] = false;
  }
  return {
    $set: query,
  };
};

const getPathsFromKeyword = (
  key: string,
  toggleInfo: IToggleEmbedsInfo[]
): string | string[] | null => {
  if (regexParent.test(key)) {
    const _key = key.match(regexParent);
    if (!_key) return null;
    return findPath({
      toggleInfo,
      groupIndex: parseGroupIndex(_key[1]),
      parentIndex: parseParentIndex(_key[2]),
    });
  } else if (regexChild.test(key)) {
    const _key = key.match(regexChild);
    if (!_key) return null;
    return findPath({
      toggleInfo,
      groupIndex: parseGroupIndex(_key[1]),
      parentIndex: parseParentIndex(_key[2]),
      childIndex: parseChildIndex(_key[3]),
    });
  } else if (regexRange.test(key)) {
    const _key = key.match(regexRange);
    if (!_key) return null;
    const fromGroupIndex = parseGroupIndex(_key[1]);
    const fromParentIndex = parseParentIndex(_key[2]);
    const toGroupIndex = parseGroupIndex(_key[3]);
    const toParentIndex = parseParentIndex(_key[4]);
    if (fromGroupIndex !== toGroupIndex) return null;
    const items = [];
    for (let i = fromParentIndex; i <= toParentIndex; i++) {
      const path = findPath({
        toggleInfo,
        groupIndex: fromGroupIndex,
        parentIndex: i,
      });
      if (path) items.push(path);
    }
    return items;
  }
  return null;
};

const parseGroupIndex = (key: string): number => key.charCodeAt(0) - 97;
const parseParentIndex = (key: string): number => parseInt(key) - 1;
const parseChildIndex = (key: string): number => key.charCodeAt(0) - 97;

interface IFindPath {
  toggleInfo: IToggleEmbedsInfo[];
  groupIndex: number;
  parentIndex: number;
  childIndex?: number;
}

const findPath = ({toggleInfo, groupIndex, parentIndex, childIndex}: IFindPath): string | null => {
  const parent = toggleInfo[groupIndex]?.children[parentIndex] ?? null;

  if (!parent) return null;

  if (childIndex !== undefined) {
    return parent.children?.[childIndex]?.path ?? null;
  }

  return parent.path;
};

export interface IUpdateToggle {
  on?: string;
  off?: string;
}

export const _toggleHelper = {
  user: getUserToggle,
  guild: getGuildToggle,
};
