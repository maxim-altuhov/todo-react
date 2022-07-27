import { HexColorPicker } from 'react-colorful';

import useHttp from '../../hooks/http.hook';
import { popUpDefault, popUpInput, initErrorPopUp } from '../../utils/popUp';
import { AddTask } from '../index';

import editSvg from '../../assets/img/edit.svg';
import trashSvg from '../../assets/img/trash.svg';
import './Task.scss';

const Task = ({
  list,
  onEditListTitle,
  onAddTasks,
  onRemoveTask,
  onEditTaskText,
  onToggleStatusTask,
}) => {
  const { request } = useHttp();
  const { id, tasks, color, name } = list;

  const onEditTitle = () => {
    let newColor = color;

    popUpInput.fire({
      inputValue: name,
      html: (
        <div className="popup__block-colors">
          <HexColorPicker
            color={color}
            onChange={(color) => {
              newColor = color;
            }}
          />
        </div>
      ),
      confirmButtonText: 'Изменить',
      showLoaderOnConfirm: true,
      preConfirm: (newName) => {
        const changedValue = newName !== name || newColor !== color;

        if (newName && changedValue) {
          return request(
            `http://localhost:3001/lists/${id}`,
            'PATCH',
            JSON.stringify({
              name: newName,
              color: newColor,
            }),
          )
            .then(() => {
              onEditListTitle(id, newName, newColor);
            })
            .catch(() => initErrorPopUp());
        }
      },
    });
  };

  const onEditTask = (taskId, text) => {
    popUpInput.fire({
      inputValue: text,
      confirmButtonText: 'Изменить',
      showLoaderOnConfirm: true,
      preConfirm: (value) => {
        const changedValue = value && value !== text;

        if (changedValue) {
          return request(
            `http://localhost:3001/tasks/${taskId}`,
            'PATCH',
            JSON.stringify({
              text: value,
            }),
          )
            .then(() => {
              onEditTaskText(taskId, id, value);
            })
            .catch(() => initErrorPopUp());
        }
      },
    });
  };

  const onRemove = (taskId) => {
    popUpDefault.fire({
      title: 'Удалить задачу?',
      confirmButtonText: 'Удалить',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return request(`http://localhost:3001/tasks/${taskId}`, 'DELETE')
          .then(() => {
            onRemoveTask(taskId, id);
          })
          .catch(() => initErrorPopUp());
      },
    });
  };

  const onToggleStatus = (taskId, listId, isCompleted) => {
    onToggleStatusTask(taskId, listId, isCompleted);

    request(
      `http://localhost:3001/tasks/${taskId}`,
      'PATCH',
      JSON.stringify({ isCompleted }),
    ).catch(() => initErrorPopUp());
  };

  const initCustomSort = (firstEl, secondEl) => {
    return (
      (secondEl.isCompleted < firstEl.isCompleted) - (firstEl.isCompleted < secondEl.isCompleted) ||
      (firstEl.controlTime < secondEl.controlTime) - (secondEl.controlTime < firstEl.controlTime)
    );
  };

  return (
    <>
      <div className="task">
        <div className="task__top">
          <h2 className="task__title" style={{ color }}>
            {name}
          </h2>
          <img onClick={onEditTitle} className="task__icon" src={editSvg} alt="edit icon" />
        </div>
        {tasks && tasks.length === 0 && <p className="task__none">Задачи отсутствуют</p>}

        <AddTask key={id} list={list} onAddTasks={onAddTasks} />
        {tasks.sort(initCustomSort).map(({ id, text, isCompleted }) => (
          <div key={id} className="task__item">
            <div className="checkbox">
              <input
                className="checkbox__input"
                type="checkbox"
                name={`name-${id}`}
                id={`task-${id}`}
                onChange={() => onToggleStatus(id, list.id, !isCompleted)}
                defaultChecked={isCompleted}
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
              {!isCompleted && (
                <div className="task__control-item" onClick={() => onEditTask(id, text)}>
                  <img src={editSvg} alt="Edit icon" />
                </div>
              )}
              <div className="task__control-item" onClick={() => onRemove(id)}>
                <img src={trashSvg} alt="Remove icon" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Task;
