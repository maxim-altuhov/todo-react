import './Input.scss';

const Input = ({
  onChangeValue,
  placeholder = 'Текст',
  type = 'text',
  required = false,
  autofocus = false,
}) => {
  return (
    <input
      className="input-field"
      type={type}
      placeholder={placeholder}
      onChange={onChangeValue}
      required={required}
      autoFocus={autofocus}
    />
  );
};

export default Input;
