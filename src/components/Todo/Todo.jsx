import { useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';

import { Task, UserInfo } from 'components';

import './Todo.scss';

const Todo = () => {
  const { lists, activeList } = useSelector((state) => state.list);

  return (
    <div className="todo">
      <UserInfo />
      {lists && activeList ? (
        <Routes>
          <Route path=":id" element={<Task />}></Route>
        </Routes>
      ) : (
        <p className="todo__title">Список не выбран</p>
      )}
    </div>
  );
};

export default Todo;
