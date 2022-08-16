import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAuth } from 'firebase/auth';
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

const listsColRef = collection(database, 'lists');
const tasksColRef = collection(database, 'tasks');

export const initFetchLists = createAsyncThunk(
  'list/initFetchLists',
  async (_, { fulfillWithValue, rejectWithValue }) => {
    const auth = getAuth();
    const user = auth.currentUser;
    const queryTasks = query(tasksColRef, orderBy('controlTime', 'asc'));
    const queryLists = query(
      listsColRef,
      where('uid', '==', user.uid),
      orderBy('controlTime', 'asc'),
    );
    let lists = [];
    let tasks = [];

    await getDocs(queryTasks)
      .then((docs) => {
        docs.forEach((task) => {
          tasks.push({
            ...task.data(),
            id: task.id,
          });
        });
      })
      .catch((e) => {
        initErrorPopUp(e.message);

        return rejectWithValue(e.message);
      });

    return await getDocs(queryLists)
      .then((docs) => {
        docs.forEach((list) => {
          lists.push({
            ...list.data(),
            id: list.id,
            tasks: tasks.filter((task) => task.listId === list.id),
          });
        });

        return fulfillWithValue(lists);
      })
      .catch((e) => {
        if (e.code === 'permission-denied') {
          initErrorPopUp('Для данного пользователя нет доступа!');
        } else {
          initErrorPopUp(e.message);
        }

        return rejectWithValue(e.message);
      });
  },
);

export const initCreateList = createAsyncThunk(
  'list/initCreateList',
  async (newList, { rejectWithValue, dispatch }) => {
    return await addDoc(listsColRef, newList)
      .then(({ id }) => dispatch(addList({ ...newList, id, tasks: [] })))
      .catch((e) => {
        initErrorPopUp(e.message);

        return rejectWithValue(e.message);
      });
  },
);

export const initRemoveList = createAsyncThunk(
  'list/initRemoveList',
  async (listId, { rejectWithValue, dispatch }) => {
    const listsDocRef = doc(database, 'lists', listId);
    const queryTasks = query(tasksColRef, where('listId', '==', listId));

    return await deleteDoc(listsDocRef)
      .then(() => {
        dispatch(removeList({ listId }));
        getDocs(queryTasks).then((docs) => {
          docs.forEach((doc) => deleteDoc(doc.ref));
        });
      })
      .catch((e) => {
        initErrorPopUp(e.message);

        return rejectWithValue(e.message);
      });
  },
);

export const initEditTaskTitle = createAsyncThunk(
  'list/initEditTaskTitle',
  async ({ listId, newName, newColor }, { rejectWithValue, dispatch }) => {
    const listsDocRef = doc(database, 'lists', listId);

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
  async ({ listId, newTask }, { rejectWithValue, dispatch }) => {
    return await addDoc(tasksColRef, { ...newTask, listId })
      .then(({ id: taskId }) => dispatch(addTask({ listId, taskId, newTask })))
      .catch((e) => {
        initErrorPopUp(e.message);

        return rejectWithValue(e.message);
      });
  },
);

export const initEditTask = createAsyncThunk(
  'list/initEditTask',
  async ({ listId, taskId, newText }, { rejectWithValue, dispatch }) => {
    const tasksDocRef = doc(database, 'tasks', taskId);

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
  async ({ listId, taskId }, { rejectWithValue, dispatch }) => {
    const tasksDocRef = doc(database, 'tasks', taskId);

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
  async ({ listId }, { rejectWithValue, dispatch }) => {
    const queryTasks = query(tasksColRef, where('listId', '==', listId));

    return await getDocs(queryTasks)
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
  async ({ listId }, { rejectWithValue, dispatch }) => {
    const queryTasks = query(
      tasksColRef,
      where('listId', '==', listId),
      where('isCompleted', '==', true),
    );

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
  async ({ taskId, listId, isCompleted }, { rejectWithValue, dispatch }) => {
    const tasksDocRef = doc(database, 'tasks', taskId);
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
