import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';

import { initResetPassword } from 'store/slices/userSlice';
import { initResetPasswordPopUp } from 'utils/popUp';
import { Button, Input } from '..';

import './Form.scss';

const FormRecovery = ({ isLoginForm }) => {
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
    patternEmail: {
      value: /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/,
      message: 'Некорректный E-mail',
    },
  };

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
        <p className="form__title">Сбросить пароль</p>
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
        <div className="form__btn">
          <Button
            type="submit"
            disabled={isLoading}
            text={isLoading ? 'Отправка...' : 'Сбросить пароль'}
          />
        </div>
        <Link to="/sign-in" className="form__link">
          Войти в свой аккаунт
        </Link>
        <Link to="/reg" className="form__link">
          Регистрация
        </Link>
      </form>
    </>
  );
};

export default FormRecovery;
