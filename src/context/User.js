"use client";

import { useState, createContext, useContext, useEffect } from "react";

const UserContext = createContext();

export const useUser = () => {
  const { user, loginUser, logoutUser } = useContext(UserContext);
  return { user, loginUser, logoutUser };
};

const User = ({ children, setIsLoaded }) => {
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return {};

    const localStorageUser = JSON.parse(
      localStorage.getItem("monkey-type-clone-user")
    );

    return localStorageUser ? localStorageUser : {};
  });

  const loginUser = ({ id, username }) => {
    setIsLoaded(false);
    setUser({ id, username });
    localStorage.setItem(
      "monkey-type-clone-user",
      JSON.stringify({ id, username })
    );
  };

  const logoutUser = () => {
    setUser({});
    sessionStorage.removeItem("stats");
    localStorage.removeItem("monkey-type-clone-user");
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default User;
