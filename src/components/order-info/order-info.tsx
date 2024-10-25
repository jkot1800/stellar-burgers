import { FC, useEffect, useMemo, useCallback } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { ingredientsSelector } from '../../services/slices/ingredientsSlice/ingredientsSlice';
import { getOrderByNum } from '../../services/slices/orderSlice/orderSlice';
import { useParams } from 'react-router-dom';
import {
  orderModalSelector,
  ordersSelector,
  isLoadingOrderSelector
} from '../../services/slices/orderSlice/orderSlice';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();
  const orderNumber = Number(number);

  const ingredients = useSelector(ingredientsSelector);
  const modalOrder = useSelector(orderModalSelector);
  const allOrders = useSelector(ordersSelector);
  const isLoading = useSelector(isLoadingOrderSelector);

  const orderData = useMemo(
    () =>
      allOrders.find((order) => order.number === orderNumber) ||
      (modalOrder?.number === orderNumber ? modalOrder : null),
    [allOrders, modalOrder, orderNumber]
  );

  useEffect(() => {
    if (!orderData && orderNumber) {
      dispatch(getOrderByNum(orderNumber));
    }
  }, [dispatch, orderData, orderNumber]);

  const calculateOrderInfo = useCallback(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);
    const ingredientCounts = orderData.ingredients.reduce(
      (acc, id) => {
        const ingredient = ingredients.find((ing) => ing._id === id);
        if (ingredient) {
          acc[id] = acc[id]
            ? { ...ingredient, count: acc[id].count + 1 }
            : { ...ingredient, count: 1 };
        }
        return acc;
      },
      {} as { [key: string]: TIngredient & { count: number } }
    );

    const total = Object.values(ingredientCounts).reduce(
      (sum, { price, count }) => sum + price * count,
      0
    );

    return { ...orderData, ingredientsInfo: ingredientCounts, date, total };
  }, [orderData, ingredients]);

  const orderInfo = useMemo(calculateOrderInfo, [calculateOrderInfo]);

  if (isLoading) return <Preloader />;
  if (!orderInfo) return null;

  return <OrderInfoUI orderInfo={orderInfo} />;
};
