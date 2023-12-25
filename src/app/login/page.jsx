"use client";

import { useEffect } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("monkey-type-clone-user")) router.push("/");
  }, []);

  return (
    <div className="wrapper flex items-center">
      <div className="flex contain justify-around absolute top-1/2 -translate-y-1/2">
        <SignUp />
        <SignIn />
      </div>
    </div>
  );
};

export default Login;
