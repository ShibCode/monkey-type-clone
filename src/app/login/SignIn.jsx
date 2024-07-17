"use client";

import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { post } from "@/utils/post";
import { useUser } from "@/context/User";
import createToast from "@/utils/createToast";

const SignIn = () => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const [isFetching, setIsFetching] = useState(false);

  const { login } = useUser();

  const handleInput = (e) => {
    setUserInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsFetching(true);
    const res = await post("/login", userInfo);
    setIsFetching(false);

    if (res.success) {
      createToast(res.message, "success");
      login(res.user, res.token);
    } else createToast(res.message, "error");

    setUserInfo({ email: "", password: "" });
  };

  return (
    <form
      className="flex flex-col gap-2 w-full max-w-[250px]"
      onSubmit={handleSubmit}
    >
      <p className="text-tertiary">login</p>
      <Input
        name="email"
        placeholder="email"
        value={userInfo.email}
        onChange={handleInput}
        required
      />
      <Input
        type="password"
        name="password"
        placeholder="password"
        value={userInfo.password}
        onChange={handleInput}
        required
      />
      <Button text="Sign In" icon={faRightToBracket} isLoading={isFetching} />
    </form>
  );
};

export default SignIn;
