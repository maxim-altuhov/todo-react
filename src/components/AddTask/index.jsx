import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GrAdd } from 'react-icons/gr';

import useHttp from '../../hooks/http.hook';
import { Input, Button } from '../index';
import { initErrorPopUp } from '../../utils/popUp';

import './AddTask.scss';

const AddTask = ({ list, onAddTasks }) => {
  const { request } = useHttp();
  const [isLoading, setLoading] = useState(false);
  const [isOpenForm, setStatusForm] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const onToggleForm = () => {
    setStatusForm(!isOpenForm);
    setInputValue('');
  };

  const onAddNewTask = (e) => {
    e.preventDefault();

    const newTask = {
      id: uuidv4(),
      listId: list.id,
      text: inputValue,
      isCompleted: false,
      controlTime: new Date().getTime(),
    };

    setLoading(true);

    request('http://localhost:3001/tasks', 'POST', JSON.stringify(newTask))
      .then((data) => {
        onAddTasks(list.id, data);
        onToggleForm();
      })
      .catch(() => initErrorPopUp())
      .finally(() => setLoading(false));
  };

  return (
    <>
      {!isOpenForm ? (
        <div onClick={onToggleForm} className="add-btn">
          <GrAdd size={20} title="Add task" />
          <span>Новая задача</span>
        </div>
      ) : (
        <form action="#" className="task-form" onSubmit={onAddNewTask}>
          <Input
            placeholder="Текст задачи"
            value={inputValue}
            isRequired
            isAutofocus
            onChangeValue={(e) => setInputValue(e.target.value)}
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
              <Button onClick={onToggleForm} text="Отмена" theme="gray" />
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default AddTask;
