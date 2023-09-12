"use client";

import { useEffect, useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { useRouter } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import onLoad from "@/utils/onLoad";
const Login = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [colorsLoaded, setColorsLoaded] = useState(false);

  const router = useRouter();

  useEffect(() => {
    onLoad(setColorsLoaded);

    if (localStorage.getItem("user")) router.push("/");
    else setIsLoaded(true);
  }, []);

  return isLoaded ? (
    <div className="wrapper flex items-center mt-[150px]">
      <div className="flex contain justify-around">
        <SignUp />
        <SignIn />
      </div>
    </div>
  ) : (
    <LoadingPage colorsLoaded={colorsLoaded} />
  );
};

export default Login;
