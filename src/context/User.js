"use client";

import { useState, createContext } from "react";

export const UserContext = createContext();

const User = ({ children }) => {
  const [user, setUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? user : {};
  });

  const updateUser = (newUser) => {
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default User;
