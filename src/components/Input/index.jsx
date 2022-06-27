import './Input.scss';

const Input = ({ onChangeValue, placeholder = 'Текст', type = 'text', required = false }) => {
  return (
    <input
      className="input-field"
      type={type}
      placeholder={placeholder}
      onChange={onChangeValue}
      required={required}
    />
  );
};

export default Input;
