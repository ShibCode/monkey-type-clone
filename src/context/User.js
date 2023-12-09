"use client";

import { useState, createContext, useEffect } from "react";

export const UserContext = createContext();

const User = ({ children }) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("monkey-type-clone-user"));
    if (user) setUser(user);
  }, []);

  const updateUser = (newUser) => {
    setUser(newUser);
    localStorage.setItem("monkey-type-clone-user", JSON.stringify(newUser));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default User;
