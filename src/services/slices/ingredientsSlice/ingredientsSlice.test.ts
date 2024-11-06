import {
  ingredientsSlice,
  fetchIngredients,
  initialState
} from './ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('Тестирование редьюсера ingredientsSlice', () => {
  describe('тестирование асинхронного экшена fetchIngredients', () => {
    // Задаем экшены с корректными типами и значениями, чтобы избежать ошибок типизации
    const actions = {
      pending: {
        type: fetchIngredients.pending.type,
        payload: null
      },
      rejected: {
        type: fetchIngredients.rejected.type,
        error: { message: 'Ошибка при загрузке ингредиентов' }
      },
      fulfilled: {
        type: fetchIngredients.fulfilled.type,
        payload: [
          {
            _id: '1',
            name: 'Ingredient 1',
            type: 'bun',
            proteins: 10,
            fat: 5,
            carbohydrates: 20,
            calories: 300,
            price: 100,
            image: 'image_url',
            image_large: 'image_large_url',
            image_mobile: 'image_mobile_url'
          },
          {
            _id: '2',
            name: 'Ingredient 2',
            type: 'sauce',
            proteins: 3,
            fat: 1,
            carbohydrates: 5,
            calories: 50,
            price: 30,
            image: 'image_url_2',
            image_large: 'image_large_url_2',
            image_mobile: 'image_mobile_url_2'
          }
        ] as TIngredient[]
      }
    };

    test('тест fetchIngredients.pending', () => {
      const state = ingredientsSlice.reducer(initialState, actions.pending);
      // Проверяем, что isLoading устанавливается в true, и hasError обнуляется
      expect(state.isLoading).toBe(true);
      expect(state.hasError).toBe(null);
    });

    test('тест fetchIngredients.rejected', () => {
      const state = ingredientsSlice.reducer(initialState, actions.rejected);
      // Проверяем, что isLoading сбрасывается в false и hasError сохраняет сообщение об ошибке
      expect(state.isLoading).toBe(false);
      expect(state.hasError).toBe(actions.rejected.error.message);
    });

    test('тест fetchIngredients.fulfilled', () => {
      const state = ingredientsSlice.reducer(initialState, actions.fulfilled);
      // Проверяем, что isLoading сбрасывается в false и ingredients обновляется с данными
      expect(state.isLoading).toBe(false);
      expect(state.ingredients).toEqual(actions.fulfilled.payload);
      expect(state.hasError).toBe(null);
    });
  });
});
