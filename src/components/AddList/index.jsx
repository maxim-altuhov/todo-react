import { useState } from 'react';
import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import { HexColorPicker } from 'react-colorful';

import { useHttp } from '../../hooks/http.hook';
import { List, Input, Button } from '../index.js';
import { popUpError } from '../../utils/popUp';

import './AddList.scss';

const AddList = ({ colors, onAdd, onMenuStatus, setStatusPopup, isOpenMenu, isOpenPopup }) => {
  const { request } = useHttp();

  const DEFAULT_CUSTOM_COLOR = '#2a6fb5';
  const [customColor, setCustomColor] = useState(DEFAULT_CUSTOM_COLOR);
  const [selectedColorId, setSelectedColor] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [isOpenChangeColor, setChangeColorStatus] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const onCreateList = (e) => {
    e.preventDefault();
    const selectedColor = colors[selectedColorId - 1]?.hex;

    const newList = {
      id: uuidv4(),
      name: inputValue,
      color: selectedColor || customColor,
    };

    setLoading(true);

    request('http://localhost:3001/lists', 'POST', JSON.stringify(newList))
      .then(() => {
        onAdd({
          ...newList,
          tasks: [],
        });
        setSelectedColor(1);
        setInputValue('');
        setCustomColor(DEFAULT_CUSTOM_COLOR);
        setChangeColorStatus(false);
      })
      .catch(() => {
        popUpError.fire({
          title: 'Не удалось создать список!',
        });
      })
      .finally(() => setLoading(false));
  };

  const onSetStatusPopup = () => {
    setChangeColorStatus(false);
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
              <li
                onClick={() => {
                  setSelectedColor(colors.length + 1);
                  setChangeColorStatus((isOpenChangeColor) => !isOpenChangeColor);
                }}
                className={classNames('add-list__color-add', {
                  'add-list__color-add_active': selectedColorId === colors.length + 1,
                })}
                style={{ '--color-var': customColor }}
              >
                +
              </li>
            </ul>
            {isOpenChangeColor && (
              <HexColorPicker
                color={customColor}
                onChange={(color) => {
                  setSelectedColor(colors.length + 1);
                  setCustomColor(color);
                }}
              />
            )}

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
