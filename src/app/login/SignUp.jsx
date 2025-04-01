import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "./Input";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";
import { post } from "@/utils/post";
import createToast from "@/utils/createToast";
import { useUser } from "@/context/User";

const schema = z
  .object({
    username: z
      .string()
      .max(16, "Username can not be more than 16 characters")
      .regex(
        /^[a-zA-Z-_0-9]+$/,
        "Username cannot use special characters. Can include _ and -"
      ),
    email: z.string().email(),
    verifyEmail: z.string(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/,
        "Password must contain at least one capital letter, number, and special character"
      ),
    verifyPassword: z.string(),
  })

  .refine((data) => data.email === data.verifyEmail, {
    message: "Emails do not match",
    path: ["verifyEmail"],
  })
  .refine((data) => data.password === data.verifyPassword, {
    message: "Passwords do not match",
    path: ["verifyPassword"],
  });

const SignUp = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors, isValid },
  } = useForm({ resolver: zodResolver(schema), mode: "onChange" });

  const { login } = useUser();

  const { username, email, verifyEmail, password, verifyPassword } = watch();

  const onSubmit = async (values) => {
    const res = await post("/register", values);

    if (res.success) {
      createToast(res.message, "success");
      login(res.user, res.token);
    } else createToast(res.message, "error");
  };

  return (
    <form
      className="flex flex-col gap-2 w-full max-w-[250px]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <p className="text-tertiary">register</p>

      <Input
        {...register("username")}
        placeholder="username"
        error={username && errors.username?.message}
        success={username && !errors.username}
      />
      <Input
        {...register("email")}
        type="email"
        placeholder="email"
        error={email && errors.email?.message}
        success={email && !errors.email}
      />
      <Input
        {...register("verifyEmail")}
        type="email"
        placeholder="verify email"
        error={verifyEmail && errors.verifyEmail?.message}
        success={verifyEmail && !errors.verifyEmail}
      />
      <Input
        {...register("password")}
        type="password"
        placeholder="password"
        error={password && errors.password?.message}
        success={password && !errors.password && "Password is good!"}
      />
      <Input
        {...register("verifyPassword")}
        type="password"
        placeholder="verify password"
        error={verifyPassword && errors.verifyPassword?.message}
        success={verifyPassword && !errors.verifyPassword}
      />
      <Button
        text="Sign Up"
        icon={faUserPlus}
        isLoading={isSubmitting}
        disabled={!isValid}
      />
    </form>
  );
};

export default SignUp;
