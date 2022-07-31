import { GrFormClose, GrAdd } from 'react-icons/gr';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

import { useCustomContext } from '../../context';
import { popUpDefault, initErrorPopUp } from '../../utils/popUp';
import useHttp from '../../hooks/http.hook';
import './List.scss';

const List = ({ type, items = [], isRemovableList, onClick, onKeyPress }) => {
  const { request } = useHttp();
  const { state, dispatch } = useCustomContext();
  const inputItems = isRemovableList ? state.lists : items;
  const navigate = useNavigate();

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
      onKeyPress={onKeyPress}
      className={classNames('list', { 'list_type_add-btn': type === 'add-btn' })}
    >
      {inputItems.map((item) => {
        const { id, color, name, tasks } = item;

        return (
          <li
            key={`list-${id}`}
            tabIndex={0}
            onClick={isRemovableList ? () => navigate(`/list/${item.id}`) : null}
            onKeyPress={(e) => e.key === 'Enter' && isRemovableList && navigate(`/list/${item.id}`)}
            className={classNames('list__item', {
              list__item_active: state.activeList && state.activeList.id === item.id,
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
                tabIndex={0}
                className="list__close"
                onClick={(e) => onRemoveList(e, id)}
                onKeyPress={(e) => e.key === 'Enter' && onRemoveList(e, id)}
              />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
};

export default List;
