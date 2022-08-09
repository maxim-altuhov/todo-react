import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import { CgArrowRightR } from 'react-icons/cg';
import { RiLogoutCircleRLine } from 'react-icons/ri';
import { getAuth, signOut } from 'firebase/auth';
import classNames from 'classnames';

import { fetchLists, setActiveList, toggleMenu } from 'store/slices/listSlice';
import { removeUser } from 'store/slices/userSlice';
import { AddList, List, Task, Spinner } from 'components';
import { popUpDefault, initErrorPopUp } from 'utils/popUp';

import './HomePage.scss';

const HomePage = () => {
  const TABLET_WIDTH = 900;
  const [windowWidth, setWindowWidth] = useState(null);
  const { lists, activeList, globalStatus, isOpenMenu, error } = useSelector((state) => state.list);
  const { email } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

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

  const onLogOutUser = () => {
    const auth = getAuth();

    popUpDefault.fire({
      title: 'Выйти из аккаунта?',
      confirmButtonText: 'Выйти',
      preConfirm: () => {
        signOut(auth)
          .then(() => {
            navigate('/sign-in');
            dispatch(removeUser());
          })
          .catch((error) => initErrorPopUp(error.message));
      },
    });
  };

  return globalStatus === 'loading' ? (
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
          <button className="todo__user" onClick={onLogOutUser}>
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
  );
};

export default HomePage;
