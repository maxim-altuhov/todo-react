import { useSelector, useDispatch } from 'react-redux';
import { CgArrowRightR } from 'react-icons/cg';
import classNames from 'classnames';

import { toggleMenu } from 'store/slices/listSlice';
import { AddList, List, Error } from 'components';

import './Sidebar.scss';

const Sidebar = () => {
  const { isOpenMenu, error } = useSelector((state) => state.list);
  const dispatch = useDispatch();

  console.log('Sidebar');

  return (
    <div
      className={classNames('sidebar', {
        sidebar_open: isOpenMenu,
        sidebar_close: !isOpenMenu,
      })}
    >
      <p className="sidebar__title">Список задач:</p>
      <CgArrowRightR
        size={22}
        title="Меню"
        onClick={() => dispatch(toggleMenu())}
        className="sidebar__menu"
      />
      <List />
      {error ? <Error /> : <AddList />}
    </div>
  );
};

export default Sidebar;
