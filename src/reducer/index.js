const reducer = (state, action) => {
  switch (action.type) {
    case 'init':
      return {
        ...state,
        lists: action.payload,
        isOpenMenu: false,
        isOpenPopup: false,
        activeList: null,
      };
    case 'addList':
      return {
        ...state,
        lists: [...state.lists, action.payload],
        isOpenMenu: false,
        isOpenPopup: false,
        activeList: action.payload,
      };
    case 'toggleMenu':
      return {
        ...state,
        isOpenMenu: !state.isOpenMenu,
        isOpenPopup: state.isOpenPopup && false,
      };
    case 'togglePopup':
      return {
        ...state,
        isOpenMenu: true,
        isOpenPopup: !state.isOpenPopup,
      };
    case 'setActiveList':
      return {
        ...state,
        activeList: action.payload,
        isOpenMenu: false,
        isOpenPopup: false,
      };
    case 'removeList':
      return {
        ...state,
        lists: state.lists.filter((list) => list.id !== action.payload),
        activeList: null,
      };
    default:
      throw new Error();
  }
};

export default reducer;
