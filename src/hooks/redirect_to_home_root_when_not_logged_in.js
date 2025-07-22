import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export const useRedirectToHomeRootWhenNotLoggedIn = () => {
  const navigate = useNavigate();
  const loggedIn = localStorage.getItem('isLoggedIn');

  useEffect(() => {
    // Nie przekierowuj jeśli jesteśmy na stronie resetowania hasła
    if (!loggedIn && window.location.pathname !== '/reset_password') {
      navigate('/');
    }
  }, [loggedIn]);
};