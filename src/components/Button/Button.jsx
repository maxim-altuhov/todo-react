import classNames from 'classnames';

import './Button.scss';

const Button = ({
  onClick,
  type = 'button',
  text = '',
  typeBtn = 'confirm',
  isDisabled = false,
  children,
  ...rest
}) => {
  return (
    <button
      className={classNames('button', {
        button_type_confirm: typeBtn === 'confirm',
        button_type_cancel: typeBtn === 'cancel',
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
