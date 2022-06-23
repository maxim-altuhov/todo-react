import { useState } from 'react';
import classNames from 'classnames';

import List from '../List';

import './AddList.scss';
import data from '../../assets/db.json';

const AddList = () => {
  const [isOpenPopup, setStatusPopup] = useState(false);
  const [selectedColorId, setSelectedColor] = useState(data.colors[0].id);

  return (
    <div className="add-list">
      <List
        onClick={() => setStatusPopup((isOpenPopup) => !isOpenPopup)}
        addClassName="list_type_add-btn"
        items={[
          {
            icon: (
              <svg
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 1V15"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1 8H15"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ),
            name: 'Добавить список',
          },
        ]}
      />
      {isOpenPopup && <div className="add-list__popup">
        <button onClick={() => setStatusPopup(false)} className="add-list__close"></button>
        <form action="#">
            <input className="add-list__input" type="text" placeholder="Название списка"/>
            <ul className="add-list__colors-block">
              {data.colors.map(({id, hex}) => (
                <li
                  onClick={() => setSelectedColor(id)}
                  key={id} 
                  className={classNames("add-list__color", {"add-list__color_active": selectedColorId === id})} 
                  style={{backgroundColor: hex}}></li>
              ))}
            </ul>
            <button className="add-list__btn" type="submit">Добавить</button>
        </form>
      </div>}
      
    </div>
  )
}

export default AddList;