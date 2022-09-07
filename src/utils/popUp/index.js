import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import './popUp.scss';

const popUp = withReactContent(Swal);
const TABLET_WIDTH = 900;
const isDesktop = window.innerWidth >= TABLET_WIDTH;

const popUpDefault = popUp.mixin({
  width: 320,
  padding: '10px 10px 20px 10px',
  customClass: {
    popup: 'popup',
    title: 'popup__title',
    input: 'popup__input',
    confirmButton: 'popup__button popup__button_type_confirm',
    denyButton: 'popup__button popup__button_type_deny',
  },
  buttonsStyling: false,
  focusConfirm: false,
  showDenyButton: true,
  denyButtonText: 'Отмена',
  confirmButtonText: 'Удалить',
  showLoaderOnConfirm: true,
  scrollbarPadding: isDesktop,
});

const popUpError = popUpDefault.mixin({
  icon: 'error',
  showConfirmButton: false,
  showDenyButton: false,
  showLoaderOnConfirm: false,
});

const popUpSuccess = popUpError.mixin({
  icon: 'success',
});

const popUpInput = popUpDefault.mixin({
  input: 'text',
  confirmButtonText: 'Изменить',
});

const initErrorPopUp = (error = '') => {
  popUpError.fire({
    titleText: 'Произошла ошибка загрузки данных!',
    text: 'Попробуйте обновить страницу',
    footer: `Ошибка: ${error}`,
  });
};

const initUserErrorPopUp = () => {
  popUpError.fire({
    titleText: 'Пользователь с таким E-mail не найден!',
  });
};

const initPassErrorPopUp = () => {
  popUpError.fire({
    titleText: 'Пароль неверный!',
  });
};

const initEmailErrorPopUp = () => {
  popUpError.fire({
    titleText: 'Пользователь с таким E-mail уже есть!',
  });
};

const initResetPasswordPopUp = () => {
  popUpSuccess.fire({
    titleText: 'Письмо для сброса пароля отправлено на почту!',
  });
};

export {
  popUp,
  popUpDefault,
  popUpError,
  popUpInput,
  initErrorPopUp,
  initUserErrorPopUp,
  initEmailErrorPopUp,
  initPassErrorPopUp,
  initResetPasswordPopUp,
};
