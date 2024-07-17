"use client";

import SignIn from "./SignIn";
import SignUp from "./SignUp";

const Login = () => {
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
