import React from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getFeeds,
  ordersSelector,
  isLoadingOrderSelector
} from '../../services/slices/orderSlice/orderSlice';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(ordersSelector);
  const dispatch = useDispatch();
  const isLoadingFeed = useSelector(isLoadingOrderSelector);

  React.useEffect(() => {
    dispatch(getFeeds());
  }, []);

  const handleGetFeeds = React.useCallback(() => {
    dispatch(getFeeds());
  }, []);

  //Показывает загрузку если заказы не пришли с сервера
  if (isLoadingFeed) {
    return <Preloader />;
  }

  return (
    <>
      <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />
    </>
  );
};
