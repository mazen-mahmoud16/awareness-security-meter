import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import CreateableSelect from "react-select/creatable";
import Select from "react-select";
import { Response } from "../../../../api";
import { departmentsQuery } from "../../../../api/tenant/department";
import { createUser, UserInput } from "../../../../api/tenant/user";
import { trpc } from "../../../../api/trpc";
import Button from "../../../../components/UI/Button";
import Input from "../../../../components/UI/Input";
import InputLabel from "../../../../components/UI/InputLabel";

const CreateUser: React.FC<{ close: () => void }> = ({ close }) => {
  const id = useParams().id!;
  const { data, isLoading } = useQuery(departmentsQuery(id));
  const { data: providers, isLoading: providersLoading } =
    trpc.admin.tenant.providers.useQuery(id);

  const queryClient = useQueryClient();
  const {
    register,
    getValues,
    formState: { errors },
    setError,
    setValue,
    clearErrors,
  } = useForm<UserInput>();
  const { mutate } = useMutation((input: UserInput) => createUser(id, input), {
    onSuccess() {
      queryClient.invalidateQueries(["users"]);
      close();
    },
    onError({ error }: Response) {
      if (!Array.isArray(error)) {
        Object.keys(error).map((key) => {
          setError(key as any, { message: error[key] });
        });
      }
    },
  });

  const options = useMemo(
    () => data?.result.map((p) => ({ label: p, value: p })),
    [data]
  );

  const authOptions = useMemo(
    () => [
      { label: `Default`, value: undefined },
      ...(providers?.map((p) => ({
        label: `${p.name} (${p.type})`,
        value: p.id,
      })) || []),
    ],
    [providers]
  ) as any;

  const onSubmit = async () => {
    clearErrors();
    mutate(getValues());
  };

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-6">Add User</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <InputLabel>Name</InputLabel>
        <Input
          placeholder="Enter Name"
          {...register("name")}
          className={`${
            errors.name ? "border-red-400 dark:border-red-400" : ""
          }`}
        />
        <div className="text-red-400">{errors.name?.message}</div>
        <div className="h-5"></div>
        <InputLabel>Email</InputLabel>
        <Input
          placeholder="Enter Email"
          className={`${
            errors.email ? "border-red-400 dark:border-red-400" : ""
          }`}
          {...register("email")}
        />
        <div className="text-red-400">{errors.email?.message}</div>
        <div className="h-5"></div>
        <InputLabel>Department</InputLabel>
        <CreateableSelect
          placeholder="Select Department"
          options={options}
          isLoading={isLoading}
          name="department"
          className="my-react-select-container"
          classNamePrefix="my-react-select"
          onChange={(e) => {
            setValue("department", e?.value!);
          }}
        />
        <div className="text-red-400">{errors.department?.message}</div>
        <div className="h-5" />
        <InputLabel>Auth Provider</InputLabel>
        <Select
          isMulti={false}
          defaultValue={{ label: "Default", value: undefined }}
          placeholder="Select Auth Provider"
          options={authOptions}
          isLoading={providersLoading}
          name="authProvider"
          className="my-react-select-container"
          classNamePrefix="my-react-select"
          onChange={(e) => {
            setValue("authProvider", e?.value!);
          }}
        />
        <div className="h-8"></div>
        <Button
          type="submit"
          className="float-right px-6 bg-primary-600 hover:bg-primary-700 rounded-full"
        >
          Create!
        </Button>
      </form>
    </div>
  );
};

export default CreateUser;
