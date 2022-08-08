import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { AddBtn, Input, Button } from '../';
import { initAddTask } from 'store/slices/listSlice';

import './AddTask.scss';

const AddTask = () => {
  const { activeList, currentStatus } = useSelector((state) => state.list);
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

    dispatch(initAddTask(newTask)).then(() => {
      onToggleForm();
    });
  };

  return (
    <>
      {!isOpenForm ? (
        <AddBtn onClick={onToggleForm} text="Новая задача" title="Добавить задачу" />
      ) : (
        <form className="task-form" onSubmit={onAddNewTask}>
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
                text={currentStatus === 'loading' ? 'Добавление...' : 'Добавить'}
                isDisabled={currentStatus === 'loading'}
              />
            </div>
            <div className="task-form__btn-block-item">
              <Button onClick={onToggleForm} text="Отмена" theme="gray" />
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default AddTask;
