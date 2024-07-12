"use client";

import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { post } from "@/utils/post";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/User";

const SignIn = () => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  const { loginUser } = useUser();

  const handleInput = (e) => {
    setUserInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await post("/login", userInfo);

    if (res.success) {
      loginUser(res.user);
      router.push("/");
    }
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
      />
      <Input
        type="password"
        name="password"
        placeholder="password"
        value={userInfo.password}
        onChange={handleInput}
      />
      <Button text="Sign In" icon={faRightToBracket} />
    </form>
  );
};

export default SignIn;
