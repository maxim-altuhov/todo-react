import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Routes, Route, useLocation } from 'react-router-dom';
import { CgArrowRightR } from 'react-icons/cg';
import { RiLogoutCircleRLine } from 'react-icons/ri';
import classNames from 'classnames';

import { fetchLists, setActiveList, toggleMenu } from 'store/slices/listSlice';
import { removeUser } from 'store/slices/userSlice';
import { AddList, List, Task, Spinner } from 'components';
import { useAuth } from 'hooks/useAuth';

import './HomePage.scss';

const HomePage = () => {
  const TABLET_WIDTH = 900;
  const [windowWidth, setWindowWidth] = useState(null);
  const { lists, activeList, globalStatus, isOpenMenu, error } = useSelector((state) => state.list);
  const { isAuth, email } = useAuth();
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
    const listId = location.pathname.split('list/')[1];
    const list = lists.find((list) => list.id === listId);

    dispatch(setActiveList(list));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lists, location.pathname]);

  const updateWindowWidth = () => {
    setWindowWidth(window.innerWidth);
  };

  return isAuth ? (
    globalStatus === 'loading' ? (
      <div className="spinner-block">
        <Spinner width={100} height={100} />
      </div>
    ) : (
      <div className="container-todo">
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
            {!error && <AddList />}
          </div>
          <div className="todo__tasks">
            <button className="todo__user" onClick={() => dispatch(removeUser())}>
              <span className="todo__user-name">{email}</span>
              <RiLogoutCircleRLine className="todo__user-exit" size={20} title="Выйти" />
            </button>
            {lists && activeList ? (
              <Routes>
                <Route path="list/:id" element={<Task />}></Route>
              </Routes>
            ) : (
              <p className="todo__tasks-title">Список не выбран</p>
            )}
          </div>
        </div>
      </div>
    )
  ) : (
    <Navigate to="/sign-in" />
  );
};

export default HomePage;
