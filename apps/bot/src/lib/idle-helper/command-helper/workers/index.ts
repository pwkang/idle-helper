import {_listWorkers} from './list-workers';
import {_top3Workers} from './top-3';
import {_workerAssign} from './assign';

export const _workersHelper = {
  list: _listWorkers,
  top3: _top3Workers,
  assign: _workerAssign
};
