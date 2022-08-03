import { useDispatch, useSelector } from 'react-redux';
import { HexColorPicker } from 'react-colorful';
import { TbTrashX } from 'react-icons/tb';
import { CgEditFlipH, CgCheck } from 'react-icons/cg';

import { popUpDefault, popUpInput } from 'utils/popUp';
import { initEditTaskTitle, initEditTask, initRemoveTask, initToggleTask } from 'store/listsSlice';
import { AddTask } from '../';

import './Task.scss';

const Task = () => {
  const { activeList } = useSelector((state) => state.lists);
  const { id, tasks, color, name } = activeList;
  const dispatch = useDispatch();

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
          return dispatch(initEditTaskTitle({ id, newName, newColor }));
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
          return dispatch(initEditTask({ taskId, id, value }));
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
        return dispatch(initRemoveTask({ taskId, id }));
      },
    });
  };

  const onToggleStatus = (taskId, listId, isCompleted) => {
    dispatch(initToggleTask({ taskId, listId, isCompleted }));
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
          <CgEditFlipH
            size={28}
            tabIndex={0}
            title="Edit title"
            className="task__icon"
            onClick={onEditTitle}
            onKeyPress={(e) => e.key === 'Enter' && onEditTitle()}
          />
        </div>
        {tasks && <AddTask key={id} />}
        {tasks && tasks.length === 0 && <p className="task__none">Задачи отсутствуют</p>}
        {!tasks && <p className="task__none">Ошибка загрузки списка задач</p>}
        {tasks &&
          [...tasks].sort(initCustomSort).map(({ id, text, isCompleted }) => (
            <div key={id} className="task__item">
              <div className="checkbox">
                <input
                  className="checkbox__input"
                  type="checkbox"
                  name={`name-${id}`}
                  id={`task-${id}`}
                  onChange={() => onToggleStatus(id, activeList.id, !isCompleted)}
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
                    tabIndex={0}
                    title="Edit task"
                    className="task__control-item"
                    onClick={() => onEditTask(id, text)}
                    onKeyPress={(e) => e.key === 'Enter' && onEditTask(id, text)}
                  />
                )}
                <TbTrashX
                  size={22}
                  tabIndex={0}
                  title="Delete"
                  className="task__control-item"
                  onClick={() => onRemove(id)}
                  onKeyPress={(e) => e.key === 'Enter' && onRemove(id)}
                />
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default Task;
