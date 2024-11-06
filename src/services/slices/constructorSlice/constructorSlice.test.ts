import constructorReducer, {
  addIngredient,
  deleteIngredient,
  moveUpIngredient,
  moveDownIngredient,
  resetConstructorState,
  initialState
} from './constructorSlice';
import { TConstructorIngredient } from '../../../utils/types';
import { describe, it, expect } from '@jest/globals';

// Константа для тестового ингредиента 'Space Sauce'
const spaceSauceIngredient: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa0943',
  name: 'Соус фирменный Space Sauce',
  type: 'sauce',
  proteins: 50,
  fat: 22,
  carbohydrates: 11,
  calories: 14,
  price: 80,
  image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png',
  id: 'sauce-01'
};

// Константа для тестового ингредиента 'Spicy-X'
const spicyXSauceIngredient: TConstructorIngredient = {
  ...spaceSauceIngredient,
  _id: '643d69a5c3f7b9001cfa0944',
  name: 'Соус Spicy-X',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
  id: 'sauce-02'
};

describe('Тесты ConstructorSlice reducer', () => {
  const bunIngredient: TConstructorIngredient = {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    id: 'bun-01'
  };

  // Ожидаемое состояние после добавления ингредиента
  const expectedResult = {
    ...initialState,
    constructorItems: {
      bun: bunIngredient,
      ingredients: [spaceSauceIngredient]
    }
  };

  it('Должен добавить булку при вызове addIngredient с типом "bun"', () => {
    const state = constructorReducer(
      initialState,
      addIngredient(bunIngredient)
    );
    expect(state.bun).toEqual(bunIngredient);
    expect(state.ingredients).toHaveLength(0); // ингредиенты не должны измениться
  });

  it('Должен удалить ингредиент при вызове deleteIngredient', () => {
    const initialStateWithIngredients = {
      bun: null,
      ingredients: [spaceSauceIngredient]
    };

    const state = constructorReducer(
      initialStateWithIngredients,
      deleteIngredient(0)
    );
    expect(state.ingredients).toHaveLength(0); // ингредиенты должны быть пустыми
  });

  it('Должен переместить ингредиент вверх при вызове moveUpIngredient', () => {
    const initialStateWithIngredients = {
      bun: null,
      ingredients: [spaceSauceIngredient, spicyXSauceIngredient]
    };

    const state = constructorReducer(
      initialStateWithIngredients,
      moveUpIngredient(1)
    );
    expect(state.ingredients[0]).toEqual(spicyXSauceIngredient); // первый элемент должен быть 'Соус Spicy-X'
    expect(state.ingredients[1]).toEqual(spaceSauceIngredient); // второй элемент должен быть 'Соус фирменный Space Sauce'
  });

  it('Должен переместить ингредиент вниз при вызове moveDownIngredient', () => {
    const initialStateWithIngredients = {
      bun: null,
      ingredients: [spaceSauceIngredient, spicyXSauceIngredient]
    };

    const state = constructorReducer(
      initialStateWithIngredients,
      moveDownIngredient(0)
    );
    expect(state.ingredients[0]).toEqual(spicyXSauceIngredient); // первый элемент должен быть 'Соус Spicy-X'
    expect(state.ingredients[1]).toEqual(spaceSauceIngredient); // второй элемент должен быть 'Соус фирменный Space Sauce'
  });

  it('Должен сбросить состояние при вызове resetConstructorState', () => {
    const state = constructorReducer(
      {
        bun: bunIngredient,
        ingredients: []
      },
      resetConstructorState()
    );
    expect(state).toEqual(initialState); // состояние должно сброситься
  });
});
