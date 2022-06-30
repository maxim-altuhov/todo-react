import { useHttp } from '../../hooks/http.hook';
import { AddTask } from '../index.js';

import './Task.scss';
import editSvg from '../../assets/img/edit.svg';
import removeSvg from '../../assets/img/remove.svg';

const Task = ({ list, onEditListTitle, onAddTasks, onToggleStatusTask }) => {
  const { request } = useHttp();
  const { id, tasks, color, name } = list;

  const editTitle = () => {
    const newTitle = window.prompt('Название списка', name);

    if (newTitle) {
      onEditListTitle(id, newTitle);
      request(
        `http://localhost:3001/lists/${id}`,
        'PATCH',
        JSON.stringify({
          name: newTitle,
        }),
      ).catch(() => alert('Не удалось обновить название списка!'));
    }
  };

  const toggleStatusTask = (taskId, listId, completed) => {
    onToggleStatusTask(taskId, listId, completed);

    request(`http://localhost:3001/tasks/${taskId}`, 'PATCH', JSON.stringify({ completed })).catch(
      () => alert('Не удалось обновить состояние задачи!'),
    );
  };

  return (
    <>
      <div className="task">
        <div className="task__top">
          <h2 className="task__title" style={{ color: color.hex }}>
            {name}
          </h2>
          <img onClick={editTitle} className="task__icon" src={editSvg} alt="edit icon" />
        </div>
        {tasks && tasks.length === 0 && <p className="task__none">Задачи отсутствуют</p>}
        {tasks.map(({ id, text, completed }) => (
          <div key={id} className="task__item">
            <div className="checkbox">
              <input
                className="checkbox__input"
                type="checkbox"
                name={`name-${id}`}
                id={`task-${id}`}
                onChange={() => toggleStatusTask(id, list.id, !completed)}
                defaultChecked={completed}
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
            <div className="task__control">
              <div className="task__control-item">
                <img src={editSvg} alt="Edit icon" />
              </div>
              <div className="task__control-item">
                <img src={removeSvg} alt="Remove icon" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <AddTask key={id} list={list} onAddTasks={onAddTasks} />
    </>
  );
};

export default Task;
