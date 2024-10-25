import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  resetConstructorState,
  stateConstructorSelector
} from '../../services/slices/constructorSlice/constructorSlice';
import {
  clearOrderState,
  isLoadingOrderSelector,
  orderSelector,
  postOrder
} from '../../services/slices/orderSlice/orderSlice';
import { useNavigate } from 'react-router-dom';
import { userSelector } from '../../services/slices/authSlice/authSlice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */

  const constructorItems = useSelector(stateConstructorSelector);
  const orderRequest = useSelector(isLoadingOrderSelector);
  const orderModalData = useSelector(orderSelector);
  const navigate = useNavigate();
  const user = useSelector(userSelector);
  const data: string[] = [
    ...constructorItems.ingredients.map((ingredient) => ingredient._id),
    constructorItems.bun?._id
  ].filter((id): id is string => id !== undefined);

  const dispatch = useDispatch();

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    dispatch(postOrder(data));
  };

  const closeOrderModal = () => {
    dispatch(clearOrderState());
    dispatch(resetConstructorState());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
