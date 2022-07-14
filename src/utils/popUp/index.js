import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import './popUp.scss';

const popUp = withReactContent(Swal);
const popUpDefault = popUp.mixin({
  width: 320,
  padding: '15px',
  customClass: {
    popup: 'popup',
    title: 'popup__title',
    confirmButton: 'popup__button popup__button_type_confirm',
    denyButton: 'popup__button popup__button_type_deny',
  },
  buttonsStyling: false,
  focusConfirm: false,
  showDenyButton: true,
});

export { popUpDefault };
