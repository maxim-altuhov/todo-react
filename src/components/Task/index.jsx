import './Task.scss';
import editSvg from '../../assets/img/edit.svg';

const Task = ({ list }) => {
  const { tasks, color, name } = list;

  return (
    <div className="task">
      <div className="task__top">
        <h2 className="task__title" style={{ color: color.hex }}>
          {name}
        </h2>
        <img className="task__icon" src={editSvg} alt="edit icon" />
      </div>
      {tasks && tasks.length === 0 && <p className="task__none">Задачи отсутствуют</p>}
      {tasks.map(({ id, text }) => (
        <div key={id} className="task__item">
          <div className="checkbox">
            <input
              className="checkbox__input"
              type="checkbox"
              name={`name-${id}`}
              id={`task-${id}`}
            />
            <label className="checkbox__label" htmlFor={`task-${id}`}>
              <svg
                width="11"
                height="8"
                viewBox="0 0 11 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.29999 1.20001L3.79999 6.70001L1.29999 4.20001"
                  stroke="#000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </label>
            <span className="task__text">{text}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Task;
