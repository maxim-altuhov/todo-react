import { useState, useEffect } from 'react';

import { useHttp } from './hooks/http.hook';
import { AddList, List, Task, Spinner } from './components';

const App = () => {
  const { request } = useHttp();
  const [lists, setLists] = useState(null);
  const [colors, setColors] = useState(null);
  const [activeList, setActiveList] = useState(null);

  useEffect(() => {
    request('http://localhost:3001/lists?_expand=color&_embed=tasks')
      .then((data) => setLists(data))
      .catch((err) => console.log(err));

    request('http://localhost:3001/colors')
      .then((data) => setColors(data))
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAddList = (data) => {
    setLists([...lists, data]);
    setActiveList(data);
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

  const onRemove = (e, id) => {
    e.stopPropagation();

    if (!window.confirm('Удалить список?')) return;

    request(`http://localhost:3001/lists/${id}`, 'DELETE')
      .then(() => {
        setLists(lists.filter((list) => list.id !== id));
        setActiveList(null);
      })
      .catch((err) => console.log(err));
  };

  const onActiveList = (list) => {
    setActiveList(list);
  };

  const onEditListTitle = (id, title) => {
    const newList = lists.map((list) => {
      if (list.id === id) list.name = title;

      return list;
    });

    setLists(newList);
  };

  return (
    <div className="todo">
      <div className="todo__sidebar">
        <p className="todo__sidebar-title">Список задач:</p>
        {lists ? (
          <>
            <List
              onRemove={onRemove}
              onActiveList={onActiveList}
              items={lists}
              activeList={activeList}
              isRemovable
            />
            <AddList onAdd={onAddList} colors={colors} />
          </>
        ) : (
          <Spinner />
        )}
      </div>
      <div className="todo__tasks">
        {lists && activeList ? (
          <Task onAddTasks={onAddTasks} onEditListTitle={onEditListTitle} list={activeList} />
        ) : (
          <p className="todo__tasks-title">Список не выбран</p>
        )}
      </div>
    </div>
  );
};

export default App;
