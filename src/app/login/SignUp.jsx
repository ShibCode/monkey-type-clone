"use client";

import { useState, useContext } from "react";
import Input from "./Input";
import Button from "./Button";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { post } from "@/utils/post";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/User";

const SignUp = () => {
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    verifyEmail: "",
    password: "",
    verifyPassword: "",
  });

  const router = useRouter();

  const { updateUser } = useContext(UserContext);

  const handleInput = (e) => {
    setUserInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userInfo.email !== userInfo.verifyEmail) return;
    if (userInfo.password !== userInfo.verifyPassword) return;

    const res = await post("/register", userInfo);

    if (res.success) {
      updateUser(res.user);
      router.push("/");
    }
  };

  return (
    <form
      className="flex flex-col gap-2 w-full max-w-[225px]"
      onSubmit={handleSubmit}
    >
      <p className="text-tertiary">register</p>
      <Input
        name="username"
        placeholder="username"
        value={userInfo.username}
        onChange={handleInput}
      />
      <Input
        name="email"
        placeholder="email"
        value={userInfo.email}
        onChange={handleInput}
      />
      <Input
        name="verifyEmail"
        placeholder="verify email"
        value={userInfo.verifyEmail}
        onChange={handleInput}
      />
      <Input
        type="password"
        name="password"
        placeholder="password"
        value={userInfo.password}
        onChange={handleInput}
      />
      <Input
        type="password"
        name="verifyPassword"
        placeholder="verify password"
        value={userInfo.verifyPassword}
        onChange={handleInput}
      />
      <Button text="Sign Up" icon={faUserPlus} />
    </form>
  );
};

export default SignUp;
