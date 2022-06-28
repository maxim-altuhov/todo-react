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

  return (
    <div className="todo">
      <div className="todo__sidebar">
        <List items={[{ name: 'Все задачи' }]} />
        {lists ? (
          <>
            <List
              onRemove={onRemove}
              onActiveList={onActiveList}
              items={lists}
              isRemovable
              activeList={activeList}
            />
            <AddList onAdd={onAddList} colors={colors} />
          </>
        ) : (
          <Spinner />
        )}
      </div>
      <div className="todo__tasks">
        {lists && activeList ? (
          <Task list={activeList} />
        ) : (
          <p className="todo__title">Список не выбран</p>
        )}
      </div>
    </div>
  );
};

export default App;
