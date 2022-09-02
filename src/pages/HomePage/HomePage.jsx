import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, useLocation, useParams, useNavigate } from 'react-router-dom';
import { CgArrowRightR } from 'react-icons/cg';
import { RiLogoutCircleRLine } from 'react-icons/ri';
import classNames from 'classnames';

import { initFetchLists, setActiveList, toggleMenu } from 'store/slices/listSlice';
import { initRemoveUser } from 'store/slices/userSlice';
import { AddList, List, Task, Spinner, Error } from 'components';
import { popUp, popUpDefault } from 'utils/popUp';

import './HomePage.scss';

const HomePage = () => {
  const TABLET_WIDTH = 900;
  const [windowWidth, setWindowWidth] = useState(null);
  const { lists, activeList, status, isOpenMenu, error } = useSelector((state) => state.list);
  const { email } = useSelector((state) => state.user);
  const { '*': id } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(initFetchLists());
    updateWindowWidth();
    window.addEventListener('resize', updateWindowWidth);

    return () => {
      window.removeEventListener('resize', updateWindowWidth);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const list = lists.find((list) => list.id === id);

    popUp.close();
    dispatch(setActiveList(list));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lists, location.pathname]);

  const updateWindowWidth = () => {
    setWindowWidth(window.innerWidth);
  };

  const onLogOutUser = () => {
    popUpDefault.fire({
      title: 'Выйти из аккаунта?',
      confirmButtonText: 'Выйти',
      preConfirm: () => {
        dispatch(initRemoveUser())
          .unwrap()
          .then(() => navigate('/sign-in', { replace: true }));
      },
    });
  };

  return status === 'loading' ? (
    <div className="loader-block">
      <Spinner />
    </div>
  ) : (
    <div className="container-todo" style={{ display: status !== 'resolved' && 'none' }}>
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
          {error ? <Error /> : <AddList />}
        </div>
        <div className="todo__tasks">
          <button className="todo__user" onClick={onLogOutUser}>
            <span className="todo__user-name">{email}</span>
            <RiLogoutCircleRLine className="todo__user-exit" size={20} title="Выйти" />
          </button>
          {lists && activeList ? (
            <Routes>
              <Route path=":id" element={<Task />}></Route>
            </Routes>
          ) : (
            <p className="todo__tasks-title">Список не выбран</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
