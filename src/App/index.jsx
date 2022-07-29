import { useState, useEffect, useReducer } from 'react';
import { CgArrowRightR } from 'react-icons/cg';
import classNames from 'classnames';

import { AddList, List, Task, Spinner } from '../components';
import { initErrorPopUp } from '../utils/popUp';
import { dataContext } from '../context';
import useHttp from '../hooks/http.hook';
import reducer from '../reducer';

import './App.scss';

const App = () => {
  const TABLET_WIDTH = 900;
  const { request } = useHttp();
  const { Provider } = dataContext;
  const [windowWidth, setWindowWidth] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    updateWindowWidth();
    window.addEventListener('resize', updateWindowWidth);

    return () => {
      window.removeEventListener('resize', updateWindowWidth);
    };
  }, []);

  const initState = () => {
    request('http://localhost:3001/lists?_embed=tasks')
      .then((data) => dispatch({ type: 'init', payload: data }))
      .catch(() => initErrorPopUp())
      .finally(() => setLoading(false));
  };

  const [state, dispatch] = useReducer(reducer, null, initState);
  const providerState = { state, dispatch };

  const updateWindowWidth = () => {
    setWindowWidth(window.innerWidth);
  };

  return isLoading ? (
    <div className="spinner-block">
      <Spinner width={100} height={100} />
    </div>
  ) : (
    <Provider value={providerState}>
      <div className="todo">
        <div
          className={classNames('todo__sidebar', {
            todo__sidebar_open: state.isOpenMenu && windowWidth <= TABLET_WIDTH,
            todo__sidebar_close: !state.isOpenMenu && windowWidth <= TABLET_WIDTH,
          })}
        >
          <p className="todo__sidebar-title">Список задач:</p>
          <CgArrowRightR
            size={22}
            title="Menu"
            onClick={() => dispatch({ type: 'toggleMenu' })}
            className="todo__sidebar-menu"
          />
          {state.lists ? (
            <>
              <List isRemovableList />
              <AddList />
            </>
          ) : (
            <Spinner />
          )}
        </div>
        <div className="todo__tasks">
          {state.lists && state.activeList ? (
            <Task />
          ) : (
            <p className="todo__tasks-title">Список не выбран</p>
          )}
        </div>
      </div>
    </Provider>
  );
};

export default App;
