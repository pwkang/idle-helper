import {BaseMessageOptions} from 'discord.js';

export const _help = () => {

  function render(): BaseMessageOptions {

    return {
      content: 'help',
    };
  }

  return {
    render,
  };
};