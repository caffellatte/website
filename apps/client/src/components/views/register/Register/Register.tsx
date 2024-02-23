"use client";

import { Input } from "@client/components/ui/base/Input";
import { Button } from "@client/components/ui/base/Button";
import { Typography } from "@client/components/ui/base/Typography";
import { registerSchema, RegisterFormSchema } from "@client/types/auth";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const resolver = zodResolver(registerSchema);

const Register = () => {
  const {
    reset,
    clearErrors,
    register,
    handleSubmit,
    setFocus,
    setError,
    setValue,
    control,
    formState: { errors },
  } = useForm<RegisterFormSchema>({ resolver });

  const onSubmit = async ({ username, password }: RegisterFormSchema) => {
    console.log(username, password);
    clearErrors("registerError");
    try {
      // register({ username, password });
      reset();
    } catch (e) {
      setError("registerError", {
        type: "custom",
        message: "Registration Error",
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
