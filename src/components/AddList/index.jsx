import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { HexColorPicker } from 'react-colorful';
import { AiFillCloseCircle } from 'react-icons/ai';
import classNames from 'classnames';

import { useCustomContext } from '../../context';
import { AddBtn, Input, Button } from '../index';
import { initErrorPopUp } from '../../utils/popUp';
import useHttp from '../../hooks/http.hook';

import './AddList.scss';

const AddList = () => {
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
  const { state, dispatch } = useCustomContext();
  const [customColor, setCustomColor] = useState(DEFAULT_CUSTOM_COLOR);
  const [selectedColorId, setSelectedColorId] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isOpenChangeColor, setChangeColorStatus] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      .then((data) => {
        dispatch({
          type: 'addList',
          payload: {
            ...data,
            tasks: [],
          },
        });
        setSelectedColorId(0);
        setInputValue('');
        setCustomColor(DEFAULT_CUSTOM_COLOR);
        setChangeColorStatus(false);
        navigate(`/list/${data.id}`);
      })
      .catch(() => initErrorPopUp())
      .finally(() => setLoading(false));
  };

  const onTogglePopup = () => {
    setChangeColorStatus(false);
    dispatch({ type: 'togglePopup' });
  };

  const onOpenCustomColorPopUp = () => {
    setSelectedColorId(colors.length);
    setChangeColorStatus((isOpenChangeColor) => !isOpenChangeColor);
  };

  return (
    <div className="add-list">
      <AddBtn onClick={onTogglePopup} text="Добавить список" title="Add list" />
      {state.isOpenPopup && (
        <div className="add-list__popup">
          <AiFillCloseCircle
            size={23}
            tabIndex={0}
            title="Close"
            onClick={() => dispatch({ type: 'togglePopup' })}
            onKeyPress={(e) => e.key === 'Enter' && dispatch({ type: 'togglePopup' })}
            className="add-list__close"
          />
          <form action="#" onSubmit={onCreateList}>
            <Input
              isRequired
              isAutofocus
              placeholder="Название списка"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <ul className="add-list__colors-block">
              {colors.map((color, index) => (
                <li
                  key={`color-${index}`}
                  tabIndex={0}
                  onClick={() => setSelectedColorId(index)}
                  onKeyPress={(e) => e.key === 'Enter' && setSelectedColorId(index)}
                  className={classNames('add-list__color', {
                    'add-list__color_active': selectedColorId === index,
                  })}
                  style={{ backgroundColor: color }}
                ></li>
              ))}
              <li
                tabIndex={0}
                onClick={() => onOpenCustomColorPopUp()}
                onKeyPress={(e) => e.key === 'Enter' && onOpenCustomColorPopUp()}
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
