import classNames from 'classnames';

import './Button.scss';

const Button = ({
  onClick,
  type = 'button',
  text = 'Текст',
  theme = 'green',
  disabled = false,
}) => {
  return (
    <button
      className={classNames('button', {
        button_color_green: theme === 'green',
        button_color_gray: theme === 'gray',
      })}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
