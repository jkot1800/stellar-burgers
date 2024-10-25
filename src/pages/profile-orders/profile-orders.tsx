import React from 'react';
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getOrders,
  profileOrdersSelector
} from '../../services/slices/orderSlice/orderSlice';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(profileOrdersSelector);
  React.useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
