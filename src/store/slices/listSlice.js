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
} from 'firebase/firestore';

import { database } from '../../firebase';
import { initErrorPopUp } from 'utils/popUp';

const listsColRef = collection(database, 'lists');
const tasksColRef = collection(database, 'tasks');

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

export const initFetchLists = createAsyncThunk(
  'list/initFetchLists',
  async (_, { fulfillWithValue, rejectWithValue }) => {
    const tasks = await getDocs(tasksColRef)
      .then((snapshot) => {
        return snapshot.docs.map((task) => ({
          ...task.data(),
          id: task.id,
        }));
      })
      .catch((e) => {
        initErrorPopUp(e.message);

        return rejectWithValue(e.message);
      });

    return await getDocs(listsColRef)
      .then((snapshot) => {
        const lists = snapshot.docs.map((list) => ({
          ...list.data(),
          id: list.id,
          tasks: tasks.filter((task) => task.listId === list.id) || [],
        }));

        return fulfillWithValue(lists);
      })
      .catch((e) => {
        initErrorPopUp(e.message);

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
  async (id, { rejectWithValue, dispatch }) => {
    const listsDocRef = doc(database, 'lists', id);
    const queryTasks = query(tasksColRef, where('listId', '==', id));

    return await deleteDoc(listsDocRef)
      .then(() => {
        dispatch(removeList({ id }));
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
  async ({ id, newName, newColor }, { rejectWithValue, dispatch }) => {
    const listsDocRef = doc(database, 'lists', id);

    return await updateDoc(listsDocRef, {
      name: newName,
      color: newColor,
    })
      .then(() => dispatch(editListTitle({ id, newName, newColor })))
      .catch((e) => {
        initErrorPopUp(e.message);

        return rejectWithValue(e.message);
      });
  },
);

export const initAddTask = createAsyncThunk(
  'list/initAddTask',
  async ({ id, newTask }, { rejectWithValue, dispatch }) => {
    return await addDoc(tasksColRef, { ...newTask, listId: id })
      .then(({ id: taskId }) => dispatch(addTask({ id, taskId, newTask })))
      .catch((e) => {
        initErrorPopUp(e.message);

        return rejectWithValue(e.message);
      });
  },
);

export const initEditTask = createAsyncThunk(
  'list/initEditTask',
  async ({ id, taskId, newText }, { rejectWithValue, dispatch }) => {
    const tasksDocRef = doc(database, 'tasks', taskId);

    return await updateDoc(tasksDocRef, {
      text: newText,
    })
      .then(() => dispatch(editTaskName({ id, taskId, newText })))
      .catch((e) => {
        initErrorPopUp(e.message);

        return rejectWithValue(e.message);
      });
  },
);

export const initRemoveTask = createAsyncThunk(
  'list/initRemoveTask',
  async ({ taskId, id }, { rejectWithValue, dispatch }) => {
    const tasksDocRef = doc(database, 'tasks', taskId);

    return await deleteDoc(tasksDocRef)
      .then(() => dispatch(removeTask({ taskId, id })))
      .catch((e) => {
        initErrorPopUp(e.message);

        return rejectWithValue(e.message);
      });
  },
);

export const initRemoveAllTask = createAsyncThunk(
  'list/initRemoveAllTask',
  async ({ id }, { rejectWithValue, dispatch }) => {
    const queryTasks = query(tasksColRef, where('listId', '==', id));

    return await getDocs(queryTasks)
      .then((docs) => {
        docs.forEach((doc) => deleteDoc(doc.ref));

        dispatch(removeAllTask({ id }));
      })
      .catch((e) => {
        initErrorPopUp(e.message);

        return rejectWithValue(e.message);
      });
  },
);

export const initRemoveAllCompletedTasks = createAsyncThunk(
  'list/initRemoveAllCompletedTasks',
  async ({ id }, { rejectWithValue, dispatch }) => {
    const queryTasks = query(
      tasksColRef,
      where('listId', '==', id),
      where('isCompleted', '==', true),
    );

    return await getDocs(queryTasks)
      .then((docs) => {
        docs.forEach((doc) => deleteDoc(doc.ref));

        dispatch(removeAllCompletedTask({ id }));
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

    return await updateDoc(tasksDocRef, {
      isCompleted,
    })
      .then(() => dispatch(toggleStatusTask({ taskId, listId, isCompleted })))
      .catch((e) => {
        initErrorPopUp(e.message);

        return rejectWithValue(e.message);
      });
  },
);

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
        if (list.id === action.payload.id) {
          list.tasks.unshift({ ...action.payload.newTask, id: action.payload.taskId });
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
      state.globalStatus = 'loading';
      state.error = null;
    },
    [initFetchLists.fulfilled]: (state, action) => {
      state.lists = action.payload;
      state.globalStatus = 'resolved';
      state.error = null;
    },
    [initFetchLists.rejected]: (state, action) => {
      state.globalStatus = 'rejected';
      state.error = action.payload;
    },
    [initCreateList.pending]: setLoadingStatus,
    [initCreateList.fulfilled]: setResolvedStatus,
    [initCreateList.rejected]: setRejectedStatus,
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
