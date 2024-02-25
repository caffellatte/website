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

  useEffect(() => {
    console.log("data:", login.data);
  }, [login.data]);

  useEffect(() => {
    console.log("error:", login.error);
  }, [login.error]);

  useEffect(() => {
    console.log("isLoading:", login.isLoading);
  }, [login.isLoading]);

  const onSubmit = async ({ username, password }: LoginFormSchema) => {
    console.log(username, password);
    clearErrors("loginError");
    try {
      login.mutate({ username, password });
      reset();
    } catch (e) {
      setError("loginError", {
        type: "custom",
        message: "Login Error",
      });
    }
  };

  return (
    <section className="h-screen flex flex-col flex-grow items-center justify-center">
      <form
        className="min-w-[320px] flex flex-col gap-4"
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
