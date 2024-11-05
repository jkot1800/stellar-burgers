import { rootReducer } from './store';

// Получаем начальные состояния из каждого слайса
import { authSlice } from '../services/slices/authSlice/authSlice';
import { constructorSlice } from '../services/slices/constructorSlice/constructorSlice';
import { ingredientsSlice } from '../services/slices/ingredientsSlice/ingredientsSlice';
import { orderSlice } from '../services/slices/orderSlice/orderSlice';

test('Корректная инициализация rootReducer', () => {
  // Ожидаемое начальное состояние, основанное на initialState каждого слайса
  const expectedInitialState = {
    auth: authSlice.getInitialState(),
    constructorBurger: constructorSlice.getInitialState(),
    ingredients: ingredientsSlice.getInitialState(),
    orders: orderSlice.getInitialState()
  };

  // Проверка: начальное состояние rootReducer должно совпадать с ожидаемым
  expect(rootReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
    expectedInitialState
  );
});
