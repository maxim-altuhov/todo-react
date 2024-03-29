import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { HexColorPicker } from 'react-colorful';
import { AiFillCloseCircle } from 'react-icons/ai';
import classNames from 'classnames';

import { AddBtn, Input, Button } from '../';
import { initCreateList, togglePopup } from 'store/slices/listSlice';

import './AddList.scss';

const AddList = () => {
  const DEFAULT_CUSTOM_COLOR = '#2a6fb5';
  const { isOpenPopup } = useSelector((state) => state.list);
  const [colors] = useState([
    '#42B883',
    '#64C4ED',
    '#FFBBCC',
    '#B6E6BD',
    '#C355F5',
    '#110133',
    '#FF6464',
  ]);
  const [customColor, setCustomColor] = useState(DEFAULT_CUSTOM_COLOR);
  const [selectedColorId, setSelectedColorId] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isOpenChangeColor, setChangeColorStatus] = useState(false);
  const [isLoading, setLoadingStatus] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onCreateList = (e) => {
    e.preventDefault();
    setLoadingStatus(true);

    const selectedColor = colors[selectedColorId];
    const newList = {
      name: inputValue,
      color: selectedColor || customColor,
      controlTime: Date.now(),
    };

    dispatch(initCreateList(newList))
      .unwrap()
      .then(({ payload }) => {
        setSelectedColorId(0);
        setInputValue('');
        setCustomColor(DEFAULT_CUSTOM_COLOR);
        setChangeColorStatus(false);
        navigate(`/${payload.id}`, { replace: true });
      })
      .finally(() => setLoadingStatus(false));
  };

  const onTogglePopup = useCallback(() => {
    setChangeColorStatus(false);
    dispatch(togglePopup());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <form onSubmit={onCreateList} autoComplete="off">
            <Input
              required
              autoFocus
              autoComplete="off"
              placeholder="Название списка"
              value={inputValue}
              name="list-name"
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

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Добавление...' : 'Добавить'}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddList;
