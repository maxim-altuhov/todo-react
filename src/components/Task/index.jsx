import { HexColorPicker } from 'react-colorful';
import { TbTrashX } from 'react-icons/tb';
import { CgEditFlipH, CgCheck } from 'react-icons/cg';

import useHttp from '../../hooks/http.hook';
import { popUpDefault, popUpInput, initErrorPopUp } from '../../utils/popUp';
import { AddTask } from '../index';

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
          <CgEditFlipH size={28} title="Edit title" className="task__icon" onClick={onEditTitle} />
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
                <CgCheck size={20} color={'#fff'} />
              </label>
              <span className="task__text">{text}</span>
            </div>
            <div className="task__control">
              {!isCompleted && (
                <CgEditFlipH
                  size={22}
                  title="Edit task"
                  className="task__control-item"
                  onClick={() => onEditTask(id, text)}
                />
              )}
              <TbTrashX
                size={22}
                title="Delete"
                className="task__control-item"
                onClick={() => onRemove(id)}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Task;
