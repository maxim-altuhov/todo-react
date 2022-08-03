import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { AddBtn, Input, Button } from '../';
import { addNewTask } from 'store/listsSlice';

import './AddTask.scss';

const AddTask = () => {
  const { activeList, currentStatus } = useSelector((state) => state.lists);
  const [isOpenForm, setStatusForm] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const dispatch = useDispatch();

  const onToggleForm = () => {
    setStatusForm(!isOpenForm);
    setInputValue('');
  };

  const onAddNewTask = (e) => {
    e.preventDefault();

    const newTask = {
      id: uuidv4(),
      listId: activeList.id,
      text: inputValue,
      isCompleted: false,
      controlTime: new Date().getTime(),
    };

    dispatch(addNewTask(newTask)).then(() => {
      onToggleForm();
    });
  };

  return (
    <>
      {!isOpenForm ? (
        <AddBtn onClick={onToggleForm} text="Новая задача" title="Add task" />
      ) : (
        <form action="#" className="task-form" onSubmit={onAddNewTask}>
          <Input
            placeholder="Текст задачи"
            value={inputValue}
            isRequired
            isAutofocus
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div className="task-form__btn-block">
            <div className="task-form__btn-block-item">
              <Button
                type="submit"
                text={currentStatus === 'loading' ? 'Добавление...' : 'Добавить'}
                isDisabled={currentStatus === 'loading'}
              />
            </div>
            <div className="task-form__btn-block-item">
              <Button
                onClick={onToggleForm}
                text="Отмена"
                theme="gray"
                isDisabled={currentStatus === 'loading'}
              />
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default AddTask;
