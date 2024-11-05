import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '../../../utils/types';

export interface InterfaceConsructorState {
  bun: null | TConstructorIngredient;
  ingredients: TConstructorIngredient[];
}

export const initialState: InterfaceConsructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'constructorBurger',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      const ingredient = action.payload;
      if (action.payload.type === 'bun') {
        state.bun = ingredient;
      } else {
        state.ingredients.push(ingredient);
      }
    },

    removeIngredients: (
      state,
      action: PayloadAction<TConstructorIngredient[]>
    ) => {
      state.ingredients = action.payload;
    },
    resetConstructorState: (state) => (state = initialState),
    moveUpIngredient: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index > 0) {
        const temp = state.ingredients[index];
        state.ingredients[index] = state.ingredients[index - 1];
        state.ingredients[index - 1] = temp;
      }
    },
    moveDownIngredient: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index < state.ingredients.length - 1) {
        const temp = state.ingredients[index];
        state.ingredients[index] = state.ingredients[index + 1];
        state.ingredients[index + 1] = temp;
      }
    },
    deleteIngredient: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      state.ingredients.splice(index, 1);
    }
  },
  selectors: {
    stateConstructorSelector: (state) => state,
    ingredientsConstructorSelector: (state) => state.ingredients
  }
});

export const {
  addIngredient,
  removeIngredients,
  resetConstructorState,
  moveUpIngredient,
  moveDownIngredient,
  deleteIngredient
} = constructorSlice.actions;

export const { stateConstructorSelector, ingredientsConstructorSelector } =
  constructorSlice.selectors;
const constructorReducer = constructorSlice.reducer;
export default constructorReducer;
