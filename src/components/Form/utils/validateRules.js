export const validateRules = {
  length: {
    value: 6,
    message: 'Должно быть минимум 6 символов',
  },
  patternEmail: {
    value: /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/,
    message: 'Некорректный E-mail',
  },
  patternPassword: {
    value: /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/,
    message: 'Пароль должен состоять из латинских букв и цифр',
  },
};
