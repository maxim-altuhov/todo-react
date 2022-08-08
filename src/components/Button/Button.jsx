import classNames from 'classnames';

import './Button.scss';

const Button = ({
  onClick,
  type = 'button',
  text = '',
  theme = 'green',
  isDisabled = false,
  children,
  ...rest
}) => {
  return (
    <button
      className={classNames('button', {
        button_color_green: theme === 'green',
        button_color_gray: theme === 'gray',
      })}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      {...rest}
    >
      {text}
      {children}
    </button>
  );
};

export default Button;
