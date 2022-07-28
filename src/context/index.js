import { createContext, useContext } from 'react';

const dataContext = createContext();

const useCustomContext = () => {
  return useContext(dataContext);
};

export { dataContext, useCustomContext };
