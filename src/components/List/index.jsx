import classNames from 'classnames';
import { GrFormClose, GrAdd } from 'react-icons/gr';

import { useCustomContext } from '../../context';
import { popUpDefault, initErrorPopUp } from '../../utils/popUp';
import useHttp from '../../hooks/http.hook';
import './List.scss';

const List = ({ type, items = [], isRemovableList, onClick }) => {
  const { request } = useHttp();
  const { state, dispatch } = useCustomContext();
  const inputItems = isRemovableList ? state.lists : items;

  const onRemoveList = (e, id) => {
    e.stopPropagation();

    popUpDefault.fire({
      title: 'Удалить список задач?',
      confirmButtonText: 'Удалить',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return request(`http://localhost:3001/lists/${id}`, 'DELETE')
          .then(() => dispatch({ type: 'removeList', payload: id }))
          .catch(() => initErrorPopUp());
      },
    });
  };

  return (
    <ul
      onClick={onClick}
      className={classNames('list', { 'list_type_add-btn': type === 'add-btn' })}
    >
      {inputItems.map((list) => {
        const { id, color, name, tasks } = list;

        return (
          <li
            key={`list-${id}`}
            onClick={
              isRemovableList ? () => dispatch({ type: 'setActiveList', payload: list }) : null
            }
            className={classNames('list__item', {
              list__item_active: state.activeList && state.activeList.id === list.id,
            })}
          >
            <i
              className={classNames('list__icon', {
                list__icon_colored: isRemovableList,
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
            {isRemovableList ? (
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
