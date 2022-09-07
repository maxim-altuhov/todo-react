import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GrFormClose } from 'react-icons/gr';
import classNames from 'classnames';

import { popUpDefault } from 'utils/popUp';
import { initRemoveList } from 'store/slices/listSlice';
import './List.scss';

const List = (props) => {
  const { lists, activeList, status } = useSelector((state) => state.list);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onRemoveList = (e, listId) => {
    e.stopPropagation();

    popUpDefault.fire({
      title: 'Удалить список задач?',
      preConfirm: () => {
        return dispatch(initRemoveList(listId))
          .unwrap()
          .then(() => navigate('/', { replace: true }));
      },
    });
  };

  return (
    <ul {...props} className="list">
      {status === 'resolved' &&
        lists.map((item) => {
          const { id, color, name, tasks } = item;

          return (
            <li
              key={`list-${id}`}
              tabIndex={0}
              onClick={() => navigate(`/${id}`, { replace: true })}
              onKeyPress={(e) => e.key === 'Enter' && navigate(`/${id}`, { replace: true })}
              className={classNames('list__item', {
                list__item_active: activeList && activeList.id === id,
              })}
              style={{ '--color-border': color }}
            >
              <i className="list__icon" style={{ backgroundColor: color }}></i>
              <span className="list__label">
                {name}
                {tasks && ` (${tasks.length})`}
              </span>
              <GrFormClose
                size={22}
                tabIndex={0}
                title="Удалить список"
                className="list__close"
                onClick={(e) => onRemoveList(e, id)}
                onKeyPress={(e) => e.key === 'Enter' && onRemoveList(e, id)}
              />
            </li>
          );
        })}
    </ul>
  );
};

export default List;
