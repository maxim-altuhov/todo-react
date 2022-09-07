import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AddBtn, Input, Button } from '../';
import { initAddTask } from 'store/slices/listSlice';

import './AddTask.scss';

const AddTask = () => {
  const { activeList } = useSelector((state) => state.list);
  const [isOpenForm, setStatusForm] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setLoadingStatus] = useState(false);
  const { id: listId } = activeList;
  const dispatch = useDispatch();

  const onToggleForm = () => {
    setStatusForm((isOpenForm) => !isOpenForm);
    setInputValue('');
  };

  const onAddNewTask = (e) => {
    e.preventDefault();
    setLoadingStatus(true);

    const newTask = {
      text: inputValue,
      isCompleted: false,
      controlTime: Date.now(),
    };

    dispatch(initAddTask({ listId, newTask }))
      .unwrap()
      .then(() => setInputValue(''))
      .finally(() => setLoadingStatus(false));
  };

  return (
    <>
      {!isOpenForm ? (
        <AddBtn onClick={onToggleForm} text="Новая задача" title="Добавить задачу" />
      ) : (
        <form className="task-form" autoComplete="off" onSubmit={onAddNewTask}>
          <Input
            required
            autoFocus
            autoComplete="off"
            placeholder="Текст задачи"
            value={inputValue}
            name="task-name"
            onChange={(e) => setInputValue(e.target.value.trimStart())}
          />
          <div className="task-form__btn-block">
            <div className="task-form__btn-block-item">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Добавление...' : 'Добавить'}
              </Button>
            </div>
            <div className="task-form__btn-block-item">
              <Button type="button" onClick={onToggleForm} typeBtn="cancel">
                Отмена
              </Button>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default AddTask;
