import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { HexColorPicker } from 'react-colorful';
import { AiFillCloseCircle } from 'react-icons/ai';
import classNames from 'classnames';

import { AddBtn, Input, Button } from '../';
import { createList, togglePopup } from 'store/listsSlice';

import './AddList.scss';

const AddList = () => {
  const DEFAULT_CUSTOM_COLOR = '#2a6fb5';
  const { colors, currentStatus, isOpenPopup } = useSelector((state) => state.lists);
  const [customColor, setCustomColor] = useState(DEFAULT_CUSTOM_COLOR);
  const [selectedColorId, setSelectedColorId] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isOpenChangeColor, setChangeColorStatus] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onCreateList = (e) => {
    e.preventDefault();

    const selectedColor = colors[selectedColorId];
    const newList = {
      id: uuidv4(),
      name: inputValue,
      color: selectedColor || customColor,
    };

    dispatch(createList(newList)).then(() => {
      setSelectedColorId(0);
      setInputValue('');
      setCustomColor(DEFAULT_CUSTOM_COLOR);
      setChangeColorStatus(false);
      navigate(`/list/${newList.id}`);
    });
  };

  const onTogglePopup = () => {
    setChangeColorStatus(false);
    dispatch(togglePopup());
  };

  const onOpenCustomColorPopUp = () => {
    setSelectedColorId(colors.length);
    setChangeColorStatus((isOpenChangeColor) => !isOpenChangeColor);
  };

  return (
    <div className="add-list">
      <AddBtn onClick={onTogglePopup} text="Добавить список" title="Добавить список" />
      {isOpenPopup && (
        <div className="add-list__popup">
          <AiFillCloseCircle
            size={23}
            tabIndex={0}
            title="Закрыть"
            onClick={() => dispatch(togglePopup())}
            onKeyPress={(e) => e.key === 'Enter' && dispatch(togglePopup())}
            className="add-list__close"
          />
          <form action="#" onSubmit={onCreateList}>
            <Input
              isRequired
              isAutofocus
              placeholder="Название списка"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value.trimStart())}
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
              text={currentStatus === 'loading' ? 'Добавление...' : 'Добавить'}
              isDisabled={currentStatus === 'loading'}
            />
          </form>
        </div>
      )}
    </div>
  );
};

export default AddList;
