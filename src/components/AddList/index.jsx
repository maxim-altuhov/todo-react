import { useState } from 'react';
import { useHttp } from '../../hooks/http.hook';
import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';

import { List, Input, Button } from '../index.js';

import './AddList.scss';

const AddList = ({ onAdd, onMenuStatus, isOpenMenu, setStatusPopup, isOpenPopup, colors }) => {
  const { request } = useHttp();
  const [isLoading, setLoading] = useState(false);
  const [selectedColorId, setSelectedColor] = useState(1);
  const [inputValue, setInputValue] = useState('');

  const onCreateList = (e) => {
    e.preventDefault();

    const newList = {
      id: uuidv4(),
      name: inputValue,
      colorId: selectedColorId,
    };

    setLoading(true);

    request('http://localhost:3001/lists', 'POST', JSON.stringify(newList))
      .then(() => {
        onAdd({
          ...newList,
          color: { hex: colors[selectedColorId - 1].hex },
          tasks: [],
        });
        setSelectedColor(1);
        setInputValue('');
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  const onSetStatusPopup = () => {
    setStatusPopup((isOpenPopup) => !isOpenPopup);

    if (!isOpenMenu) onMenuStatus();
  };

  return (
    <div className="add-list">
      <List
        onSetStatusPopup={onSetStatusPopup}
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
              autofocus
              placeholder="Название списка"
              type="text"
              value={inputValue}
              onChangeValue={(e) => setInputValue(e.target.value)}
            />

            <ul className="add-list__colors-block">
              {colors ? (
                colors.map(({ id, hex }) => (
                  <li
                    onClick={() => setSelectedColor(id)}
                    key={id}
                    className={classNames('add-list__color', {
                      'add-list__color_active': selectedColorId === id,
                    })}
                    style={{ backgroundColor: hex }}
                  ></li>
                ))
              ) : (
                <span>Загрузка...</span>
              )}
            </ul>

            <Button
              type="submit"
              text={isLoading ? 'Добавление...' : 'Добавить'}
              disabled={isLoading}
            />
          </form>
        </div>
      )}
    </div>
  );
};

export default AddList;
