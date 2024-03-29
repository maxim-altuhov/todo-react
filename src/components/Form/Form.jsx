import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';

import { RECOVERY_ROUTE, REGISTRATION_ROUTE, LOGIN_ROUTE } from 'routes/index.js';
import { initSignInUser, initCreateUser } from 'store/slices/userSlice';
import { validateRules } from './utils/validateRules.js';
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
        <div className="form__group">
          <label className={classNames('form__label', { form__label_type_error: errors?.email })}>
            E-mail
            <Input
              required
              autoComplete="off"
              type="email"
              placeholder="Введите E-mail"
              {...register('email', {
                required: 'Введите E-mail',
                pattern: validateRules.patternEmail,
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
              required
              autoComplete="off"
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
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Отправка...' : isLoginForm ? 'Войти в аккаунт' : 'Зарегистрироваться'}
          </Button>
        </div>
        <Link to={isLoginForm ? REGISTRATION_ROUTE : LOGIN_ROUTE} className="form__link">
          {isLoginForm ? 'Регистрация' : 'Войти в свой аккаунт'}
        </Link>
        <Link to={RECOVERY_ROUTE} className="form__link">
          Забыли пароль?
        </Link>
      </form>
    </>
  );
};

export default Form;
