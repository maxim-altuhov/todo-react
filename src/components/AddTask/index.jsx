import { useState } from 'react';
import { useHttp } from '../../hooks/http.hook';
import { v4 as uuidv4 } from 'uuid';

import { Input, Button } from '../index.js';

import addSvg from '../../assets/img/add.svg';
import './AddTask.scss';

const AddTask = ({ list, onAddTasks }) => {
  const { request } = useHttp();
  const [isLoading, setLoading] = useState(false);
  const [isOpenForm, setStatusForm] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const toggleForm = () => {
    setStatusForm(!isOpenForm);
    setInputValue('');
  };

  const onAddNewTask = (e) => {
    e.preventDefault();

    const newTask = {
      id: uuidv4(),
      listId: list.id,
      text: inputValue,
      completed: false,
    };

    setLoading(true);

    request('http://localhost:3001/tasks', 'POST', JSON.stringify(newTask))
      .then((data) => {
        onAddTasks(list.id, data);
        toggleForm();
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  return (
    <>
      {!isOpenForm ? (
        <div onClick={toggleForm} className="add-btn">
          <img src={addSvg} alt="Add icon" />
          <span>Новая задача</span>
        </div>
      ) : (
        <form action="#" className="task-form" onSubmit={onAddNewTask}>
          <Input
            placeholder="Текст задачи"
            value={inputValue}
            onChangeValue={(e) => setInputValue(e.target.value)}
            required
          />
          <div className="task-form__btn-block">
            <div className="task-form__btn-block-item">
              <Button
                type="submit"
                text={isLoading ? 'Добавление...' : 'Добавить'}
                disabled={isLoading}
              />
            </div>
            <div className="task-form__btn-block-item">
              <Button onClick={toggleForm} text="Отмена" theme="gray" />
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default AddTask;
