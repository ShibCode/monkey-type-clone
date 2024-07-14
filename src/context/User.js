"use client";

import { useState, createContext, useContext, useEffect } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

const User = ({ children, setIsLoaded }) => {
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return {};

    const localStorageUser = JSON.parse(
      localStorage.getItem("monkey-type-clone-user")
    );

    return localStorageUser ? localStorageUser : {};
  });

  const login = ({ id, username }) => {
    setUser({ id, username });
    localStorage.setItem(
      "monkey-type-clone-user",
      JSON.stringify({ id, username })
    );
  };

  const logout = () => {
    setUser({});
    localStorage.removeItem("monkey-type-clone-user");
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default User;
