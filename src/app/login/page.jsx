"use client";

import { useEffect } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
const Login = () => {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("monkey-type-clone-user")) router.push("/");
  }, []);

  return (
    
      <div
        className="wrapper flex items-center mt-[150px]"
      >
        <div className="flex contain justify-around">
          <SignUp />
          <SignIn />
        </div>
      </div>
  );
};

export default Login;
