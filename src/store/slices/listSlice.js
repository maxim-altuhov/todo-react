import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { request } from 'utils/request';
import { initErrorPopUp } from 'utils/popUp';

export const fetchLists = createAsyncThunk('list/fetchLists', async (_, { rejectWithValue }) => {
  return await request('http://localhost:3001/lists?_embed=tasks').catch((e) => {
    initErrorPopUp(e.message);

    return rejectWithValue(e.message);
  });
});

export const createList = createAsyncThunk(
  'list/createList',
  async (newList, { rejectWithValue, dispatch }) => {
    return await request('http://localhost:3001/lists', 'POST', JSON.stringify(newList))
      .then((data) => {
        dispatch(
          addList({
            ...data,
            tasks: [],
          }),
        );
      })
      .catch((e) => {
        initErrorPopUp(e.message);

        return rejectWithValue(e.message);
      });
  },
);

export const initRemoveList = createAsyncThunk(
  'list/initRemoveList',
  async (id, { rejectWithValue, dispatch }) => {
    return await request(`http://localhost:3001/lists/${id}`, 'DELETE')
      .then(() => {
        dispatch(removeList({ id }));
      })
      .catch((e) => {
        initErrorPopUp(e.message);

        return rejectWithValue(e.message);
      });
  },
);

export const initEditTaskTitle = createAsyncThunk(
  'list/initEditTaskTitle',
  async ({ id, newName, newColor }, { rejectWithValue, dispatch }) => {
    return await request(
      `http://localhost:3001/lists/${id}`,
      'PATCH',
      JSON.stringify({
        name: newName,
        color: newColor,
      }),
    )
      .then(() => {
        dispatch(editListTitle({ id, newName, newColor }));
      })
      .catch((e) => {
        initErrorPopUp(e.message);

        return rejectWithValue(e.message);
      });
  },
);

export const initAddTask = createAsyncThunk(
  'list/initAddTask',
  async (newTask, { rejectWithValue, dispatch }) => {
    return await request('http://localhost:3001/tasks', 'POST', JSON.stringify(newTask))
      .then(() => dispatch(addTask({ newTask })))
      .catch((e) => {
        initErrorPopUp(e.message);

        return rejectWithValue(e.message);
      });
  },
);

export const initEditTask = createAsyncThunk(
  'list/initEditTask',
  async ({ taskId, id, value }, { rejectWithValue, dispatch }) => {
    return await request(
      `http://localhost:3001/tasks/${taskId}`,
      'PATCH',
      JSON.stringify({
        text: value,
      }),
    )
      .then(() => dispatch(editTaskName({ taskId, id, value })))
      .catch((e) => {
        initErrorPopUp(e.message);

        return rejectWithValue(e.message);
      });
  },
);

export const initRemoveTask = createAsyncThunk(
  'list/initRemoveTask',
  async ({ taskId, id }, { rejectWithValue, dispatch }) => {
    return await request(`http://localhost:3001/tasks/${taskId}`, 'DELETE')
      .then(() => dispatch(removeTask({ taskId, id })))
      .catch((e) => {
        initErrorPopUp(e.message);

        return rejectWithValue(e.message);
      });
  },
);

export const initRemoveAllTask = createAsyncThunk(
  'list/initRemoveAllTask',
  async ({ tasks, id }, { rejectWithValue, dispatch }) => {
    const fetchRemoveTasks = tasks.map(async ({ id }) => {
      try {
        return await request(`http://localhost:3001/tasks/${id}`, 'DELETE');
      } catch (e) {
        initErrorPopUp(e.message);
        return rejectWithValue(e.message);
      }
    });

    await Promise.allSettled([fetchRemoveTasks]).then(() => {
      dispatch(removeAllTask({ id }));
    });
  },
);

export const initRemoveAllCompletedTasks = createAsyncThunk(
  'list/initRemoveAllCompletedTasks',
  async ({ tasks, id }, { rejectWithValue, dispatch, getState }) => {
    const fetchRemoveTasks = tasks.map(async ({ id, isCompleted }) => {
      try {
        if (isCompleted) return await request(`http://localhost:3001/tasks/${id}`, 'DELETE');
      } catch (e) {
        initErrorPopUp(e.message);
        return rejectWithValue(e.message);
      }
    });

    await Promise.allSettled([fetchRemoveTasks]).then((data) => {
      dispatch(removeAllCompletedTask({ id }));
    });
  },
);

export const initToggleTask = createAsyncThunk(
  'list/initToggleTask',
  async ({ taskId, listId, isCompleted }, { rejectWithValue, dispatch }) => {
    return await request(
      `http://localhost:3001/tasks/${taskId}`,
      'PATCH',
      JSON.stringify({ isCompleted }),
    )
      .then(() => dispatch(toggleStatusTask({ taskId, listId, isCompleted })))
      .catch((e) => {
        initErrorPopUp(e.message);

        return rejectWithValue(e.message);
      });
  },
);

const setLoadingStatus = (state) => {
  state.currentStatus = 'loading';
  state.error = null;
};

const setResolvedStatus = (state) => {
  state.currentStatus = 'resolved';
  state.error = null;
};

const setRejectedStatus = (state, action) => {
  state.currentStatus = 'rejected';
  state.error = action.payload;
};

const listSlice = createSlice({
  name: 'list',
  initialState: {
    lists: [],
    colors: ['#42B883', '#64C4ED', '#FFBBCC', '#B6E6BD', '#C355F5', '#110133', '#FF6464'],
    activeList: null,
    globalStatus: 'waiting',
    currentStatus: 'waiting',
    error: null,
    isOpenMenu: false,
    isOpenPopup: false,
  },
  reducers: {
    toggleMenu(state) {
      state.isOpenMenu = !state.isOpenMenu;
      state.isOpenPopup = state.isOpenPopup && false;
    },
    togglePopup(state) {
      state.isOpenMenu = true;
      state.isOpenPopup = !state.isOpenPopup;
    },
    addList(state, action) {
      state.lists.push(action.payload);
      state.activeList = action.payload;
      state.isOpenMenu = false;
      state.isOpenPopup = false;
    },
    setActiveList(state, action) {
      state.activeList = action.payload;
      state.isOpenMenu = false;
      state.isOpenPopup = false;
    },
    removeList(state, action) {
      state.lists = state.lists.filter((list) => list.id !== action.payload.id);
      state.activeList = null;
    },
    addTask(state, action) {
      state.lists = state.lists.map((list) => {
        if (list.id === action.payload.newTask.listId) {
          list.tasks.unshift(action.payload.newTask);
        }

        return list;
      });
    },
    removeTask(state, action) {
      state.lists = state.lists.map((list) => {
        if (list.id === action.payload.id) {
          list.tasks = list.tasks.filter((task) => task.id !== action.payload.taskId);
        }

        return list;
      });
    },
    removeAllTask(state, action) {
      state.lists = state.lists.map((list) => {
        if (list.id === action.payload.id) {
          list.tasks = [];
        }

        return list;
      });
    },
    removeAllCompletedTask(state, action) {
      state.lists = state.lists.map((list) => {
        if (list.id === action.payload.id) {
          list.tasks = list.tasks.filter((task) => !task.isCompleted);
        }

        return list;
      });
    },
    editListTitle(state, action) {
      state.lists = state.lists.map((list) => {
        if (list.id === action.payload.id) {
          list.name = action.payload.newName;
          list.color = action.payload.newColor;
        }

        return list;
      });
    },
    editTaskName(state, action) {
      state.lists = state.lists.map((list) => {
        if (list.id === action.payload.id) {
          list.tasks = list.tasks.map((task) => {
            if (task.id === action.payload.taskId) task.text = action.payload.value;

            return task;
          });
        }

        return list;
      });
    },
    toggleStatusTask(state, action) {
      state.lists = state.lists.map((list) => {
        if (list.id === action.payload.listId) {
          list.tasks = list.tasks.map((task) => {
            if (task.id === action.payload.taskId) task.isCompleted = action.payload.isCompleted;

            return task;
          });
        }

        return list;
      });
    },
  },
  extraReducers: {
    [fetchLists.pending]: (state) => {
      state.globalStatus = 'loading';
      state.error = null;
    },
    [fetchLists.fulfilled]: (state, action) => {
      state.lists = action.payload;
      state.globalStatus = 'resolved';
      state.error = null;
    },
    [fetchLists.rejected]: (state, action) => {
      state.globalStatus = 'rejected';
      state.error = action.payload;
    },
    [createList.pending]: setLoadingStatus,
    [createList.fulfilled]: setResolvedStatus,
    [createList.rejected]: setRejectedStatus,
    [initAddTask.pending]: setLoadingStatus,
    [initAddTask.fulfilled]: setResolvedStatus,
    [initAddTask.rejected]: setRejectedStatus,
    [initRemoveList.pending]: setLoadingStatus,
    [initRemoveList.fulfilled]: setResolvedStatus,
    [initRemoveList.rejected]: setRejectedStatus,
    [initEditTaskTitle.pending]: setLoadingStatus,
    [initEditTaskTitle.fulfilled]: setResolvedStatus,
    [initEditTaskTitle.rejected]: setRejectedStatus,
    [initEditTask.pending]: setLoadingStatus,
    [initEditTask.fulfilled]: setResolvedStatus,
    [initEditTask.rejected]: setRejectedStatus,
    [initRemoveTask.pending]: setLoadingStatus,
    [initRemoveTask.fulfilled]: setResolvedStatus,
    [initRemoveTask.rejected]: setRejectedStatus,
    [initRemoveAllTask.pending]: setLoadingStatus,
    [initRemoveAllTask.fulfilled]: setResolvedStatus,
    [initRemoveAllTask.rejected]: setRejectedStatus,
    [initRemoveAllCompletedTasks.pending]: setLoadingStatus,
    [initRemoveAllCompletedTasks.fulfilled]: setResolvedStatus,
    [initRemoveAllCompletedTasks.rejected]: setRejectedStatus,
    [initToggleTask.pending]: setLoadingStatus,
    [initToggleTask.fulfilled]: setResolvedStatus,
    [initToggleTask.rejected]: setRejectedStatus,
  },
});

export const {
  toggleMenu,
  togglePopup,
  addList,
  setActiveList,
  removeList,
  addTask,
  removeTask,
  removeAllTask,
  removeAllCompletedTask,
  editListTitle,
  editTaskName,
  toggleStatusTask,
} = listSlice.actions;

export default listSlice.reducer;
