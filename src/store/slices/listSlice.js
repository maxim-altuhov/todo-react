import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  doc,
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';

import { database } from '../../firebase';
import { initErrorPopUp } from 'utils/popUp';

export const initFetchLists = createAsyncThunk(
  'list/initFetchLists',
  async (_, { fulfillWithValue, rejectWithValue, getState }) => {
    const { user } = getState();
    const userColRef = collection(database, user.id);
    const queryLists = query(userColRef, orderBy('controlTime', 'asc'));
    // TODO Переписать структуру запроса данных
    const querySnapshotLists = await getDocs(queryLists);
    let lists = [];

    const getTasks = (snapshotTasks) => {
      let tasks = [];

      snapshotTasks.forEach((task) => {
        tasks.push({ ...task.data(), id: task.id });
      });

      return tasks;
    };

    querySnapshotLists.forEach(async (list) => {
      const tasksColRef = collection(database, user.id, list.id, 'tasks');
      const querySnapshotTasks = await getDocs(tasksColRef);

      lists.push({
        ...list.data(),
        id: list.id,
        tasks: getTasks(querySnapshotTasks),
      });
    });

    return await getDocs(queryLists)
      .then(() => {
        return fulfillWithValue(lists);
      })
      .catch((e) => {
        if (e.code === 'permission-denied') {
          initErrorPopUp('Пользователь не авторизован!');
        } else {
          initErrorPopUp(e.message);
        }

        return rejectWithValue(e.message);
      });
  },
);

export const initCreateList = createAsyncThunk(
  'list/initCreateList',
  async (newList, { rejectWithValue, dispatch, getState }) => {
    const { user } = getState();
    const userColRef = collection(database, user.id);

    return await addDoc(userColRef, newList)
      .then(({ id }) => dispatch(addList({ ...newList, id, tasks: [] })))
      .catch((e) => {
        initErrorPopUp(e.message);

        return rejectWithValue(e.message);
      });
  },
);

export const initRemoveList = createAsyncThunk(
  'list/initRemoveList',
  async (listId, { rejectWithValue, dispatch, getState }) => {
    const { user } = getState();
    const listsDocRef = doc(database, user.id, listId);
    const tasksColRef = collection(database, user.id, listId, 'tasks');

    await getDocs(tasksColRef)
      .then((docs) => docs.forEach((doc) => deleteDoc(doc.ref)))
      .catch((e) => {
        initErrorPopUp(e.message);

        return rejectWithValue(e.message);
      });

    return await deleteDoc(listsDocRef)
      .then(() => dispatch(removeList({ listId })))
      .catch((e) => {
        initErrorPopUp(e.message);

        return rejectWithValue(e.message);
      });
  },
);

export const initEditTaskTitle = createAsyncThunk(
  'list/initEditTaskTitle',
  async ({ listId, newName, newColor }, { rejectWithValue, dispatch, getState }) => {
    const { user } = getState();
    const listsDocRef = doc(database, user.id, listId);

    return await updateDoc(listsDocRef, {
      name: newName,
      color: newColor,
    })
      .then(() => dispatch(editListTitle({ listId, newName, newColor })))
      .catch((e) => {
        initErrorPopUp(e.message);

        return rejectWithValue(e.message);
      });
  },
);

export const initAddTask = createAsyncThunk(
  'list/initAddTask',
  async ({ listId, newTask }, { rejectWithValue, dispatch, getState }) => {
    const { user } = getState();
    const tasksColRef = collection(database, user.id, listId, 'tasks');

    return await addDoc(tasksColRef, newTask)
      .then(({ id: taskId }) => dispatch(addTask({ listId, taskId, newTask })))
      .catch((e) => {
        initErrorPopUp(e.message);

        return rejectWithValue(e.message);
      });
  },
);

export const initEditTask = createAsyncThunk(
  'list/initEditTask',
  async ({ listId, taskId, newText }, { rejectWithValue, dispatch, getState }) => {
    const { user } = getState();
    const tasksDocRef = doc(database, user.id, listId, 'tasks', taskId);

    return await updateDoc(tasksDocRef, {
      text: newText,
    })
      .then(() => dispatch(editTaskName({ listId, taskId, newText })))
      .catch((e) => {
        initErrorPopUp(e.message);

        return rejectWithValue(e.message);
      });
  },
);

export const initRemoveTask = createAsyncThunk(
  'list/initRemoveTask',
  async ({ listId, taskId }, { rejectWithValue, dispatch, getState }) => {
    const { user } = getState();
    const tasksDocRef = doc(database, user.id, listId, 'tasks', taskId);

    return await deleteDoc(tasksDocRef)
      .then(() => dispatch(removeTask({ listId, taskId })))
      .catch((e) => {
        initErrorPopUp(e.message);

        return rejectWithValue(e.message);
      });
  },
);

export const initRemoveAllTask = createAsyncThunk(
  'list/initRemoveAllTask',
  async ({ listId }, { rejectWithValue, dispatch, getState }) => {
    const { user } = getState();
    const tasksColRef = collection(database, user.id, listId, 'tasks');

    return await getDocs(tasksColRef)
      .then((docs) => {
        docs.forEach((doc) => deleteDoc(doc.ref));

        dispatch(removeAllTask({ listId }));
      })
      .catch((e) => {
        initErrorPopUp(e.message);

        return rejectWithValue(e.message);
      });
  },
);

export const initRemoveAllCompletedTasks = createAsyncThunk(
  'list/initRemoveAllCompletedTasks',
  async ({ listId }, { rejectWithValue, dispatch, getState }) => {
    const { user } = getState();
    const tasksColRef = collection(database, user.id, listId, 'tasks');
    const queryTasks = query(tasksColRef, where('isCompleted', '==', true));

    return await getDocs(queryTasks)
      .then((docs) => {
        docs.forEach((doc) => deleteDoc(doc.ref));

        dispatch(removeAllCompletedTask({ listId }));
      })
      .catch((e) => {
        initErrorPopUp(e.message);

        return rejectWithValue(e.message);
      });
  },
);

export const initToggleTask = createAsyncThunk(
  'list/initToggleTask',
  async ({ taskId, listId, isCompleted }, { rejectWithValue, dispatch, getState }) => {
    const { user } = getState();
    const tasksDocRef = doc(database, user.id, listId, 'tasks', taskId);
    dispatch(toggleStatusTask({ taskId, listId, isCompleted }));

    return await updateDoc(tasksDocRef, { isCompleted }).catch((e) => {
      initErrorPopUp(e.message);

      return rejectWithValue(e.message);
    });
  },
);

const listSlice = createSlice({
  name: 'list',
  initialState: {
    lists: [],
    activeList: null,
    status: 'waiting',
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
      state.lists = state.lists.filter((list) => list.id !== action.payload.listId);
      state.activeList = null;
    },
    addTask(state, action) {
      state.lists = state.lists.map((list) => {
        if (list.id === action.payload.listId) {
          list.tasks.unshift({ ...action.payload.newTask, id: action.payload.taskId });
        }

        return list;
      });
    },
    removeTask(state, action) {
      state.lists = state.lists.map((list) => {
        if (list.id === action.payload.listId) {
          list.tasks = list.tasks.filter((task) => task.id !== action.payload.taskId);
        }

        return list;
      });
    },
    removeAllTask(state, action) {
      state.lists = state.lists.map((list) => {
        if (list.id === action.payload.listId) {
          list.tasks = [];
        }

        return list;
      });
    },
    removeAllCompletedTask(state, action) {
      state.lists = state.lists.map((list) => {
        if (list.id === action.payload.listId) {
          list.tasks = list.tasks.filter((task) => !task.isCompleted);
        }

        return list;
      });
    },
    editListTitle(state, action) {
      state.lists = state.lists.map((list) => {
        if (list.id === action.payload.listId) {
          list.name = action.payload.newName;
          list.color = action.payload.newColor;
        }

        return list;
      });
    },
    editTaskName(state, action) {
      state.lists = state.lists.map((list) => {
        if (list.id === action.payload.listId) {
          list.tasks = list.tasks.map((task) => {
            if (task.id === action.payload.taskId) task.text = action.payload.newText;

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
    [initFetchLists.pending]: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    [initFetchLists.fulfilled]: (state, action) => {
      console.log('action.payload', action.payload);
      state.lists = action.payload;
      state.status = 'resolved';
      state.error = null;
    },
    [initFetchLists.rejected]: (state, action) => {
      state.status = 'rejected';
      state.error = action.payload;
    },
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
