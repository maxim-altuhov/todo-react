import List from './components/List';
import AddList from './components/AddList';

function App() {
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
        <List
          items={[
            {
              color: '#42B883',
              name: 'Покупки',
              isActive: true,
            },
            {
              color: '#64C4ED',
              name: 'Фронтенд',
            },
            {
              color: '#FFBBCC',
              name: 'Фильмы и сериалы',
            },
            {
              color: '#B6E6BD',
              name: 'Книги',
            },
            {
              color: '#C9D1D3',
              name: 'Личное',
            },
          ]}
        />
        <AddList />
      </div>
      <div className="todo__tasks"></div>
    </div>
  );
}

export default App;
