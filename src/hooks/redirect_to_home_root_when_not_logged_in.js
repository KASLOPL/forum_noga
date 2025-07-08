import {useEffect} from "react";

export const useRedirectToHomeRootWhenNotLoggedIn = () => {
  const loggedIn = localStorage.getItem('isLoggedIn');

  useEffect(() => {
    if (!loggedIn) {
      window.location.href = '/';
    }
  }, [loggedIn]);
}