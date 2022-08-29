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
      controlTime: new Date().getTime(),
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
            placeholder="Текст задачи"
            value={inputValue}
            name="task-name"
            isRequired
            isAutofocus
            onChange={(e) => setInputValue(e.target.value.trimStart())}
          />
          <div className="task-form__btn-block">
            <div className="task-form__btn-block-item">
              <Button
                type="submit"
                text={isLoading ? 'Добавление...' : 'Добавить'}
                isDisabled={isLoading}
              />
            </div>
            <div className="task-form__btn-block-item">
              <Button onClick={onToggleForm} text="Отмена" typeBtn="cancel" />
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default AddTask;
