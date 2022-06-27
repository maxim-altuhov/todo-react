import { useState, useEffect, useCallback } from 'react';
import { useHttp } from './hooks/http.hook';

import List from './components/List';
import AddList from './components/AddList';

function App() {
  const { request } = useHttp();
  const [lists, setLists] = useState([]);

  useEffect(() => {
    request('http://localhost:3001/lists')
      .then((data) => setLists(data))
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAddList = (data) => {
    setLists([...lists, data]);
  };

  const onRemove = useCallback(
    (id) => {
      request(`http://localhost:3001/lists/${id}`, 'DELETE')
        .then(() => setLists(lists.filter((list) => list.id !== id)))
        .catch((err) => console.log(err));
    },
    [lists, request],
  );

  return (
    <div className="todo">
      <div className="todo__sidebar">
        <List
          items={[
            {
              name: 'Все задачи',
            },
          ]}
        />
        <List onRemove={onRemove} items={lists} />
        <AddList onAdd={onAddList} />
      </div>
      <div className="todo__tasks"></div>
    </div>
  );
}

export default App;
