import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { useHttp } from 'hooks/http.hook';
import { initErrorPopUp } from 'utils/popUp';

export const fetchLists = createAsyncThunk('lists/fetchLists', async (_, { rejectWithValue }) => {
  const { request } = useHttp();

  return await request('http://localhost:3001/lists?_embed=tasks').catch((e) => {
    initErrorPopUp();

    return rejectWithValue(e.message);
  });
});

const setError = (state, action) => {
  state.status = 'rejected';
  state.error = action.payload;
};

const listsSlice = createSlice({
  name: 'lists',
  initialState: {
    lists: [],
    activeList: null,
    status: null,
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
        if (list.id === action.payload.data.listId) {
          list.tasks.unshift(action.payload.data);
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
      state.status = 'loading';
      state.error = null;
    },
    [fetchLists.fulfilled]: (state, action) => {
      state.lists = action.payload;
      state.status = 'resolved';
      state.error = null;
    },
    [fetchLists.rejected]: setError,
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
  editListTitle,
  editTaskName,
  toggleStatusTask,
} = listsSlice.actions;

export default listsSlice.reducer;
