import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, useLocation } from 'react-router-dom';
import { CgArrowRightR } from 'react-icons/cg';
import classNames from 'classnames';

import { fetchLists, setActiveList, toggleMenu } from 'store/listsSlice';
import { AddList, List, Task, Spinner } from 'components';

import './App.scss';

const App = () => {
  const TABLET_WIDTH = 900;
  const [windowWidth, setWindowWidth] = useState(null);
  const { lists, activeList, globalStatus, isOpenMenu } = useSelector((state) => state.lists);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchLists());
    updateWindowWidth();
    window.addEventListener('resize', updateWindowWidth);

    return () => {
      window.removeEventListener('resize', updateWindowWidth);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(1);
    const listId = location.pathname.split('list/')[1];
    const list = lists.find((list) => list.id === listId);
    dispatch(setActiveList(list));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lists, location.pathname]);

  const updateWindowWidth = () => {
    setWindowWidth(window.innerWidth);
  };

  return globalStatus === 'loading' ? (
    <div className="spinner-block">
      <Spinner width={100} height={100} />
    </div>
  ) : (
    <div className="todo">
      <div
        className={classNames('todo__sidebar', {
          todo__sidebar_open: isOpenMenu && windowWidth <= TABLET_WIDTH,
          todo__sidebar_close: !isOpenMenu && windowWidth <= TABLET_WIDTH,
        })}
      >
        <p className="todo__sidebar-title">Список задач:</p>
        <CgArrowRightR
          size={22}
          title="Меню"
          onClick={() => dispatch(toggleMenu())}
          className="todo__sidebar-menu"
        />
        <List />
        <AddList />
      </div>
      <div className="todo__tasks">
        {lists && activeList ? (
          <Routes>
            <Route path="/list/:id" element={<Task />}></Route>
            <Route path="/" element={<p className="todo__tasks-title">Список не выбран</p>}></Route>
          </Routes>
        ) : (
          <p className="todo__tasks-title">Список не выбран</p>
        )}
      </div>
    </div>
  );
};

export default App;