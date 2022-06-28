import classNames from 'classnames';

import './List.scss';

const List = ({ items, addClassName, onClick, onRemove, onActiveList, isRemovable }) => {
  return (
    <ul onClick={onClick} className={classNames('list', addClassName)}>
      {items.map(({ id, color, name, isActive }, i) => (
        <li
          key={`key-${id}`}
          onClick={() => {
            if (isRemovable) onActiveList(id);
          }}
          className={classNames('list__item', { list__item_active: isActive })}
        >
          <i
            className={classNames('list__icon', {
              list__icon_colored: isRemovable,
              'list__icon_type_add-btn': addClassName,
            })}
            style={{ backgroundColor: color?.hex }}
          ></i>
          <span className="list__label">{name}</span>
          {isRemovable ? (
            <span className="list__close" onClick={(e) => onRemove(e, id)}></span>
          ) : null}
        </li>
      ))}
    </ul>
  );
};

export default List;
