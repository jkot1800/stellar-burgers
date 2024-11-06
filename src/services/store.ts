import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { ingredientsSlice } from '../services/slices/ingredientsSlice/ingredientsSlice';
import { constructorSlice } from '../services/slices/constructorSlice/constructorSlice';
import { orderSlice } from '../services/slices/orderSlice/orderSlice';
import { authSlice } from '../services/slices/authSlice/authSlice';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

export const rootReducer = combineSlices(
  ingredientsSlice,
  constructorSlice,
  orderSlice,
  authSlice
);

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
