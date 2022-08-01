import { useNavigate } from 'react-router-dom';
import { GrFormClose } from 'react-icons/gr';
import classNames from 'classnames';

import { useCustomContext } from '../../context';
import { popUpDefault, initErrorPopUp } from '../../utils/popUp';
import useHttp from '../../hooks/http.hook';
import './List.scss';

const List = (props) => {
  const { request } = useHttp();
  const { state, dispatch } = useCustomContext();
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
    <ul {...props} className="list">
      {state.lists &&
        state.lists.map((item) => {
          const { id, color, name, tasks } = item;

          return (
            <li
              key={`list-${id}`}
              tabIndex={0}
              onClick={() => navigate(`/list/${item.id}`)}
              onKeyPress={(e) => e.key === 'Enter' && navigate(`/list/${item.id}`)}
              className={classNames('list__item', {
                list__item_active: state.activeList && state.activeList.id === item.id,
              })}
            >
              <i className="list__icon" style={{ backgroundColor: color }}></i>
              <span className="list__label">
                {name}
                {tasks && ` (${tasks.length})`}
              </span>
              <GrFormClose
                size={22}
                tabIndex={0}
                title="Remove list"
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
