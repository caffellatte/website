"use client";

import { Input } from "@client/components/ui/base/Input";
import { Button } from "@client/components/ui/base/Button";
import { Typography } from "@client/components/ui/base/Typography";
import { registerSchema, RegisterFormSchema } from "@client/types/auth";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "@client/services/hooks/useRegister";
import { useEffect } from "react";

const resolver = zodResolver(registerSchema);

const Register = () => {
  const register = useRegister();

  const {
    reset,
    clearErrors,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<RegisterFormSchema>({ resolver });

  useEffect(() => {
    console.log("data:", register.data);
  }, [register.data]);

  useEffect(() => {
    console.log("error:", register.error);
  }, [register.error]);

  useEffect(() => {
    console.log("isPending:", register.isPending);
  }, [register.isPending]);

  const onSubmit = async ({ username, password }: RegisterFormSchema) => {
    console.log(username, password);
    clearErrors("registerError");
    try {
      register.mutate({ username, password });

      reset();
    } catch (e) {
      setError("registerError", {
        type: "custom",
        message: "Registration Error",
      });
    }
  };

  return (
    <section className="flex h-screen flex-grow flex-col items-center justify-center">
      <form
        className="flex min-w-[320px] flex-col gap-4"
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
        <Button type="submit">Register</Button>
        {errors.registerError && (
          <Typography variant="body1" color="error">
            {errors.registerError.message}
          </Typography>
        )}
      </form>
    </section>
  );
};

export default Register;
