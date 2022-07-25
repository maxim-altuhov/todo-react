import { useState, useEffect } from 'react';
import classNames from 'classnames';

import { useHttp } from './hooks/http.hook';
import { AddList, List, Task, Spinner } from './components';
import { popUpDefault, popUpError } from './utils/popUp';

import menu from './assets/img/arrow.svg';

const App = () => {
  const { request } = useHttp();
  const [lists, setLists] = useState(null);
  const [colors, setColors] = useState(null);
  const [activeList, setActiveList] = useState(null);
  const [windowWidth, setWindowWidth] = useState(null);
  const [isOpenMenu, setMenuStatus] = useState(false);
  const [isOpenPopup, setPopupStatus] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const TABLET_WIDTH = 900;
  const MOBILE_WIDTH = 375;

  useEffect(() => {
    updateWindowWidth();

    request('http://localhost:3001/lists?_embed=tasks')
      .then((data) => setLists(data))
      .catch(() => {
        popUpError.fire({
          title: 'Не удалось загрузить данные!',
          text: 'Попробуйте обновить страницу',
        });
      })
      .finally(() => setLoading(false));

    request('http://localhost:3001/colors')
      .then((data) => setColors(data))
      .catch(() => {
        popUpError.fire({
          title: 'Не удалось загрузить данные!',
          text: 'Попробуйте обновить страницу',
        });
      });

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

  const onAddTasks = (listId, data) => {
    const newList = lists.map((list) => {
      if (list.id === listId) {
        list.tasks = [...list.tasks, data];
      }

      return list;
    });

    setLists(newList);
  };

  const onToggleStatusTask = (taskId, listId, completed) => {
    const newList = lists.map((list) => {
      if (list.id === listId) {
        list.tasks = list.tasks.map((task) => {
          if (task.id === taskId) task.completed = completed;

          return task;
        });
      }

      return list;
    });

    setLists(newList);
  };

  const onRemove = (e, id) => {
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
          .catch(() => {
            popUpError.fire({
              title: 'Не удалось удалить список задач',
            });
          });
      },
    });
  };

  const onActiveList = (list) => {
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

  const onEditTaskName = (taskId, listId, newTaskName) => {
    const newList = lists.map((list) => {
      if (list.id === listId) {
        list.tasks = list.tasks.map((task) => {
          if (task.id === taskId) task.text = newTaskName;

          return task;
        });
      }

      return list;
    });

    setLists(newList);
  };

  const onRemoveTask = (taskId, listId) => {
    const newList = lists.map((list) => {
      if (list.id === listId) {
        list.tasks = list.tasks.filter((task) => task.id !== taskId);
      }

      return list;
    });

    setLists(newList);
  };

  const onMenuStatus = () => {
    setMenuStatus((isOpenMenu) => !isOpenMenu);

    if (isOpenPopup) setPopupStatus(false);
  };

  return !isLoading ? (
    <div className="todo">
      <div
        className={classNames('todo__sidebar', {
          todo__sidebar_open: isOpenMenu && windowWidth <= TABLET_WIDTH,
          todo__sidebar_close: !isOpenMenu && windowWidth <= TABLET_WIDTH,
        })}
      >
        <p className="todo__sidebar-title">Список задач:</p>
        <img className="todo__sidebar-menu" src={menu} alt="menu icon" onClick={onMenuStatus} />
        {lists ? (
          <>
            <List
              onRemove={onRemove}
              onActiveList={onActiveList}
              items={lists}
              activeList={activeList}
              isRemovable
            />
            <AddList
              onAdd={onAddList}
              onMenuStatus={onMenuStatus}
              setStatusPopup={setPopupStatus}
              isOpenPopup={isOpenPopup}
              isOpenMenu={isOpenMenu}
              colors={colors}
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
            onEditTaskName={onEditTaskName}
            onRemoveTask={onRemoveTask}
            list={activeList}
          />
        ) : (
          <p className="todo__tasks-title">Список не выбран</p>
        )}
      </div>
    </div>
  ) : (
    <div className="spinner-block">
      <Spinner width={100} height={100} />
    </div>
  );
};

export default App;
