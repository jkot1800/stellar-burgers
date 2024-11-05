import {
  getFeedsApi,
  getOrdersApi,
  orderBurgerApi,
  getOrderByNumberApi
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

// Thunks для работы с API

export const getFeeds = createAsyncThunk('order/getFeeds', async () => {
  const response = await getFeedsApi();
  return response;
});
export const getOrders = createAsyncThunk('order/getOrders', async () => {
  const response = await getOrdersApi();
  return response;
});
export const getOrderByNum = createAsyncThunk(
  'order/getOrderByNum',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response;
  }
);
export const postOrder = createAsyncThunk(
  'order/postOrder',
  async (data: string[]) => {
    const response = await orderBurgerApi(data);
    return response;
  }
);

// Интерфейс начального состояния
interface IOrderState {
  order: TOrder | null; // Текущий заказ
  name: string | null; // Имя заказа
  error: string | null | undefined; // Ошибка
  isLoading: boolean; // Флаг загрузки
  orders: TOrder[]; // Заказы
  orderModal: TOrder[]; // Заказы в модальном окне
  profileOrders: TOrder[]; // Заказы в профиле пользователя
  total: number | null; // Общее количество заказов
  totalToday: number | null; // Количество заказов за сегодня
}

// Начальное состояние
const initialState: IOrderState = {
  order: null,
  name: null,
  error: null,
  isLoading: false,
  orders: [],
  orderModal: [],
  profileOrders: [],
  total: null,
  totalToday: null
};

// Слайс управления состоянием заказов
export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderState: (state) => {
      state.order = null;
      state.name = null;
    }
  },
  extraReducers: (builder) => {
    //Обработка стейта для getFeeds
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getFeeds.fulfilled,
        (
          state,
          action: PayloadAction<{
            orders: TOrder[];
            total: number;
            totalToday: number;
          }>
        ) => {
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
          state.isLoading = false;
        }
      )
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        state.orders = [];
        state.totalToday = 0;
        state.total = 0;
      });
    //Обработка стейта для getOrders
    builder
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.profileOrders = action.payload;
        state.isLoading = false;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
    //Обработка стейта для getOrderByNum
    builder
      .addCase(getOrderByNum.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getOrderByNum.fulfilled,
        (state, action: PayloadAction<{ orders: TOrder[] }>) => {
          state.orderModal = action.payload.orders;
          state.isLoading = false;
        }
      )
      .addCase(getOrderByNum.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
    //Обработка стейта для postOrder
    builder
      .addCase(postOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        postOrder.fulfilled,
        (state, action: PayloadAction<{ order: TOrder; name: string }>) => {
          state.order = action.payload.order;
          state.name = action.payload.name;
          state.isLoading = false;
        }
      )
      .addCase(postOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
  // Селекторы состояний
  selectors: {
    orderSelector: (state) => state.order,
    isLoadingOrderSelector: (state) => state.isLoading,
    ordersSelector: (state) => state.orders,
    orderModalSelector: (state) => state.orderModal[0],
    profileOrdersSelector: (state) => state.profileOrders,
    totalSelector: (state) => state.total,
    totalTodaySelector: (state) => state.totalToday
  }
});

export const { clearOrderState } = orderSlice.actions;
export const {
  orderSelector,
  isLoadingOrderSelector,
  ordersSelector,
  orderModalSelector,
  profileOrdersSelector,
  totalSelector,
  totalTodaySelector
} = orderSlice.selectors;

const orderReducer = orderSlice.reducer;
export default orderReducer;
