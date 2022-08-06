import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { Button, Input } from '../';

import './Form.scss';

const Form = ({ type = 'login' }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onTest = (data) => {
    alert(JSON.stringify(data));
    reset();
  };

  return (
    <>
      <form className="form" onSubmit={handleSubmit(onTest)}>
        <p className="form__title">{type === 'login' ? 'Авторизация' : 'Регистрация'}</p>
        <div className="form__group">
          <label className={classNames('form__label', { form__label_type_error: errors?.login })}>
            Логин
            <Input
              type="text"
              placeholder="Введите логин"
              {...register('login', {
                required: 'Введите логин',
              })}
            />
          </label>
          <>{errors?.login && <p className="form__error">{errors?.login?.message}</p>}</>
        </div>
        <div className="form__group">
          <label
            className={classNames('form__label', {
              form__label_type_error: errors?.password,
            })}
          >
            Пароль
            <Input
              type="password"
              placeholder="Введите пароль"
              {...register('password', {
                required: 'Введите пароль',
              })}
            />
          </label>
          <>{errors?.password && <p className="form__error">{errors?.password?.message}</p>}</>
        </div>
        {type === 'reg' && (
          <div className="form__group">
            <label
              className={classNames('form__label', {
                form__label_type_error: errors?.password,
              })}
            >
              Повторите пароль
              <Input
                type="password"
                placeholder="Повторите пароль"
                {...register('passwordSecond', {
                  required: 'Повторите пароль',
                })}
              />
            </label>
            <>
              {errors?.passwordSecond && (
                <p className="form__error">{errors?.passwordSecond?.message}</p>
              )}
            </>
          </div>
        )}
        <div className="form__btn">
          <Button type="submit" text={type === 'reg' ? 'Зарегистрироваться' : 'Войти в аккаунт'} />
        </div>
        {type === 'login' ? (
          <Link to={'/reg'} className="form__link">
            Регистрация
          </Link>
        ) : (
          <Link to={'/sign-in'} className="form__link">
            Войти в свой аккаунт
          </Link>
        )}
      </form>
    </>
  );
};

export default Form;
