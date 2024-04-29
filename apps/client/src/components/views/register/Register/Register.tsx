"use client";

import { Input } from "@client/components/ui/input";
import { Button } from "@client/components/ui/button";
import { Typography } from "@client/components/ui/typography";
import { registerSchema, RegisterFormSchema } from "@client/types/auth";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "@client/services/hooks/useRegister";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const resolver = zodResolver(registerSchema);

const Register = () => {
  const register = useRegister();
  const router = useRouter();
  const [parent] = useAutoAnimate();

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
    if (register.data?.access_token && register.data?.refresh_token) {
      router.push("/");
    }
  }, [register.data, router]);

  useEffect(() => {
    console.log("error:", register.error);
    setError("registerError", {
      type: "custom",
      message: register.error?.message,
    });
  }, [register.error, setError]);

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
    <main className="flex flex-col items-center gap-6">
      <Typography variant="h3">Register</Typography>
      <form
        className="flex min-w-[320px] flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
        ref={parent}
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
            <Typography variant="small" color="error">
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
            <Typography variant="small" color="error">
              {errors.password.message}
            </Typography>
          )}
        </div>
        <Button>Register</Button>
        {errors.registerError && (
          <Typography variant="small" color="error">
            {errors.registerError.message}
          </Typography>
        )}
      </form>
    </main>
  );
};

export default Register;
