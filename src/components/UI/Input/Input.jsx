import { forwardRef } from 'react';

import './Input.scss';

const Input = forwardRef((props, ref) => {
  return <input className="input-field" ref={ref} {...props} />;
});

export default Input;
