import classNames from 'classnames';

import './Modal.scss';

const Modal = ({ active, setActive, children }) => {
  return (
    <div className={classNames('modal', { modal_active: active })} onClick={() => setActive(false)}>
      <div className="modal__content" onClick={(e) => e.stopPropagation()}>
        {children}

        <button onClick={() => setActive(false)} className="modal__close"></button>
      </div>
    </div>
  );
};

export default Modal;
