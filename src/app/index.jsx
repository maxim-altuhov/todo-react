import { useState, useEffect } from 'react';
import classNames from 'classnames';

import useHttp from '../hooks/http.hook';
import { AddList, List, Task, Spinner } from '../components';
import { popUpDefault, initErrorPopUp } from '../utils/popUp';

import menu from '../assets/img/arrow.svg';
import './App.scss';

const App = () => {
  const TABLET_WIDTH = 900;
  const MOBILE_WIDTH = 375;

  const { request } = useHttp();
  const [lists, setLists] = useState(null);
  const [activeList, setActiveList] = useState(null);
  const [windowWidth, setWindowWidth] = useState(null);
  const [isOpenMenu, setMenuStatus] = useState(false);
  const [isOpenPopup, setPopupStatus] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    updateWindowWidth();

    request('http://localhost:3001/lists?_embed=tasks')
      .then((data) => setLists(data))
      .catch(() => initErrorPopUp())
      .finally(() => setLoading(false));

    window.addEventListener('resize', updateWindowWidth);

    return () => {
      window.removeEventListener('resize', updateWindowWidth);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateWindowWidth = () => {
    setWindowWidth(window.innerWidth);
  };

  const onAddList = (data) => {
    setLists([...lists, data]);
    setActiveList(data);
    setPopupStatus(false);
    setMenuStatus(false);
  };

  const onAddTasks = (inputListId, data) => {
    const newList = lists.map((list) => {
      if (list.id === inputListId) {
        list.tasks = [data, ...list.tasks];
      }

      return list;
    });

    setLists(newList);
  };

  const onToggleStatusTask = (inputTaskId, inputListId, isCompleted) => {
    const newList = lists.map((list) => {
      if (list.id === inputListId) {
        list.tasks = list.tasks.map((task) => {
          if (task.id === inputTaskId) task.isCompleted = isCompleted;

          return task;
        });
      }

      return list;
    });

    setLists(newList);
  };

  const onRemoveList = (e, id) => {
    e.stopPropagation();

    popUpDefault.fire({
      title: 'Удалить список задач?',
      confirmButtonText: 'Удалить',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return request(`http://localhost:3001/lists/${id}`, 'DELETE')
          .then(() => {
            setLists(lists.filter((list) => list.id !== id));
            setActiveList(null);
          })
          .catch(() => initErrorPopUp());
      },
    });
  };

  const onSetActiveList = (list) => {
    setActiveList(list);

    if (windowWidth <= MOBILE_WIDTH) {
      setPopupStatus(false);
      setMenuStatus(false);
    }
  };

  const onEditListTitle = (id, title, selectedColor) => {
    const newList = lists.map((list) => {
      if (list.id === id) {
        list.name = title;
        list.color = selectedColor;
      }

      return list;
    });

    setLists(newList);
  };

  const onEditTaskText = (inputTaskId, inputListId, newTaskText) => {
    const newList = lists.map((list) => {
      if (list.id === inputListId) {
        list.tasks = list.tasks.map((task) => {
          if (task.id === inputTaskId) task.text = newTaskText;

          return task;
        });
      }

      return list;
    });

    setLists(newList);
  };

  const onRemoveTask = (inputTaskId, inputListId) => {
    const newList = lists.map((list) => {
      if (list.id === inputListId) {
        list.tasks = list.tasks.filter((task) => task.id !== inputTaskId);
      }

      return list;
    });

    setLists(newList);
  };

  const onChangeMenuStatus = () => {
    setMenuStatus((isOpenMenu) => !isOpenMenu);

    if (isOpenPopup) setPopupStatus(false);
  };

  return isLoading ? (
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
        <img
          className="todo__sidebar-menu"
          src={menu}
          alt="menu icon"
          onClick={onChangeMenuStatus}
        />
        {lists ? (
          <>
            <List
              onRemoveList={onRemoveList}
              onSetActiveList={onSetActiveList}
              items={lists}
              activeList={activeList}
              isRemovable
            />
            <AddList
              onAddList={onAddList}
              onChangeMenuStatus={onChangeMenuStatus}
              setStatusPopup={setPopupStatus}
              isOpenPopup={isOpenPopup}
              isOpenMenu={isOpenMenu}
            />
          </>
        ) : (
          <Spinner />
        )}
      </div>
      <div className="todo__tasks">
        {lists && activeList ? (
          <Task
            onToggleStatusTask={onToggleStatusTask}
            onAddTasks={onAddTasks}
            onEditListTitle={onEditListTitle}
            onEditTaskText={onEditTaskText}
            onRemoveTask={onRemoveTask}
            list={activeList}
          />
        ) : (
          <p className="todo__tasks-title">Список не выбран</p>
        )}
      </div>
    </div>
  );
};

export default App;
