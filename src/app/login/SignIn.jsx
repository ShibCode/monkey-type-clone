import React, { forwardRef } from "react";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";
import { useForm } from "react-hook-form";
import { post } from "@/utils/post";
import { useUser } from "@/context/User";
import createToast from "@/utils/createToast";
import Input from "./Input";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const { login } = useUser();

  const onSubmit = async (values) => {
    const { email, password } = values;
    const response = await post("/login", { email, password });

    if (response.success) {
      createToast(response.message, "success");
      login(response.user, response.token);
    } else createToast(response.message, "error");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-2 w-full max-w-[250px]"
    >
      <p className="text-tertiary">login</p>

      <Input {...register("email")} type="email" required placeholder="email" />
      <Input
        {...register("password")}
        type="password"
        required
        placeholder="password"
      />
      <Button text="Sign In" icon={faRightToBracket} isLoading={isSubmitting} />
    </form>
  );
};

export default Login;
