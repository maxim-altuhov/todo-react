import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HexColorPicker } from 'react-colorful';
import { TbTrashX } from 'react-icons/tb';
import { MdRemoveDone } from 'react-icons/md';
import { CgPlayListRemove } from 'react-icons/cg';
import { CgEditFlipH } from 'react-icons/cg';

import { popUpDefault, popUpInput } from 'utils/popUp';
import { AddTask, Checkbox } from '../';
import {
  initEditTaskTitle,
  initEditTask,
  initRemoveTask,
  initRemoveAllTask,
  initRemoveAllCompletedTasks,
  initToggleTask,
} from 'store/slices/listSlice';

import './Task.scss';

const Task = () => {
  const { activeList, error } = useSelector((state) => state.list);
  const { id: listId, tasks, color, name } = activeList;
  const dispatch = useDispatch();

  const initCustomSort = (firstEl, secondEl) => {
    return (
      (secondEl.isCompleted < firstEl.isCompleted) - (firstEl.isCompleted < secondEl.isCompleted) ||
      (firstEl.controlTime < secondEl.controlTime) - (secondEl.controlTime < firstEl.controlTime)
    );
  };

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
          return dispatch(initEditTaskTitle({ listId, newName, newColor }));
        }
      },
    });
  };

  const onEditTask = (taskId, text) => {
    popUpInput.fire({
      inputValue: text,
      preConfirm: (newText) => {
        const isNewText = newText && newText !== text;

        if (isNewText) {
          return dispatch(initEditTask({ listId, taskId, newText }));
        }
      },
    });
  };

  const onRemove = (taskId) => {
    popUpDefault.fire({
      title: 'Удалить задачу?',
      preConfirm: () => dispatch(initRemoveTask({ listId, taskId })),
    });
  };

  const onRemoveAllTasks = () => {
    popUpDefault.fire({
      title: 'Удалить все задачи?',
      preConfirm: () => dispatch(initRemoveAllTask({ listId })),
    });
  };

  const onRemoveAllCompletedTasks = () => {
    popUpDefault.fire({
      title: 'Удалить все завершенные задачи?',
      preConfirm: () => dispatch(initRemoveAllCompletedTasks({ listId })),
    });
  };

  const onToggleStatus = (taskId, listId, isCompleted) => {
    dispatch(initToggleTask({ taskId, listId, isCompleted }));
  };

  const sortedTasks = useMemo(() => {
    return [...tasks].sort(initCustomSort);
  }, [tasks]);

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
        {!error && tasks && <AddTask key={`addTask-${listId}`} />}
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
          sortedTasks.map(({ id: taskId, text, isCompleted }) => (
            <div key={taskId} className="task__item">
              <Checkbox
                id={taskId}
                text={text}
                onChange={() => onToggleStatus(taskId, activeList.id, !isCompleted)}
                isCompleted={isCompleted}
              />
              <div className="task__control">
                {!isCompleted && (
                  <CgEditFlipH
                    size={22}
                    tabIndex={0}
                    title="Редактировать"
                    className="task__control-item"
                    onClick={() => onEditTask(taskId, text)}
                    onKeyPress={(e) => e.key === 'Enter' && onEditTask(taskId, text)}
                  />
                )}
                <TbTrashX
                  size={22}
                  tabIndex={0}
                  title="Удалить"
                  className="task__control-item"
                  onClick={() => onRemove(taskId)}
                  onKeyPress={(e) => e.key === 'Enter' && onRemove(taskId)}
                />
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default Task;
