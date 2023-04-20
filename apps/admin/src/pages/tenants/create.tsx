import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Select from "react-select";
import { Response } from "../../api";
import { providersQuery } from "../../api/meta";
import { createTenant, TenantInput } from "../../api/tenant";
import { trpc } from "../../api/trpc";
import FileUploadButton from "../../components/file/FileUploadButton";
import Checkbox from "../../components/UI/Checkbox";
import Input from "../../components/UI/Input";
import InputLabel from "../../components/UI/InputLabel";

const CreateTenant: React.FC<{ close: () => void }> = ({ close }) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useForm<TenantInput>({ defaultValues: { lockToDomain: false } });
  const { mutate } = trpc.admin.tenant.create.useMutation({
    onSuccess(data) {
      queryClient.invalidateQueries(["tenants"]);
      close();
    },
    onError(error) {
      // if (!Array.isArray(error)) {
      //   if (error["name"] === "Tenant Name Already Exists") {
      //     setError("name", { message: error["name"] });
      //   }
      // }
      console.log(error);
    },
  });

  const logo = watch("logo");
  const darkLogo = watch("darkLogo");
  const lockToDomain = watch("lockToDomain");

  const onSubmit: SubmitHandler<TenantInput> = async (input) => {
    mutate(input);
  };

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-6">Create Tenant</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputLabel>Name</InputLabel>
        <Input
          placeholder="Enter Tenant Name"
          {...register("name")}
          className={`${
            errors.name ? "border-red-400 dark:border-red-400" : ""
          }`}
        />
        <div>{errors.name?.message}</div>
        <div className="h-4"></div>
        <InputLabel>Domain</InputLabel>
        <Input placeholder="Enter Tenant Domain" {...register("domain")} />
        <div className="h-4"></div>
        <InputLabel>Logo</InputLabel>
        <FileUploadButton
          id={logo}
          onChange={(id) => {
            setValue("logo", id);
          }}
        >
          {!!logo ? "Done" : "Upload Logo"}
        </FileUploadButton>
        <div className="h-4"></div>
        <InputLabel>Dark Mode Logo</InputLabel>
        <FileUploadButton
          id={darkLogo}
          onChange={(id) => {
            setValue("darkLogo", id);
          }}
        >
          {!!darkLogo ? "Done" : "Upload Logo"}
        </FileUploadButton>
        <div className="h-4"></div>
        <Checkbox
          id="lock-to-domain"
          checked={lockToDomain}
          onChange={() => {
            setValue("lockToDomain", !lockToDomain);
          }}
        >
          Lock Users to domain?
        </Checkbox>
        <button className="float-right px-6 py-2 bg-primary-600 hover:bg-primary-700 transition-colors rounded-full">
          Create!
        </button>
      </form>
    </div>
  );
};

export default CreateTenant;
