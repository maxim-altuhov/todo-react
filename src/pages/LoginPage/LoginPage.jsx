import { Form } from 'components';

const LoginPage = () => {
  return (
    <div className="container">
      <h1 className="container__title">ToDo React App</h1>
      <p className="container__subtitle">Авторизация</p>
      <Form isLoginForm />
    </div>
  );
};

export default LoginPage;
