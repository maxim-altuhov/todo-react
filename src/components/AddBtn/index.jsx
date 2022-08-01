import { GrAdd } from 'react-icons/gr';

import './AddBtn.scss';

const AddBtn = ({ onClick, size = 20, title = 'Add', text = '' }) => {
  return (
    <button onClick={onClick} className="add-btn">
      <GrAdd size={size} title={title} />
      <span className="add-btn__text">{text}</span>
    </button>
  );
};

export default AddBtn;
