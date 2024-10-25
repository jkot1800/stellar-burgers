import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch } from '../../services/store';
import { TConstructorIngredient } from '@utils-types';
import { nanoid } from '@reduxjs/toolkit';
import { addIngredient } from '../../services/slices/constructorSlice/constructorSlice';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const handleAdd = () => {
      const constructorBurgerIngredient: TConstructorIngredient = {
        ...ingredient,
        id: nanoid()
      };
      dispatch(addIngredient(constructorBurgerIngredient));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
