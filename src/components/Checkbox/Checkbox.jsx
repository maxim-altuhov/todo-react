import { CgCheck } from 'react-icons/cg';

import './Checkbox.scss';

const Checkbox = ({ id, text, isCompleted, onChange }) => {
  return (
    <div className="checkbox">
      <input
        className="checkbox__input"
        type="checkbox"
        name={`name-${id}`}
        id={`checkbox-${id}`}
        onChange={onChange}
        defaultChecked={isCompleted}
      />
      <label className="checkbox__label" htmlFor={`checkbox-${id}`}>
        <CgCheck size={20} color={'#fff'} />
      </label>
      <span className="checkbox__text">{text}</span>
    </div>
  );
};

export default Checkbox;
