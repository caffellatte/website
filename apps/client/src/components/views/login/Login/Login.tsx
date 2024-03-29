"use client";

import { Input } from "@client/components/ui/base/Input";
import { Button } from "@client/components/ui/base/Button";
import { Typography } from "@client/components/ui/base/Typography";
import { loginSchema, LoginFormSchema } from "@client/types/auth";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "@client/services/hooks/useLogin";
import { useEffect } from "react";

const resolver = zodResolver(loginSchema);

const Login = () => {
  const login = useLogin();

  const {
    reset,
    clearErrors,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<LoginFormSchema>({ resolver });

  console.log(login);

  useEffect(() => {
    console.log("data:", login.data);
  }, [login.data]);

  useEffect(() => {
    setError("loginError", {
      type: "custom",
      message: login.error?.message,
    });
  }, [login.error, setError]);

  useEffect(() => {
    console.log("isPending:", login.isPending);
  }, [login.isPending]);

  const onSubmit = async ({ username, password }: LoginFormSchema) => {
    console.log(username, password);
    clearErrors("loginError");
    try {
      login.mutate({ username, password });
      reset();
    } catch (e) {
      setError("loginError", {
        type: "custom",
        message: "Login error",
      });
    }
  };

  return (
    <section className="flex h-screen flex-grow flex-col items-center justify-center">
      <form
        className="flex w-[320px] flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-2">
          <Controller
            name="username"
            control={control}
            defaultValue={""}
            render={({ field: { onChange, value, name, ref } }) => (
              <Input
                placeholder="username"
                maxLength={36}
                id="username"
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                ref={ref}
              />
            )}
          />
          {errors.username && (
            <Typography variant="body1" color="error">
              {errors.username.message}
            </Typography>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Controller
            name="password"
            control={control}
            defaultValue={""}
            render={({ field: { onChange, value, name, ref } }) => (
              <Input
                placeholder="password"
                maxLength={36}
                id="password"
                type="password"
                name={name}
                value={value}
                onChange={onChange}
                ref={ref}
              />
            )}
          />
          {errors.password && (
            <Typography variant="body1" color="error">
              {errors.password.message}
            </Typography>
          )}
        </div>
        <Button type="submit">Login</Button>
        {errors.loginError && (
          <Typography variant="body1" color="error">
            {errors.loginError.message}
          </Typography>
        )}
      </form>
    </section>
  );
};

export default Login;
