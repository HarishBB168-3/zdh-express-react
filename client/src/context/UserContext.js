import React, { useState, useContext } from "react";

const UserContext = React.createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [enctoken, setEnctoken] = useState("");

  const isLoggedIn = () => {
    return enctoken ? true : false;
  };

  const saveUserAndTokenInLocal = () => {
    localStorage.setItem("user", user);
    localStorage.setItem("enctoken", enctoken);
  };

  const removeUserAndTokenInLocal = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("enctoken");
  };

  const loadUserAndtokenFromLocal = () => {
    setUser(localStorage.getItem("user"));
    setEnctoken(localStorage.getItem("enctoken"));
  };

  const setUserAs = (user) => {
    console.log("Setting user in usercontext : ", user);
    setUser(user);
  };

  const value = {
    user,
    setUser: setUserAs,
    enctoken,
    setEnctoken,
    isLoggedIn,
    saveUserAndTokenInLocal,
    removeUserAndTokenInLocal,
    loadUserAndtokenFromLocal,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
