import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import { setUser } from 'store/slices/userSlice';
import { HomePage, LoginPage, RecoveryPage, RegisterPage } from 'pages';

const App = () => {
  const { isAuth } = useSelector((state) => state.user);
  const [isLoading, setLoadingStatus] = useState(true);
  const dispatch = useDispatch();
  const auth = getAuth();

  useEffect(() => {
    const observerAuthUser = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          setUser({
            email: user.email,
            id: user.uid,
            token: user.accessToken,
          }),
        );
      }

      setLoadingStatus(false);
    });

    return () => observerAuthUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isLoading ? (
    <div className="loader-block">Загрузка данных...</div>
  ) : (
    <BrowserRouter>
      <Routes>
        {isAuth ? (
          <Route path="/*" element={<HomePage />} />
        ) : (
          <>
            <Route path="/*" element={<LoginPage />} />
            <Route path="/reg" element={<RegisterPage />} />
            <Route path="/recovery" element={<RecoveryPage />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
