import classNames from 'classnames';

import './List.scss';

const List = ({
  items,
  addClassName,
  onSetStatusPopup,
  onRemove,
  onActiveList,
  isRemovable,
  activeList,
}) => {
  return (
    <ul onClick={onSetStatusPopup} className={classNames('list', addClassName)}>
      {items.map((list) => {
        const { id, color, name, tasks } = list;

        return (
          <li
            key={`key-${id}`}
            onClick={onActiveList ? () => onActiveList(list) : null}
            className={classNames('list__item', {
              list__item_active: activeList && activeList.id === list.id,
            })}
          >
            <i
              className={classNames('list__icon', {
                list__icon_colored: isRemovable,
                'list__icon_type_add-btn': addClassName,
              })}
              style={{ backgroundColor: color }}
            ></i>
            <span className="list__label">
              {name}
              {tasks && ` (${tasks.length})`}
            </span>
            {isRemovable ? (
              <span className="list__close" onClick={(e) => onRemove(e, id)}></span>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
};

export default List;
