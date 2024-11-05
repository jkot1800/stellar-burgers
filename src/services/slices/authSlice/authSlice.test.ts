import authReducer, {
  registerUser,
  loginUser,
  updateUser,
  logoutUser
} from './authSlice';
import { TUser } from '@utils-types';
import {
  TRegisterData,
  TAuthResponse,
  TLoginData
} from '../../../utils/burger-api';

describe('Тест authSlice', () => {
  const initialState = {
    user: null as TUser | null,
    isAuthChecked: false,
    error: null as string | null
  };

  it('Тест начального состояния', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  // Тесты для registerUser
  describe('Тесты для registerUser', () => {
    it('Должен установить error в null при registerUser.pending', () => {
      const nextState = authReducer(
        initialState,
        registerUser.pending('', {} as TRegisterData)
      );
      expect(nextState.error).toBeNull();
    });

    it('Должен установить пользователя и isAuthChecked при registerUser.fulfilled', () => {
      const mockUser: TUser = { name: 'John Doe', email: 'john@example.com' };
      const payload: TAuthResponse = {
        success: true,
        refreshToken: 'mockRefreshToken',
        accessToken: 'mockAccessToken',
        user: mockUser
      };
      const nextState = authReducer(
        initialState,
        registerUser.fulfilled(payload, '', {} as TRegisterData)
      );
      expect(nextState.user).toEqual(mockUser);
      expect(nextState.isAuthChecked).toBe(true);
      expect(nextState.error).toBeNull();
    });

    it('Должен установить ошибку при registerUser.rejected', () => {
      const errorMessage = 'Регистрация не удалась';
      const nextState = authReducer(
        initialState,
        registerUser.rejected(new Error(errorMessage), '', {} as TRegisterData)
      );
      expect(nextState.error).toBe(errorMessage);
    });
  });

  // Тесты для loginUser
  describe('Тесты для loginUser', () => {
    it('Должен установить error в null при loginUser.pending', () => {
      const nextState = authReducer(
        initialState,
        loginUser.pending('', {} as TLoginData)
      );
      expect(nextState.error).toBeNull();
    });

    it('Должен установить пользователя и isAuthChecked при loginUser.fulfilled', () => {
      const mockUser: TUser = { name: 'John Doe', email: 'john@example.com' };
      const payload: TAuthResponse = {
        success: true,
        refreshToken: 'mockRefreshToken',
        accessToken: 'mockAccessToken',
        user: mockUser
      };
      const nextState = authReducer(
        initialState,
        loginUser.fulfilled(payload, '', {} as TLoginData)
      );
      expect(nextState.user).toEqual(mockUser);
      expect(nextState.isAuthChecked).toBe(true);
      expect(nextState.error).toBeNull();
    });

    it('Должен установить ошибку и isAuthChecked при loginUser.rejected', () => {
      const errorMessage = 'Вход не удался';
      const nextState = authReducer(
        initialState,
        loginUser.rejected(new Error(errorMessage), '', {} as TLoginData)
      );
      expect(nextState.error).toBe(errorMessage);
      expect(nextState.isAuthChecked).toBe(true);
    });
  });

  // Тесты для updateUser
  describe('Тесты для updateUser', () => {
    it('Должен установить error в null при updateUser.pending', () => {
      const nextState = authReducer(initialState, updateUser.pending('', {}));
      expect(nextState.error).toBeNull();
    });

    it('Должен обновить данные пользователя при updateUser.fulfilled', () => {
      const updatedUser: TUser = {
        name: 'Jane Doe',
        email: 'jane@example.com'
      };
      const payload = { success: true, user: updatedUser };
      const nextState = authReducer(
        initialState,
        updateUser.fulfilled(payload, '', {})
      );
      expect(nextState.user).toEqual(updatedUser);
      expect(nextState.error).toBeNull();
    });

    it('Должен установить ошибку при updateUser.rejected', () => {
      const errorMessage = 'Обновление не удалось';
      const nextState = authReducer(
        initialState,
        updateUser.rejected(new Error(errorMessage), '', {})
      );
      expect(nextState.error).toBe(errorMessage);
    });
  });

  // Тесты для logoutUser
  describe('Тесты для logoutUser', () => {
    it('Должен сбросить данные пользователя при logoutUser.fulfilled', () => {
      const stateWithUser = {
        ...initialState,
        user: { name: 'John Doe', email: 'john@example.com' } as TUser
      };
      const nextState = authReducer(
        stateWithUser,
        logoutUser.fulfilled(undefined, '', undefined)
      );
      expect(nextState.user).toBeNull();
    });

    it('Должен установить ошибку при logoutUser.rejected', () => {
      const errorMessage = 'Выход не удался';
      const nextState = authReducer(
        initialState,
        logoutUser.rejected(new Error(errorMessage), '', undefined)
      );
      expect(nextState.error).toBe(errorMessage);
    });
  });
});
