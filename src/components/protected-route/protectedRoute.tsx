import { Preloader } from '@ui';
import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router';
import {
  authCheckedSelector,
  userSelector
} from '../../services/slices/authSlice/authSlice';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  component: React.JSX.Element;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  component
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(authCheckedSelector);
  const user = useSelector(userSelector);
  const location = useLocation();

  // Если проверка аутентификации ещё не завершена — показываем прелоадер
  if (!isAuthChecked) return <Preloader />;

  // Если маршрут только для неаутентифицированных, но пользователь уже аутентифицирован
  if (onlyUnAuth && user) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} />;
  }

  // Если маршрут для аутентифицированных, но пользователь не аутентифицирован
  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  // Если все условия удовлетворены, рендерим переданный компонент
  return component;
};

export const OnlyAuth = ({ component }: { component: React.JSX.Element }) => (
  <ProtectedRoute component={component} />
);

export const OnlyUnAuth = ({ component }: { component: React.JSX.Element }) => (
  <ProtectedRoute onlyUnAuth component={component} />
);
