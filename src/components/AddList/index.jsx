import { useState, useEffect } from 'react';
import { useHttp } from '../../hooks/http.hook';
import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';

import List from '../List';
import Input from '../Input';
import Button from '../Button';

import './AddList.scss';

const AddList = ({ onAdd }) => {
  const { request } = useHttp();
  const [isOpenPopup, setStatusPopup] = useState(false);
  const [selectedColorId, setSelectedColor] = useState(1);
  const [colors, setColors] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    request('http://localhost:3001/colors')
      .then((data) => setColors(data))
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCreateList = (e) => {
    e.preventDefault();

    const newList = {
      id: uuidv4(),
      name: inputValue,
      colorId: selectedColorId,
      color: colors[selectedColorId - 1].hex,
    };

    request('http://localhost:3001/lists', 'POST', JSON.stringify(newList))
      .then((data) => {
        onAdd(data);
        setStatusPopup(false);
        setSelectedColor(1);
        setInputValue('');
      })
      .catch((err) => console.log(err));
  };

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
      {isOpenPopup && (
        <div className="add-list__popup">
          <button onClick={() => setStatusPopup(false)} className="add-list__close"></button>
          <form action="#" onSubmit={onCreateList}>
            <Input
              required
              placeholder="Название списка"
              type="text"
              value={inputValue}
              onChangeValue={(e) => setInputValue(e.target.value)}
            />

            <ul className="add-list__colors-block">
              {colors.map(({ id, hex }) => (
                <li
                  onClick={() => setSelectedColor(id)}
                  key={id}
                  className={classNames('add-list__color', {
                    'add-list__color_active': selectedColorId === id,
                  })}
                  style={{ backgroundColor: hex }}
                ></li>
              ))}
            </ul>

            <Button type="submit" text="Добавить" />
          </form>
        </div>
      )}
    </div>
  );
};

export default AddList;
