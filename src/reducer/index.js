const reducer = (state, action) => {
  switch (action.type) {
    case 'init':
      return {
        ...state,
        lists: action.payload,
        activeList: null,
        isOpenMenu: false,
        isOpenPopup: false,
      };
    case 'addList':
      return {
        ...state,
        lists: [...state.lists, action.payload],
        activeList: action.payload,
        isOpenMenu: false,
        isOpenPopup: false,
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
    case 'removeTask':
      const listsWithRemovedTask = state.lists.map((list) => {
        if (list.id === action.payload.id) {
          list.tasks = list.tasks.filter((task) => task.id !== action.payload.taskId);
        }

        return list;
      });

      return {
        ...state,
        lists: listsWithRemovedTask,
      };
    case 'addTask':
      const listsWithNewTask = state.lists.map((list) => {
        if (list.id === action.payload.data.listId) {
          list.tasks = [action.payload.data, ...list.tasks];
        }

        return list;
      });

      return {
        ...state,
        lists: listsWithNewTask,
      };
    case 'editListTitle':
      const listsWithEditedListTitle = state.lists.map((list) => {
        if (list.id === action.payload.id) {
          list.name = action.payload.newName;
          list.color = action.payload.newColor;
        }

        return list;
      });

      return {
        ...state,
        lists: listsWithEditedListTitle,
      };
    case 'editTaskName':
      const listsWithEditedTaskName = state.lists.map((list) => {
        if (list.id === action.payload.id) {
          list.tasks = list.tasks.map((task) => {
            if (task.id === action.payload.taskId) task.text = action.payload.value;

            return task;
          });
        }

        return list;
      });

      return {
        ...state,
        lists: listsWithEditedTaskName,
      };
    case 'toggleStatusTask':
      const listsWithToggleTask = state.lists.map((list) => {
        if (list.id === action.payload.listId) {
          list.tasks = list.tasks.map((task) => {
            if (task.id === action.payload.taskId) task.isCompleted = action.payload.isCompleted;

            return task;
          });
        }

        return list;
      });

      return {
        ...state,
        lists: listsWithToggleTask,
      };
    default:
      return state;
  }
};

export default reducer;
