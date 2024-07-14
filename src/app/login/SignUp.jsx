"use client";

import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { post } from "@/utils/post";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/User";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import createToast from "@/utils/createToast";

const usernameFormat = /^[a-zA-Z-_0-9]+$/;
const passwordFormat = /(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/;
const emailFormat = /^[^\s@]+@[a-zA-Z-]+\.[a-zA-Z]{2,}$/;

const SignUp = () => {
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    verifyEmail: "",
    password: "",
    verifyPassword: "",
  });

  const [isValidated, setIsValidated] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const router = useRouter();

  const { login } = useUser();

  const handleChange = (e) => {
    const newUserInfo = { ...userInfo, [e.target.name]: e.target.value };

    setUserInfo(newUserInfo);

    setIsValidated(() => {
      const { username, email, verifyEmail, password, verifyPassword } =
        newUserInfo;

      // if any fields are empty
      if (!username || !email || !password || !verifyEmail || !verifyPassword)
        return false;

      if (email !== verifyEmail || password !== verifyPassword) return false; // if email or password do not match
      if (!usernameFormat.test(username) || username.length > 16) return false; // username validation
      if (password.length < 8 || !passwordFormat.test(password)) return false; // password validation
      if (!emailFormat.test(email)) return false; // email validation

      return true;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidated) return;

    setIsFetching(true);
    const res = await post("/register", userInfo);
    setIsFetching(false);

    if (res.success) {
      createToast(res.message, "success");
      login(res.user);
      router.push("/");
    } else createToast(res.message, "error");

    setUserInfo({
      username: "",
      email: "",
      verifyEmail: "",
      password: "",
      verifyPassword: "",
    });
  };

  return (
    <form
      className="flex flex-col gap-2 w-full max-w-[250px]"
      onSubmit={handleSubmit}
    >
      <p className="text-tertiary">register</p>
      <UsernameInput username={userInfo.username} handleChange={handleChange} />
      <Input
        type="email"
        name="email"
        placeholder="email"
        value={userInfo.email}
        onChange={handleChange}
        notValid={!emailFormat.test(userInfo.email)}
      />
      <Input
        type="email"
        name="verifyEmail"
        placeholder="verify email"
        value={userInfo.verifyEmail}
        onChange={handleChange}
        notValid={userInfo.email !== userInfo.verifyEmail}
      />
      <PasswordInput password={userInfo.password} handleChange={handleChange} />
      <Input
        type="password"
        name="verifyPassword"
        placeholder="verify password"
        value={userInfo.verifyPassword}
        onChange={handleChange}
        notValid={userInfo.password !== userInfo.verifyPassword}
      />
      <Button
        text="Sign Up"
        icon={faUserPlus}
        isLoading={isFetching}
        disabled={!isValidated}
      />
    </form>
  );
};

export default SignUp;

const UsernameInput = ({ username, handleChange }) => {
  const [usernameExists, setUsernameExists] = useState("LOADING"); // LOADING, true, false

  const checkUsernameAvailability = async () => {
    const response = await post("/check-username-exists", username);
    if (response.success) {
      if (response.exists) setUsernameExists(true);
      else setUsernameExists(false);
    }
  };

  useUpdateEffect(() => {
    setUsernameExists("LOADING");
    const id = setTimeout(checkUsernameAvailability, 200);

    return () => clearTimeout(id);
  }, [username]);

  let tooltip = "";
  let notValid = usernameExists;

  if (!usernameFormat.test(username) || username.length > 16) {
    tooltip = `Username invalid! Name cannot use special characters or contain more than 16 characters. Can include _ and - (${username})`;
    notValid = true;
  } else if (usernameExists === true) tooltip = "Username unavailable";
  else if (usernameExists === false) tooltip = "Username available";

  return (
    <Input
      name="username"
      placeholder="username"
      value={username}
      onChange={handleChange}
      notValid={notValid}
      tooltip={tooltip}
    />
  );
};

const PasswordInput = ({ password, handleChange }) => {
  let notValid = "";
  let tooltip = "";

  if (password.length < 8) {
    tooltip = "Password must be at least 8 characters long";
    notValid = true;
  } else if (!passwordFormat.test(password)) {
    tooltip =
      "Password must contain at least one capital letter, number, and special character";
    notValid = true;
  } else tooltip = "Password is good";

  return (
    <Input
      type="password"
      name="password"
      placeholder="password"
      value={password}
      onChange={handleChange}
      notValid={notValid}
      tooltip={tooltip}
    />
  );
};
