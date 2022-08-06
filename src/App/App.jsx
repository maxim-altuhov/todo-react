import { Routes, Route, BrowserRouter } from 'react-router-dom';

import { HomePage, LoginPage, RegisterPage } from 'pages';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<HomePage />}></Route>
        <Route path="/sign-in" element={<LoginPage />}></Route>
        <Route path="/reg" element={<RegisterPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
