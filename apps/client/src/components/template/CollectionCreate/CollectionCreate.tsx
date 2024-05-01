"use client";

import { Typography } from "@client/components/ui/typography";
import { Button } from "@client/components/ui/button";
import { Input } from "@client/components/ui/input";
import {
  collectionCreateSchema,
  CollectionCreateFormSchema,
} from "@client/types/collections";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCollectionCreate } from "@client/services/hooks/useCollectionCreate";
import { useEffect } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { trpcBroker } from "@client/services/trpc";

const collectionCreateResolver = zodResolver(collectionCreateSchema);

const CollectionCreate = () => {
  const collectionCreate = useCollectionCreate();
  const [titleAutoAnimate] = useAutoAnimate();
  const [descriptionAutoAnimate] = useAutoAnimate();
  const [pathAutoAnimate] = useAutoAnimate();

  const {
    reset: collectionCreateReset,
    clearErrors: collectionCreateClearErrors,
    handleSubmit: collectionCreateHandleSubmit,
    setError: collectionCreateSetError,
    control: collectionCreateControl,
    formState: { errors: collectionCreateErrors },
  } = useForm<CollectionCreateFormSchema>({
    resolver: collectionCreateResolver,
  });

  useEffect(() => {
    console.log("data:", collectionCreate.data);
  }, [collectionCreate.data]);

  useEffect(() => {
    collectionCreateSetError("collectionCreateError", {
      type: "custom",
      message: collectionCreate.error?.message,
    });
  }, [collectionCreate.error, collectionCreateSetError]);

  useEffect(() => {
    console.log("isPending:", collectionCreate.isPending);
  }, [collectionCreate.isPending]);

  const collectionCreateOnSubmit = async ({
    title,
    description,
    path,
  }: CollectionCreateFormSchema) => {
    console.log(title, description, path);
    collectionCreateClearErrors("collectionCreateError");
    try {
      collectionCreate.mutate({ title, description, path });
      collectionCreateReset();
    } catch (e) {
      collectionCreateSetError("collectionCreateError", {
        type: "custom",
        message: "Link Create error",
      });
    }
  };

  return (
    <form
      className="w-full flex flex-col gap-4"
      onSubmit={collectionCreateHandleSubmit(collectionCreateOnSubmit)}
    >
      <div className="flex justify-between gap-4">
        <div className="basis-1/2 flex flex-col gap-2" ref={titleAutoAnimate}>
          <Controller
            name="title"
            control={collectionCreateControl}
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
          {collectionCreateErrors.title && (
            <Typography variant="small" color="error">
              {collectionCreateErrors.title.message}
            </Typography>
          )}
        </div>
        <div
          className="basis-1/2 flex flex-col gap-2"
          ref={descriptionAutoAnimate}
        >
          <Controller
            name="description"
            control={collectionCreateControl}
            defaultValue={""}
            render={({ field: { onChange, value, name, ref } }) => (
              <Input
                placeholder="description"
                maxLength={256}
                id="description"
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                ref={ref}
              />
            )}
          />
          {collectionCreateErrors.description && (
            <Typography variant="small" color="error">
              {collectionCreateErrors.description.message}
            </Typography>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2" ref={pathAutoAnimate}>
        <Controller
          name="path"
          control={collectionCreateControl}
          defaultValue={""}
          render={({ field: { onChange, value, name, ref } }) => (
            <Input
              placeholder="path"
              maxLength={256}
              id="path"
              type="text"
              name={name}
              value={value}
              onChange={onChange}
              ref={ref}
            />
          )}
        />
        {collectionCreateErrors.path && (
          <Typography variant="small" color="error">
            {collectionCreateErrors.path.message}
          </Typography>
        )}
      </div>
      <Button>Create</Button>

      {collectionCreateErrors.collectionCreateError && (
        <Typography variant="small" color="error">
          {collectionCreateErrors.collectionCreateError.message}
        </Typography>
      )}
    </form>
  );
};

export default CollectionCreate;
