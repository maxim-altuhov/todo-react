import { useDispatch, useSelector } from 'react-redux';
import { HexColorPicker } from 'react-colorful';
import { TbTrashX } from 'react-icons/tb';
import { MdRemoveDone } from 'react-icons/md';
import { CgPlayListRemove } from 'react-icons/cg';
import { CgEditFlipH, CgCheck } from 'react-icons/cg';

import { popUpDefault, popUpInput } from 'utils/popUp';
import { AddTask } from '../';
import {
  initEditTaskTitle,
  initEditTask,
  initRemoveTask,
  initRemoveAllTask,
  initRemoveAllCompletedTasks,
  initToggleTask,
} from 'store/listsSlice';

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
      preConfirm: () => dispatch(initRemoveTask({ taskId, id })),
    });
  };

  const onRemoveAllTasks = () => {
    popUpDefault.fire({
      title: 'Удалить все задачи?',
      preConfirm: () => dispatch(initRemoveAllTask({ tasks, id })),
    });
  };

  const onRemoveAllCompletedTasks = () => {
    popUpDefault.fire({
      title: 'Удалить все завершенные задачи?',
      preConfirm: () => dispatch(initRemoveAllCompletedTasks({ tasks, id })),
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
          <h1 className="task__title" style={{ color }}>
            {name}
          </h1>
          <CgEditFlipH
            size={28}
            tabIndex={0}
            title="Редактировать"
            className="task__icon"
            onClick={onEditTitle}
            onKeyPress={(e) => e.key === 'Enter' && onEditTitle()}
          />
        </div>
        {tasks && <AddTask key={id} />}
        {tasks?.length === 0 && <p className="task__none">Задачи отсутствуют</p>}
        {!tasks && <p className="task__none">Ошибка загрузки списка задач</p>}
        {tasks?.length > 0 && (
          <div className="task__control task__control_type_remove-block">
            <CgPlayListRemove
              size={25}
              tabIndex={0}
              title="Удалить все"
              className="task__control-item"
              onClick={() => onRemoveAllTasks()}
              onKeyPress={(e) => e.key === 'Enter' && onRemoveAllTasks()}
            />
            {tasks.some((task) => task.isCompleted === true) && (
              <MdRemoveDone
                size={22}
                tabIndex={0}
                title="Удалить выполненные"
                className="task__control-item"
                onClick={() => onRemoveAllCompletedTasks()}
                onKeyPress={(e) => e.key === 'Enter' && onRemoveAllCompletedTasks()}
              />
            )}
          </div>
        )}
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
                    title="Редактировать"
                    className="task__control-item"
                    onClick={() => onEditTask(id, text)}
                    onKeyPress={(e) => e.key === 'Enter' && onEditTask(id, text)}
                  />
                )}
                <TbTrashX
                  size={22}
                  tabIndex={0}
                  title="Удалить"
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
