import './Input.scss';

const Input = ({
  onChangeValue,
  value,
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
      onChange={onChangeValue}
      required={isRequired}
      autoFocus={isAutofocus}
    />
  );
};

export default Input;
