import './Input.scss';

const Input = ({
  value,
  onChange,
  placeholder = 'Текст',
  type = 'text',
  isRequired = false,
  isAutofocus = false,
}) => {
  return (
    <input
      className="input-field"
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      required={isRequired}
      autoFocus={isAutofocus}
    />
  );
};

export default Input;
