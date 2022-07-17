import { useState } from 'react';
import { useHttp } from '../../hooks/http.hook';
import { AddTask } from '../index.js';
import { HexColorPicker } from 'react-colorful';

import { popUpDefault, popUpError, popUpInput } from '../../utils/popUp';

import './Task.scss';
import editSvg from '../../assets/img/edit.svg';
import trashSvg from '../../assets/img/trash.svg';
import { useEffect } from 'react';

const Task = ({
  list,
  onEditListTitle,
  onAddTasks,
  onRemoveTask,
  onEditTaskName,
  onToggleStatusTask,
}) => {
  const { request } = useHttp();

  const { id, tasks, color, name } = list;
  const [customColor, setCustomColor] = useState(null);
  const [isOpenChangeColor, setChangeColorStatus] = useState(false);

  useEffect(() => {
    setCustomColor(color);
  }, [color]);

  const editTitle = () => {
    popUpInput
      .fire({
        inputValue: name,
        confirmButtonText: 'Изменить',
      })
      .then(({ isConfirmed, value }) => {
        if (isConfirmed && value) {
          request(
            `http://localhost:3001/lists/${id}`,
            'PATCH',
            JSON.stringify({
              name: value,
              color: customColor,
            }),
          )
            .then(() => {
              onEditListTitle(id, value, customColor);
            })
            .catch(() => {
              popUpError.fire({
                title: 'Не удалось обновить название списка!',
              });
            });
        }
      });
  };

  const editTask = (taskId, text) => {
    popUpInput
      .fire({
        inputValue: text,
        confirmButtonText: 'Изменить',
      })
      .then(({ isConfirmed, value }) => {
        if (isConfirmed && value) {
          request(
            `http://localhost:3001/tasks/${taskId}`,
            'PATCH',
            JSON.stringify({
              text: value,
            }),
          )
            .then(() => {
              onEditTaskName(taskId, id, value);
            })
            .catch(() => {
              popUpError.fire({
                title: 'Не удалось обновить название задачи!',
              });
            });
        }
      });
  };

  const removeTask = (taskId) => {
    popUpDefault
      .fire({
        title: 'Удалить задачу?',
        confirmButtonText: 'Удалить',
      })
      .then((result) => {
        if (result.isConfirmed) {
          request(`http://localhost:3001/tasks/${taskId}`, 'DELETE')
            .then(() => {
              onRemoveTask(taskId, id);
            })
            .catch(() => {
              popUpError.fire({
                title: 'Не удалось удалить задачу!',
              });
            });
        }
      });
  };

  const toggleStatusTask = (taskId, listId, completed) => {
    request(`http://localhost:3001/tasks/${taskId}`, 'PATCH', JSON.stringify({ completed }))
      .then(() => {
        onToggleStatusTask(taskId, listId, completed);
      })
      .catch(() => {
        popUpError.fire({
          title: 'Не удалось изменить состояние задачи!',
          text: 'Попробуйте обновить страницу',
        });
      });
  };

  return (
    <>
      <div className="task">
        <div className="task__top">
          <span
            className="task__title-color"
            onClick={() => {
              setChangeColorStatus((isOpenChangeColor) => !isOpenChangeColor);
            }}
            style={{ backgroundColor: customColor }}
          ></span>
          <h2 className="task__title" style={{ color: customColor }}>
            {name}
          </h2>
          <img onClick={editTitle} className="task__icon" src={editSvg} alt="edit icon" />
          {isOpenChangeColor && (
            <div className="task__color-block">
              <HexColorPicker
                color={customColor}
                onChange={(color) => {
                  setCustomColor(color);
                }}
              />
            </div>
          )}
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
              {!completed && (
                <div className="task__control-item" onClick={() => editTask(id, text)}>
                  <img src={editSvg} alt="Edit icon" />
                </div>
              )}
              <div className="task__control-item" onClick={() => removeTask(id)}>
                <img src={trashSvg} alt="Remove icon" />
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
