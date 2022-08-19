import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';

import { initSignInUser, initCreateUser } from 'store/slices/userSlice';
import { Button, Input } from '../';

import './Form.scss';

const Form = ({ isLoginForm }) => {
  const [isLoading, setLoadingStatus] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    reset,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  });

  const validateRules = {
    length: {
      value: 6,
      message: 'Должно быть минимум 6 символов',
    },
    patternEmail: {
      value: /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/,
      message: 'Некорректный E-mail',
    },
    patternPassword: {
      value: /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/,
      message: 'Пароль должен состоять из латинских букв и цифр',
    },
  };

  const initSubmitUserInfo = (email, password) => {
    dispatch(
      isLoginForm ? initSignInUser({ email, password }) : initCreateUser({ email, password }),
    )
      .unwrap()
      .then(() => {
        navigate('/', { replace: true });
        reset();
      })
      .finally(() => setLoadingStatus(false));
  };

  const onSubmit = () => {
    const { email, password } = getValues();
    setLoadingStatus(true);
    initSubmitUserInfo(email, password);
  };

  return (
    <>
      <form className="form" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <p className="form__title">{isLoginForm ? 'Авторизация' : 'Регистрация'}</p>
        <div className="form__group">
          <label className={classNames('form__label', { form__label_type_error: errors?.email })}>
            E-mail
            <Input
              type="email"
              placeholder="Введите E-mail"
              {...register('email', {
                required: 'Введите E-mail',
                pattern: !isLoginForm && validateRules.patternEmail,
              })}
            />
          </label>
          <>{errors?.email && <p className="form__error">{errors?.email?.message}</p>}</>
        </div>
        <div className="form__group">
          <label
            className={classNames('form__label', {
              form__label_type_error: errors?.password,
            })}
          >
            Пароль
            <Input
              type={isLoginForm ? 'password' : 'text'}
              placeholder="Введите пароль"
              {...register('password', {
                required: 'Введите пароль',
                minLength: !isLoginForm && validateRules.length,
                pattern: !isLoginForm && validateRules.patternPassword,
              })}
            />
          </label>
          <>{errors?.password && <p className="form__error">{errors?.password?.message}</p>}</>
        </div>
        <div className="form__btn">
          <Button
            type="submit"
            disabled={isLoading}
            text={
              isLoading ? 'Отправка...' : isLoginForm ? 'Войти в аккаунт' : 'Зарегистрироваться'
            }
          />
        </div>
        <Link to={isLoginForm ? '/reg' : '/sign-in'} className="form__link">
          {isLoginForm ? 'Регистрация' : 'Войти в свой аккаунт'}
        </Link>
      </form>
    </>
  );
};

export default Form;
