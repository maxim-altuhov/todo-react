import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GrFormClose } from 'react-icons/gr';
import classNames from 'classnames';

import { popUpDefault } from 'utils/popUp';
import { initRemoveList } from 'store/listsSlice';
import './List.scss';

const List = (props) => {
  const { lists, activeList, globalStatus } = useSelector((state) => state.lists);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onRemoveList = (e, id) => {
    e.stopPropagation();

    popUpDefault.fire({
      title: 'Удалить список задач?',
      preConfirm: () => {
        return dispatch(initRemoveList(id)).then(() => {
          navigate('');
        });
      },
    });
  };

  return (
    <ul {...props} className="list">
      {globalStatus === 'resolved' &&
        lists.map((item) => {
          const { id, color, name, tasks } = item;

          return (
            <li
              key={`list-${id}`}
              tabIndex={0}
              onClick={() => navigate(`/list/${item.id}`)}
              onKeyPress={(e) => e.key === 'Enter' && navigate(`/list/${item.id}`)}
              className={classNames('list__item', {
                list__item_active: activeList && activeList.id === item.id,
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
