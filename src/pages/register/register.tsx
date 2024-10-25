import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/slices/authSlice/authSlice';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!userName || !email || !password) {
      setErrorText('Все поля обязательны для заполнения');
      return;
    }

    try {
      const resultAction = await dispatch(
        registerUser({
          name: userName,
          email: email,
          password: password
        })
      );

      if (registerUser.fulfilled.match(resultAction)) {
        // Если регистрация успешна — перенаправляем на главную страницу
        navigate('/');
      } else {
        setErrorText(resultAction.error?.message || 'Ошибка регистрации');
      }
    } catch (error) {
      setErrorText('Произошла ошибка. Попробуйте снова.');
    }
  };

  return (
    <RegisterUI
      errorText={errorText}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
