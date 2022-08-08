import { configureStore } from '@reduxjs/toolkit';
import listReducer from './slices/listSlice';
import userReducer from './slices/userSlice';

export default configureStore({
  reducer: {
    list: listReducer,
    user: userReducer,
  },
});
