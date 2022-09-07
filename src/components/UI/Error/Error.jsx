import './Error.scss';

const Error = ({ text = 'Ошибка загрузки данных!' }) => {
  return <p className="error">{text}</p>;
};

export default Error;
