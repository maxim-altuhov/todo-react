import { useState } from 'react';
import classNames from 'classnames';

import List from '../List';
import Input from '../Input';
import Button from '../Button';

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
            name: 'Добавить список',
          },
        ]}
      />
      {isOpenPopup && <div className="add-list__popup">
        <button onClick={() => setStatusPopup(false)} className="add-list__close"></button>
        <form action="#">
            <Input placeholder="Название списка" type="text"/>
            <ul className="add-list__colors-block">
              {data.colors.map(({id, hex}) => (
                <li
                  onClick={() => setSelectedColor(id)}
                  key={id} 
                  className={classNames("add-list__color", {"add-list__color_active": selectedColorId === id})} 
                  style={{backgroundColor: hex}}></li>
              ))}
            </ul>
            <Button type="submit" text="Добавить"/>
        </form>
      </div>}
      
    </div>
  )
}

export default AddList;