import { useState, useEffect } from 'react';
import { useHttp } from './hooks/http.hook';

import { AddList, List, Spinner } from './components';

const App = () => {
  const { request } = useHttp();
  const [lists, setLists] = useState(null);
  const [colors, setColors] = useState(null);

  useEffect(() => {
    request('http://localhost:3001/lists?_expand=color')
      .then((data) => setLists(data))
      .catch((err) => console.log(err));

    request('http://localhost:3001/colors')
      .then((data) => setColors(data))
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAddList = (data) => {
    setLists([...lists, data]);
  };

  const onRemove = (id) => {
    if (!window.confirm('Удалить список?')) return;

    request(`http://localhost:3001/lists/${id}`, 'DELETE')
      .then(() => setLists(lists.filter((list) => list.id !== id)))
      .catch((err) => console.log(err));
  };

  return (
    <div className="todo">
      <div className="todo__sidebar">
        <List items={[{ name: 'Все задачи' }]} />
        {lists ? <List onRemove={onRemove} items={lists} /> : <Spinner />}
        <AddList onAdd={onAddList} colors={colors} />
      </div>
      <div className="todo__tasks"></div>
    </div>
  );
};

export default App;
