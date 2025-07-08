import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export const useRedirectToHomeRootWhenNotLoggedIn = () => {
  const navigate = useNavigate();
  const loggedIn = localStorage.getItem('isLoggedIn');

  useEffect(() => {
    if (!loggedIn) {
      navigate('/');
    }
  }, [loggedIn]);
}