import { forwardRef } from 'react';

import './Input.scss';

const Input = forwardRef(
  (
    {
      value,
      onChange,
      autocomplete = 'off',
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
        value={value}
        onChange={onChange}
        autoComplete={autocomplete}
        placeholder={placeholder}
        type={type}
        required={isRequired}
        autoFocus={isAutofocus}
        ref={ref}
        {...rest}
      />
    );
  },
);

export default Input;
