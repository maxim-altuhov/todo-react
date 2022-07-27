import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { HexColorPicker } from 'react-colorful';
import classNames from 'classnames';

import useHttp from '../../hooks/http.hook';
import { List, Input, Button } from '../index';
import { initErrorPopUp } from '../../utils/popUp';

import './AddList.scss';

const AddList = ({ onAddList, setStatusPopup, onChangeMenuStatus, isOpenMenu, isOpenPopup }) => {
  const [colors] = useState([
    '#42B883',
    '#64C4ED',
    '#FFBBCC',
    '#B6E6BD',
    '#C355F5',
    '#110133',
    '#FF6464',
  ]);

  const DEFAULT_CUSTOM_COLOR = '#2a6fb5';
  const { request } = useHttp();
  const [customColor, setCustomColor] = useState(DEFAULT_CUSTOM_COLOR);
  const [selectedColorId, setSelectedColorId] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isOpenChangeColor, setChangeColorStatus] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const onCreateList = (e) => {
    e.preventDefault();
    setLoading(true);

    const selectedColor = colors[selectedColorId];
    const newList = {
      id: uuidv4(),
      name: inputValue,
      color: selectedColor || customColor,
    };

    request('http://localhost:3001/lists', 'POST', JSON.stringify(newList))
      .then(() => {
        onAddList({
          ...newList,
          tasks: [],
        });
        setSelectedColorId(0);
        setInputValue('');
        setCustomColor(DEFAULT_CUSTOM_COLOR);
        setChangeColorStatus(false);
      })
      .catch(() => initErrorPopUp())
      .finally(() => setLoading(false));
  };

  const onSetStatusPopup = () => {
    setChangeColorStatus(false);
    setStatusPopup((isOpenPopup) => !isOpenPopup);

    if (!isOpenMenu) onChangeMenuStatus();
  };

  return (
    <div className="add-list">
      <List
        onSetStatusPopup={onSetStatusPopup}
        type="add-btn"
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
              isRequired
              isAutofocus
              placeholder="Название списка"
              type="text"
              value={inputValue}
              onChangeValue={(e) => setInputValue(e.target.value)}
            />
            <ul className="add-list__colors-block">
              {colors.map((color, index) => (
                <li
                  key={`color-${index}`}
                  onClick={() => setSelectedColorId(index)}
                  className={classNames('add-list__color', {
                    'add-list__color_active': selectedColorId === index,
                  })}
                  style={{ backgroundColor: color }}
                ></li>
              ))}
              <li
                onClick={() => {
                  setSelectedColorId(colors.length);
                  setChangeColorStatus((isOpenChangeColor) => !isOpenChangeColor);
                }}
                className={classNames('add-list__color-add', {
                  'add-list__color-add_active': selectedColorId === colors.length,
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
                  setSelectedColorId(colors.length);
                  setCustomColor(color);
                }}
              />
            )}

            <Button
              type="submit"
              text={isLoading ? 'Добавление...' : 'Добавить'}
              isDisabled={isLoading}
            />
          </form>
        </div>
      )}
    </div>
  );
};

export default AddList;
