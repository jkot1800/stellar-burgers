import orderReducer, {
  getFeeds,
  getOrders,
  getOrderByNum,
  postOrder,
  clearOrderState
} from './orderSlice';
import { TOrder } from '@utils-types';
import { TNewOrderResponse } from '../../../utils/burger-api';

describe('Тест orderSlice', () => {
  const initialState = {
    order: null as TOrder | null,
    name: null as string | null,
    error: null as string | null | undefined,
    isLoading: false,
    orders: [] as TOrder[],
    orderModal: [] as TOrder[],
    profileOrders: [] as TOrder[],
    total: null as number | null,
    totalToday: null as number | null
  };

  // Тест обработки начального состояния
  it('должен установить начальное состояние', () => {
    expect(orderReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  // Тесты для getFeeds
  describe('Тесты для getFeeds', () => {
    it('должен установить isLoading в true при getFeeds.pending', () => {
      const nextState = orderReducer(
        initialState,
        getFeeds.pending('', undefined)
      );
      expect(nextState.isLoading).toBe(true);
      expect(nextState.error).toBeNull();
    });

    it('должен записывать заказы, total и totalToday при getFeeds.fulfilled', () => {
      const payload = {
        success: true,
        orders: [
          {
            _id: '1',
            status: 'done',
            name: 'Order 1',
            createdAt: '',
            updatedAt: '',
            number: 1,
            ingredients: []
          }
        ],
        total: 100,
        totalToday: 10
      };
      const nextState = orderReducer(
        initialState,
        getFeeds.fulfilled(payload, '', undefined)
      );
      expect(nextState.orders).toEqual(payload.orders);
      expect(nextState.total).toBe(100);
      expect(nextState.totalToday).toBe(10);
      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBeNull();
    });

    it('должен записывать ошибку и устанавливать isLoading в false при getFeeds.rejected', () => {
      const errorMessage = 'Failed to load feeds';
      const nextState = orderReducer(
        initialState,
        getFeeds.rejected(new Error(errorMessage), '', undefined)
      );
      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBe(errorMessage);
      expect(nextState.orders).toEqual([]);
      expect(nextState.total).toBe(0);
      expect(nextState.totalToday).toBe(0);
    });
  });

  // Тесты для getOrders
  describe('Тесты для getOrders', () => {
    it('должен установить isLoading в true при getOrders.pending', () => {
      const nextState = orderReducer(
        initialState,
        getOrders.pending('', undefined)
      );
      expect(nextState.isLoading).toBe(true);
    });

    it('должен записывать profileOrders и устанавливать isLoading в false при getOrders.fulfilled', () => {
      const payload = [
        {
          _id: '1',
          status: 'done',
          name: 'Profile Order 1',
          createdAt: '',
          updatedAt: '',
          number: 2,
          ingredients: []
        }
      ];
      const nextState = orderReducer(
        initialState,
        getOrders.fulfilled(payload, '', undefined)
      );
      expect(nextState.profileOrders).toEqual(payload);
      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBeNull();
    });

    it('должен записывать ошибку и устанавливать isLoading в false при getOrders.rejected', () => {
      const errorMessage = 'Failed to load orders';
      const nextState = orderReducer(
        initialState,
        getOrders.rejected(new Error(errorMessage), '', undefined)
      );
      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBe(errorMessage);
    });
  });

  // Тесты для getOrderByNum
  describe('Тесты для getOrderByNum', () => {
    it('должен установить isLoading в true и error в null при getOrderByNum.pending', () => {
      const nextState = orderReducer(
        initialState,
        getOrderByNum.pending('', 123)
      );
      expect(nextState.isLoading).toBe(true);
      expect(nextState.error).toBeNull();
    });

    it('должен записывать orderModal и устанавливать isLoading в false при getOrderByNum.fulfilled', () => {
      const payload = {
        success: true,
        orders: [
          {
            _id: '1',
            status: 'done',
            name: 'Order by Number',
            createdAt: '',
            updatedAt: '',
            number: 123,
            ingredients: []
          }
        ]
      };
      const nextState = orderReducer(
        initialState,
        getOrderByNum.fulfilled(payload, '', 123)
      );
      expect(nextState.orderModal).toEqual(payload.orders);
      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBeNull();
    });

    it('должен записывать ошибку и устанавливать isLoading в false при getOrderByNum.rejected', () => {
      const errorMessage = 'Failed to load order by number';
      const nextState = orderReducer(
        initialState,
        getOrderByNum.rejected(new Error(errorMessage), '', 123)
      );
      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBe(errorMessage);
    });
  });

  // Тесты для postOrder
  describe('Тесты для postOrder', () => {
    it('должен установить isLoading в true и error в null при postOrder.pending', () => {
      const nextState = orderReducer(initialState, postOrder.pending('', []));
      expect(nextState.isLoading).toBe(true);
      expect(nextState.error).toBeNull();
    });

    it('должен записывать order и name при postOrder.fulfilled', () => {
      const payload: TNewOrderResponse = {
        success: true, // Обязательное свойство
        order: {
          _id: '1',
          status: 'done',
          name: 'New Order',
          createdAt: '',
          updatedAt: '',
          number: 124,
          ingredients: []
        },
        name: 'New Order'
      };
      const nextState = orderReducer(
        initialState,
        postOrder.fulfilled(payload, '', [])
      );
      expect(nextState.order).toEqual(payload.order);
      expect(nextState.name).toBe('New Order');
      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBeNull();
    });

    it('должен записывать ошибку и устанавливать isLoading в false при postOrder.rejected', () => {
      const errorMessage = 'Failed to post order';
      const nextState = orderReducer(
        initialState,
        postOrder.rejected(new Error(errorMessage), '', [])
      );
      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBe(errorMessage);
    });
  });

  // Тест для clearOrderState
  it('должен сбросить состояние order и name при вызове clearOrderState', () => {
    const stateWithOrder = {
      ...initialState,
      order: {
        _id: '1',
        status: 'done',
        name: 'Existing Order',
        createdAt: '',
        updatedAt: '',
        number: 125,
        ingredients: []
      },
      name: 'Existing Order'
    };
    const nextState = orderReducer(stateWithOrder, clearOrderState());
    expect(nextState.order).toBeNull();
    expect(nextState.name).toBeNull();
  });
});
