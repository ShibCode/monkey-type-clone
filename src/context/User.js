"use client";

import { useState, createContext, useContext } from "react";

const UserContext = createContext();

export const useUser = () => {
  const { user, loginUser, logoutUser } = useContext(UserContext);
  return { user, loginUser, logoutUser };
};

export const useStats = () => {
  const { stats, setStats } = useContext(UserContext);
  return { stats, setStats };
};

const User = ({ children, setIsLoaded }) => {
  const [stats, setStats] = useState(null);
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
    localStorage.removeItem("monkey-type-clone-user");
  };

  return (
    <UserContext.Provider
      value={{ user, loginUser, logoutUser, stats, setStats }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default User;
