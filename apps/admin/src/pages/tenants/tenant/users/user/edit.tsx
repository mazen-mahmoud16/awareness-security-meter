import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { RouterOutput, trpc } from "../../../../../api/trpc";
import CenteredSpinner from "../../../../../components/UI/CenteredSpinner";
import type { RouterInput } from "../../../../../api/trpc";
import InputLabel from "../../../../../components/UI/InputLabel";
import Input from "../../../../../components/UI/Input";
import CreateableSelect from "react-select/creatable";
import Button from "../../../../../components/UI/Button";
import Spinner from "../../../../../components/UI/Spinner";

interface Props {}

type EditUserInput =
  RouterInput["admin"]["tenant"]["users"]["editUser"]["data"];
type GetUserData = RouterOutput["admin"]["tenant"]["users"]["getUser"];

const EditUser: React.FC<Props> = () => {
  const { uid, id } = useParams();
  const { data, isLoading } = trpc.admin.tenant.users.getUser.useQuery(uid!);
  const navigate = useNavigate();

  const Form = (data: GetUserData) => {
    console.log(data.authProvider?.id);
    const { register, setValue, handleSubmit, watch } = useForm<EditUserInput>({
      defaultValues: {
        name: data.name,
        authProvider:
          data.authProvider?.id === undefined ? null : data.authProvider?.id,
        department: data.department,
      },
    });
    const { mutate, isLoading: isMutationLoading } =
      trpc.admin.tenant.users.editUser.useMutation({
        onSuccess() {
          navigate(`/tenants/${id!}/users/${uid!}`);
        },
      });
    const { data: departments, isLoading: isLoadingDepartments } =
      trpc.admin.tenant.departments.useQuery(id!);
    const { data: providers, isLoading: isLoadingProviders } =
      trpc.admin.tenant.providers.useQuery(id!);

    const department = watch("department");
    const authProvider = watch("authProvider");

    const departmentOptions = useMemo(
      () => departments?.map((d) => ({ label: d, value: d })),
      [departments]
    );
    const departmentValue = departmentOptions?.find(
      (o) => o.value === department
    );

    const providerOptions = useMemo(
      () => [
        { label: "Default (For Tenant)", value: null },
        ...(providers || []).map((p) => ({
          label: `${p.name} (${p.type})`,
          value: p.id,
        })),
      ],
      [providers]
    );
    const providerValue = providerOptions?.find(
      (o) => o.value === authProvider
    );

    return (
      <form
        className="flex-col space-y-4"
        onSubmit={handleSubmit((d) => mutate({ id: uid!, data: d }))}
      >
        <div>
          <InputLabel>Name</InputLabel>
          <Input placeholder="Name" {...register("name")}></Input>
        </div>
        <div>
          <InputLabel>Department</InputLabel>
          <CreateableSelect
            options={departmentOptions}
            isLoading={isLoadingDepartments}
            value={departmentValue}
            className="my-react-select-container"
            classNamePrefix="my-react-select"
            onChange={(e) => {
              setValue("department", e?.value!);
            }}
          />
        </div>
        <div>
          <InputLabel>Auth Provider</InputLabel>
          <CreateableSelect
            options={providerOptions}
            isLoading={isLoadingProviders}
            value={providerValue}
            className="my-react-select-container"
            classNamePrefix="my-react-select"
            onChange={(e) => {
              setValue("authProvider", e?.value!);
            }}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          {isMutationLoading && (
            <svg
              role="status"
              className="inline mr-3 w-4 h-4 text-white animate-spin"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
          )}
          Save
        </button>
      </form>
    );
  };

  return (
    <div className="pt-4">
      {isLoading && <CenteredSpinner />}

      {data && (
        <>
          <div className="flex flex-col space-y-2">
            <h1 className="text-4xl font-bold">Edit User</h1>
            <div>
              <h2>ID: {data.id}</h2>
              <h1>Email: {data.email}</h1>
            </div>
          </div>
          <div className="h-4"></div>
          <Form {...data} />
        </>
      )}
    </div>
  );
};

export default EditUser;
