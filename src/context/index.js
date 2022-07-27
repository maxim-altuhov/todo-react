const { createContext } = require('react');

const context = createContext({
  lists: null,
  activeList: null,
  isOpenMenu: false,
  isOpenPopup: false,
});

const { Provider, Consumer } = context;

export { Provider, Consumer };
