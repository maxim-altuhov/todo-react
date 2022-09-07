import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RiLogoutCircleRLine } from 'react-icons/ri';

import { initRemoveUser } from 'store/slices/userSlice';
import { popUpDefault } from 'utils/popUp';

import './UserInfo.scss';

const UserInfo = () => {
  const { email } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onLogOutUser = () => {
    popUpDefault.fire({
      title: 'Выйти из аккаунта?',
      confirmButtonText: 'Выйти',
      preConfirm: () => {
        dispatch(initRemoveUser())
          .unwrap()
          .then(() => navigate('/sign-in', { replace: true }));
      },
    });
  };

  return (
    <button type="button" className="user-info" onClick={onLogOutUser}>
      <span className="user-info__name">{email}</span>
      <RiLogoutCircleRLine className="user-info__exit" size={20} title="Выйти" />
    </button>
  );
};

export default UserInfo;
