import classNames from 'classnames';
import { GrFormClose, GrAdd } from 'react-icons/gr';

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
            >
              {type === 'add-btn' && <GrAdd size={22} title="Add list" />}
            </i>
            <span className="list__label">
              {name}
              {tasks && ` (${tasks.length})`}
            </span>
            {isRemovable ? (
              <GrFormClose
                size={22}
                title="Remove list"
                className="list__close"
                onClick={(e) => onRemoveList(e, id)}
              />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
};

export default List;
