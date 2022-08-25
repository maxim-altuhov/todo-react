import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAuth,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';

import {
  initErrorPopUp,
  initUserErrorPopUp,
  initPassErrorPopUp,
  initEmailErrorPopUp,
} from 'utils/popUp';

export const initSignInUser = createAsyncThunk(
  'user/initSignInUser',
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    const auth = getAuth();

    return await signInWithEmailAndPassword(auth, email, password)
      .then(({ user }) => {
        dispatch(
          setUser({
            email: user.email,
            id: user.uid,
            token: user.accessToken,
          }),
        );
      })
      .catch((e) => {
        if (e.code === 'auth/user-not-found') {
          initUserErrorPopUp();
        } else if (e.code === 'auth/wrong-password') {
          initPassErrorPopUp();
        } else {
          initErrorPopUp(e.message);
        }

        return rejectWithValue(e.message);
      });
  },
);

export const initResetPassword = createAsyncThunk(
  'user/initResetPassword',
  async ({ email }, { rejectWithValue, dispatch }) => {
    const auth = getAuth();
    auth.languageCode = 'ru';

    return await sendPasswordResetEmail(auth, email)
      .then(() => dispatch(removeUser()))
      .catch((e) => {
        if (e.code === 'auth/user-not-found') {
          initUserErrorPopUp();
        } else {
          initErrorPopUp(e.message);
        }

        return rejectWithValue(e.message);
      });
  },
);

export const initCreateUser = createAsyncThunk(
  'user/initCreateUser',
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    const auth = getAuth();

    return await createUserWithEmailAndPassword(auth, email, password)
      .then(({ user }) => {
        dispatch(
          setUser({
            email: user.email,
            id: user.uid,
            token: user.accessToken,
          }),
        );
      })
      .catch((e) => {
        if (e.code === 'auth/email-already-in-use') {
          initEmailErrorPopUp();
        } else {
          initErrorPopUp(e.message);
        }

        return rejectWithValue(e.message);
      });
  },
);

export const initRemoveUser = createAsyncThunk(
  'user/initRemoveUser',
  async (_, { rejectWithValue, dispatch }) => {
    const auth = getAuth();

    return await signOut(auth)
      .then(() => dispatch(removeUser()))
      .catch((e) => {
        initErrorPopUp(e.message);

        return rejectWithValue(e.message);
      });
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isAuth: false,
    email: null,
    token: null,
    id: null,
  },
  reducers: {
    setUser(state, action) {
      state.isAuth = Boolean(action.payload.email);
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.id = action.payload.id;
    },
    removeUser(state) {
      state.isAuth = false;
      state.email = null;
      state.token = null;
      state.id = null;
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
