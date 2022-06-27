import classNames from 'classnames';

import './List.scss';

const List = ({ items, addClassName, onClick, onRemove }) => {
  return (
    <ul onClick={onClick} className={classNames('list', addClassName)}>
      {items.map(({ id, color, name, isActive }, i) => (
        <li key={i} className={classNames('list__item', { list__item_active: isActive })}>
          <i
            className={classNames('list__icon', {
              list__icon_colored: color,
              'list__icon_type_add-btn': addClassName,
            })}
            style={{ backgroundColor: color }}
          ></i>
          <span className="list__label">{name}</span>
          {color ? <span className="list__close" onClick={() => onRemove(id)}></span> : null}
        </li>
      ))}
    </ul>
  );
};

export default List;
