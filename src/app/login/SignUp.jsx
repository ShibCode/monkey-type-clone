"use client";

import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import {
  faCheck,
  faUserPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { post } from "@/utils/post";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/User";
import useUpdateEffect from "@/hooks/useUpdateEffect";

const SignUp = () => {
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    verifyEmail: "",
    password: "",
    verifyPassword: "",
  });

  const router = useRouter();

  const { loginUser } = useUser();

  const handleInput = (e) => {
    setUserInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userInfo.email !== userInfo.verifyEmail) return;
    if (userInfo.password !== userInfo.verifyPassword) return;

    const res = await post("/register", userInfo);

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
      <p className="text-tertiary">register</p>
      <UsernameInput userInfo={userInfo} handleInput={handleInput} />
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

const UsernameInput = ({ userInfo, handleInput }) => {
  const [usernameExists, setUsernameExists] = useState("LOADING"); // LOADING, true, false

  const checkUsernameAvailability = async () => {
    const response = await post("/check-username-exists", userInfo.username);
    if (response.success) {
      if (response.exists) setUsernameExists(true);
      else setUsernameExists(false);
    }
  };

  useUpdateEffect(() => {
    setUsernameExists("LOADING");
    const id = setTimeout(checkUsernameAvailability, 200);

    return () => clearTimeout(id);
  }, [userInfo.username]);

  let tooltip = "";
  let notValid = usernameExists;

  if (userInfo.username.length === 0) notValid = false;
  else if (
    !/^[a-zA-Z-_]+$/.test(userInfo.username) ||
    userInfo.username.length > 16
  ) {
    tooltip = `Username invalid! Name cannot use special characters or contain more than 16 characters. Can include _ and - (${userInfo.username})`;
    notValid = true;
  } else if (usernameExists === true) tooltip = "Username unavailable";
  else if (usernameExists === false) tooltip = "Username available";

  return (
    <Input
      name="username"
      placeholder="username"
      value={userInfo.username}
      onChange={handleInput}
      notValid={notValid}
      tooltip={tooltip}
      icons={{ valid: faCheck, invalid: faXmark }}
    />
  );
};
