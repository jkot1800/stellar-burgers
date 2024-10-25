import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import React from 'react';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice/ingredientsSlice';
import { OnlyAuth, OnlyUnAuth } from '../protected-route/protectedRoute';
import { checkUserAuth } from '../../services/slices/authSlice/authSlice';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  React.useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(checkUserAuth());
  }, []);
  const background = location.state?.background;
  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        {/* открытые маршруты */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        {/* Защищенные маршруты для неаутентифицированных пользователей */}
        <Route path='/login' element={<OnlyUnAuth component={<Login />} />} />
        <Route
          path='/register'
          element={<OnlyUnAuth component={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={<OnlyUnAuth component={<ForgotPassword />} />}
        />
        <Route
          path='/reset-password'
          element={<OnlyUnAuth component={<ResetPassword />} />}
        />
        {/* Защищенные маршруты для аутентифицированных пользователей */}
        <Route path='/profile' element={<OnlyAuth component={<Profile />} />} />
        <Route
          path='/profile/orders'
          element={<OnlyAuth component={<ProfileOrders />} />}
        />
        <Route
          path='/profile/orders/:number'
          element={<OnlyAuth component={<OrderInfo />} />}
        />

        {/* страница 404 */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>
      {/* Модальные окна */}
      {background && (
        <Routes>
          {/* Модалка для ингредиентов */}
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title='Детали ингредиента'
                children={<IngredientDetails />}
                onClose={() => navigate('/')}
              />
            }
          />
          {/* Модалка для заказов в ленте заказов */}
          <Route
            path='/feed/:number'
            element={
              <Modal
                title='Детали заказа'
                children={<OrderInfo />}
                onClose={() => navigate('/feed')}
              />
            }
          />
          {/* Модалка для заказов в профиле */}
          <Route
            path='/profile/orders/:number'
            element={
              <Modal
                title='Детали заказа'
                children={<OrderInfo />}
                onClose={() => navigate('/profile/orders')}
              />
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
