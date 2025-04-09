"use client";

import { useState, createContext, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import nookies from "nookies";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

const User = ({ children }) => {
  const [user, setUser] = useState();

  const router = useRouter();

  const fetchUser = async (token) => {
    const response = await fetch("/api/auth", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (data.success) setUser(data.user);
    else logout();
  };

  useEffect(() => {
    const { token } = nookies.get();

    if (token) fetchUser(token);
    else setUser(null);
  }, []);

  function login(user, token) {
    router.push("/");
    setUser(user);
    nookies.set(null, "token", token, {
      maxAge: 60 * 60 * 24 * 365 * 10, // 10 years
    });
  }

  function logout() {
    router.push("/login");
    setUser(null);
    nookies.destroy(null, "token");
  }

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default User;
