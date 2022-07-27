import classNames from 'classnames';

import './List.scss';

const List = ({
  items,
  type,
  activeList,
  onSetStatusPopup,
  onRemoveList,
  onSetActiveList,
  isRemovable,
}) => {
  return (
    <ul
      onClick={onSetStatusPopup}
      className={classNames('list', { 'list_type_add-btn': type === 'add-btn' })}
    >
      {items.map((list) => {
        const { id, color, name, tasks } = list;

        return (
          <li
            key={`list-${id}`}
            onClick={onSetActiveList ? () => onSetActiveList(list) : null}
            className={classNames('list__item', {
              list__item_active: activeList && activeList.id === list.id,
            })}
          >
            <i
              className={classNames('list__icon', {
                list__icon_colored: isRemovable,
                'list__icon_type_add-btn': type === 'add-btn',
              })}
              style={{ backgroundColor: color }}
            ></i>
            <span className="list__label">
              {name}
              {tasks && ` (${tasks.length})`}
            </span>
            {isRemovable ? (
              <span className="list__close" onClick={(e) => onRemoveList(e, id)}></span>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
};

export default List;
