import { forwardRef } from 'react';

import './Input.scss';

const Input = forwardRef(
  (
    {
      value,
      onChange,
      placeholder = 'Текст',
      type = 'text',
      isRequired = false,
      isAutofocus = false,
      ...rest
    },
    ref,
  ) => {
    return (
      <input
        className="input-field"
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required={isRequired}
        autoFocus={isAutofocus}
        ref={ref}
        {...rest}
      />
    );
  },
);

export default Input;
