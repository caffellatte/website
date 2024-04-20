"use client";

import { Typography } from "@client/components/ui/base/Typography";
import { Button } from "@client/components/ui/base/Button";
import { Input } from "@client/components/ui/base/Input";
import { linkCreateSchema, LinkCreateFormSchema } from "@client/types/links";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLinkCreate } from "@client/services/hooks/useLinkCreate";
import { useEffect } from "react";

const resolver = zodResolver(linkCreateSchema);

const LinkCreate = () => {
  const linkCreate = useLinkCreate();

  const {
    reset,
    clearErrors,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<LinkCreateFormSchema>({ resolver });

  useEffect(() => {
    console.log("data:", linkCreate.data);
  }, [linkCreate.data]);

  useEffect(() => {
    setError("linkCreateError", {
      type: "custom",
      message: linkCreate.error?.message,
    });
  }, [linkCreate.error, setError]);

  useEffect(() => {
    console.log("isPending:", linkCreate.isPending);
  }, [linkCreate.isPending]);

  const onSubmit = async ({
    title,
    description,
    url,
  }: LinkCreateFormSchema) => {
    console.log(title, description, url);
    clearErrors("linkCreateError");
    try {
      linkCreate.mutate({ title, description, url });
      reset();
    } catch (e) {
      setError("linkCreateError", {
        type: "custom",
        message: "Link Create error",
      });
    }
  };

  return (
    <form
      className="w-full flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex justify-between gap-4">
        <div className="basis-1/2 flex flex-col gap-2">
          <Controller
            name="title"
            control={control}
            defaultValue={""}
            render={({ field: { onChange, value, name, ref } }) => (
              <Input
                placeholder="title"
                maxLength={36}
                id="title"
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                ref={ref}
              />
            )}
          />
          {errors.title && (
            <Typography variant="body1" color="error">
              {errors.title.message}
            </Typography>
          )}
        </div>
        <div className="basis-1/2 flex flex-col gap-2">
          <Controller
            name="description"
            control={control}
            defaultValue={""}
            render={({ field: { onChange, value, name, ref } }) => (
              <Input
                placeholder="description"
                maxLength={36}
                id="description"
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                ref={ref}
              />
            )}
          />
          {errors.description && (
            <Typography variant="body1" color="error">
              {errors.description.message}
            </Typography>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Controller
          name="url"
          control={control}
          defaultValue={""}
          render={({ field: { onChange, value, name, ref } }) => (
            <Input
              placeholder="url"
              maxLength={36}
              id="url"
              type="text"
              name={name}
              value={value}
              onChange={onChange}
              ref={ref}
            />
          )}
        />
        {errors.url && (
          <Typography variant="body1" color="error">
            {errors.url.message}
          </Typography>
        )}
      </div>
      <Button>Create</Button>
    </form>
  );
};

export default LinkCreate;
