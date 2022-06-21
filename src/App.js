import listIcon from './assets/img/list.svg';

function App() {
  return (
    <div className="todo">
      <div className="todo__sidebar">
        <ul className="todo__list">
          <li className="todo__list-item todo__list-item_active">
            <i className="todo__list-icon">
              <img src={listIcon} alt="List icon" />
            </i>
            <span className="todo__list-label">Все задачи</span>
          </li>
        </ul>
      </div>
      <div className="todo__tasks">456</div>
    </div>
  );
}

export default App;
