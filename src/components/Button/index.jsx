import './Button.scss';

const Button = ({ type = 'button', text = 'Текст' }) => {
  return (
    <button className="button" type={type}>
      {text}
    </button>
  );
};

export default Button;
