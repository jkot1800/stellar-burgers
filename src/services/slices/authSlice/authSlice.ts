import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { deleteCookie, getCookie, setCookie } from '../../../utils/cookie';
import { TUser } from '@utils-types';

// Thunks для работы с API

// Thunk для регистрации пользователя
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
  }
);
// Thunk для логина пользователя
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
  }
);
// Thunk для обновления данных пользователя
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>) => {
    await updateUserApi(data);
    const response = await getUserApi();
    return response;
  }
);
// Thunk для выхода пользователя
export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
});
// Thunk для проверки аутентификации пользователя
export const checkUserAuth = createAsyncThunk(
  'auth/checkUserAuth',
  async (_, { dispatch }) => {
    const accessToken = getCookie('accessToken');

    if (accessToken) {
      try {
        const res = await getUserApi();
        dispatch(setUser(res.user));
      } catch (error) {
        // Удаляем токены, если произошла ошибка (например, токен истек)
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
      } finally {
        // Устанавливаем флаг проверки авторизации
        dispatch(setIsAuthChecked(true));
      }
    } else {
      // Если токена нет, сразу помечаем авторизацию как проверенную
      dispatch(setIsAuthChecked(true));
    }
  }
);

//Интерфейс initialState для слайса
interface IUserInitialState {
  user: TUser | null;
  isAuthChecked: boolean;
  error: null | string | undefined;
}

//Начальное состояние
const initialState: IUserInitialState = {
  user: null,
  isAuthChecked: false,
  error: null
};

//Слайс
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    setUser: (state, action: PayloadAction<TUser | null>) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    //Регистрация пользователя registerUser
    builder
      .addCase(registerUser.pending, (state) => {
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.error.message;
      });
    //Авторизация пользователя loginUser
    builder
      .addCase(loginUser.pending, (state) => {
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.error.message;
        state.isAuthChecked = true;
      });
    //Обновление данных пользователя updateUser
    builder
      .addCase(updateUser.pending, (state) => {
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error.message;
      });
    //Логаут пользователя logoutUser
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
  selectors: {
    userSelector: (state) => state.user,
    authCheckedSelector: (state) => state.isAuthChecked,
    userNameSelector: (state) => state.user?.name
  }
});

export const { userSelector, authCheckedSelector, userNameSelector } =
  authSlice.selectors;
export const { setUser, setIsAuthChecked } = authSlice.actions;
const authReducer = authSlice.reducer;
export default authReducer;
