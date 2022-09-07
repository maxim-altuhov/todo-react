import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

import { setActiveList } from 'store/slices/listSlice';
import { Sidebar, Todo, Spinner } from 'components';
import { popUp } from 'utils/popUp';

import './HomePage.scss';

const HomePage = () => {
  const { lists, status } = useSelector((state) => state.list);
  const { '*': id } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const list = lists.find((list) => list.id === id);

    popUp.close();
    dispatch(setActiveList(list));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lists, location.pathname]);

  console.log('HomePage');

  return status === 'loading' ? (
    <div className="loader-block">
      <Spinner />
    </div>
  ) : (
    <div className="container-todo">
      <div className="main-block">
        <Sidebar />
        <Todo />
      </div>
    </div>
  );
};

export default HomePage;
