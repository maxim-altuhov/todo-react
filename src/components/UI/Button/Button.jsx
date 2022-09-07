import classNames from 'classnames';

import './Button.scss';

const Button = ({ typeBtn = 'confirm', children, ...rest }) => {
  return (
    <button
      className={classNames('button', {
        button_type_confirm: typeBtn === 'confirm',
        button_type_cancel: typeBtn === 'cancel',
      })}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
