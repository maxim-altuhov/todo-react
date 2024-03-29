import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';

import { LOGIN_ROUTE, REGISTRATION_ROUTE } from 'routes/index.js';
import { initResetPassword } from 'store/slices/userSlice';
import { initResetPasswordPopUp } from 'utils/popUp';
import { validateRules } from './utils/validateRules.js';
import { Button, Input } from '..';

import './Form.scss';

const FormRecovery = () => {
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

  const resetPassword = (email) => {
    dispatch(initResetPassword({ email }))
      .unwrap()
      .then(() => {
        reset();
        navigate('/', { replace: true });
        initResetPasswordPopUp();
      })
      .finally(() => setLoadingStatus(false));
  };

  const onSubmit = () => {
    const { email } = getValues();
    setLoadingStatus(true);
    resetPassword(email);
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
        <div className="form__btn">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Отправка...' : 'Сбросить пароль'}
          </Button>
        </div>
        <Link to={LOGIN_ROUTE} className="form__link">
          Войти в свой аккаунт
        </Link>
        <Link to={REGISTRATION_ROUTE} className="form__link">
          Регистрация
        </Link>
      </form>
    </>
  );
};

export default FormRecovery;
