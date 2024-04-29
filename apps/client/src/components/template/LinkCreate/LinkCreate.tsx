"use client";

import { Typography } from "@client/components/ui/typography";
import { Button } from "@client/components/ui/button";
import { Input } from "@client/components/ui/input";
import {
  linkCreateSchema,
  LinkCreateFormSchema,
  linkMetadataSchema,
  LinkMetadataFormSchema,
} from "@client/types/links";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLinkCreate } from "@client/services/hooks/useLinkCreate";
import { useLinkMetadata } from "@client/services/hooks/useLinkMetadata";
import { useEffect } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const linkCreateResolver = zodResolver(linkCreateSchema);
const linkMetadataResolver = zodResolver(linkMetadataSchema);

const LinkCreate = () => {
  const linkCreate = useLinkCreate();
  const linkMetadata = useLinkMetadata();
  const [titleAutoAnimate] = useAutoAnimate();
  const [descriptionAutoAnimate] = useAutoAnimate();
  const [urlAutoAnimate] = useAutoAnimate();

  const {
    reset: linkCreateReset,
    clearErrors: linkCreateClearErrors,
    handleSubmit: linkCreateHandleSubmit,
    setError: linkCreateSetError,
    control: linkCreateControl,
    formState: { errors: linkCreateErrors },
    getValues: linkCreateGetValues,
  } = useForm<LinkCreateFormSchema>({ resolver: linkCreateResolver });

  const {
    setError: linkMetadataSetError,
    formState: { errors: linkMetadataErrors },
    setValue: linkMetadataSetValue,
  } = useForm<LinkMetadataFormSchema>({ resolver: linkMetadataResolver });

  const watchedUrl = useWatch({ control: linkCreateControl, name: "url" });

  console.log(watchedUrl);

  useEffect(() => {
    console.log("data:", linkMetadata.data);
  }, [linkMetadata.data]);

  useEffect(() => {
    linkMetadataSetError("linkMetadataError", {
      type: "custom",
      message: linkMetadata.error?.message,
    });
  }, [linkMetadata.error, linkMetadataSetError]);

  useEffect(() => {
    console.log("isPending:", linkMetadata.isPending);
  }, [linkMetadata.isPending]);

  useEffect(() => {
    if (watchedUrl && watchedUrl.length > 3) {
      linkCreateClearErrors("url");
    }
  }, [watchedUrl, linkCreateClearErrors]);

  useEffect(() => {
    console.log("data:", linkCreate.data);
  }, [linkCreate.data]);

  useEffect(() => {
    linkCreateSetError("linkCreateError", {
      type: "custom",
      message: linkCreate.error?.message,
    });
  }, [linkCreate.error, linkCreateSetError]);

  useEffect(() => {
    console.log("isPending:", linkCreate.isPending);
  }, [linkCreate.isPending]);

  const linkCreateOnSubmit = async ({
    title,
    description,
    url,
  }: LinkCreateFormSchema) => {
    console.log(title, description, url);
    linkCreateClearErrors("linkCreateError");
    try {
      linkCreate.mutate({ title, description, url });
      linkCreateReset();
    } catch (e) {
      linkCreateSetError("linkCreateError", {
        type: "custom",
        message: "Link Create error",
      });
    }
  };

  const linkMetadataOnSubmit = async ({ url }: LinkMetadataFormSchema) => {
    console.log(url);
    // linkCreateClearErrors("linkCreateError");
    try {
      linkMetadata.mutate({ url });
      // linkCreateReset();
    } catch (e) {
      linkMetadataSetError("linkMetadataError", {
        type: "custom",
        message: "Link Metadata error",
      });
    }
  };

  return (
    <form
      className="w-full flex flex-col gap-4"
      onSubmit={linkCreateHandleSubmit(linkCreateOnSubmit)}
    >
      <div className="flex justify-between gap-4">
        <div className="basis-1/2 flex flex-col gap-2" ref={titleAutoAnimate}>
          <Controller
            name="title"
            control={linkCreateControl}
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
          {linkCreateErrors.title && (
            <Typography variant="small" color="error">
              {linkCreateErrors.title.message}
            </Typography>
          )}
        </div>
        <div
          className="basis-1/2 flex flex-col gap-2"
          ref={descriptionAutoAnimate}
        >
          <Controller
            name="description"
            control={linkCreateControl}
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
          {linkCreateErrors.description && (
            <Typography variant="small" color="error">
              {linkCreateErrors.description.message}
            </Typography>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2" ref={urlAutoAnimate}>
        <Controller
          name="url"
          control={linkCreateControl}
          defaultValue={""}
          render={({ field: { onChange, value, name, ref } }) => (
            <Input
              placeholder="url"
              maxLength={256}
              id="url"
              type="text"
              name={name}
              value={value}
              onChange={onChange}
              ref={ref}
            />
          )}
        />
        {linkCreateErrors.url && (
          <Typography variant="small" color="error">
            {linkCreateErrors.url.message}
          </Typography>
        )}
      </div>
      <Button>Create</Button>
      <Button
        type="button"
        onClick={() => {
          // e.preventDefault();
          const url = linkCreateGetValues("url");
          if (url) {
            linkMetadataSetValue("url", url);
            linkMetadataOnSubmit({ url: url, linkMetadataError: "" });
          } else {
            linkCreateSetError("url", {
              type: "required",
              message: "This field is required (min 4 characters)",
            });
          }
        }}
      >
        Meta
      </Button>
      {linkMetadataErrors.linkMetadataError && (
        <Typography variant="small" color="error">
          {linkMetadataErrors.linkMetadataError.message}
        </Typography>
      )}
    </form>
  );
};

export default LinkCreate;
