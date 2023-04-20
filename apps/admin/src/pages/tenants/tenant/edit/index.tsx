import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select/creatable";
import { Response } from "../../../../api";
import {
  editTenant,
  EditTenantInput,
  tenantQuery,
} from "../../../../api/tenant";
import { departmentsQuery } from "../../../../api/tenant/department";
import FileUploadButton from "../../../../components/file/FileUploadButton";
import Button from "../../../../components/UI/Button";
import CenteredSpinner from "../../../../components/UI/CenteredSpinner";
import Checkbox from "../../../../components/UI/Checkbox";
import Input from "../../../../components/UI/Input";
import InputLabel from "../../../../components/UI/InputLabel";

interface Props {}

const EditTenant: React.FC<Props> = () => {
  const id = useParams().id!;
  const { data } = useQuery(tenantQuery(id));
  const { data: departmentsData } = useQuery(departmentsQuery(id));
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const Form = () => {
    const {
      register,
      getValues,
      formState: { errors },
      setError,
      setValue,
      watch,
    } = useForm<EditTenantInput>({
      defaultValues: {
        name: data?.result.name,
        logo: data?.result.logo,
        darkLogo: data?.result.darkLogo,
        departments: departmentsData?.result,
        lockToDomain: data?.result.lockToDomain,
      },
    });
    const { mutate } = useMutation(
      (input: EditTenantInput) => editTenant(id, input),
      {
        onSuccess() {
          queryClient.invalidateQueries(["users"]);
          navigate(`/tenants/${id}`);
        },
        onError({ error }: Response) {
          if (!Array.isArray(error)) {
            Object.keys(error).map((key) => {
              setError(key as any, { message: error[key] });
            });
          }
        },
      }
    );

    const logo = watch("logo");
    const darkLogo = watch("darkLogo");
    const departments = watch("departments");
    const lockToDomain = watch("lockToDomain");

    const values = useMemo(
      () => departments?.map((p) => ({ label: p, value: p })),
      [departments]
    );

    const onSubmit = () => {
      mutate(getValues());
    };

    return (
      <div className="pt-4">
        <h1 className="font-bold text-3xl ">Edit Tenant</h1>
        <form
          className="pt-4 w-1/2"
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
          <div className="h-6"></div>
          <InputLabel>Departments</InputLabel>
          <Select
            placeholder="Departments"
            className="my-react-select-container"
            classNamePrefix="my-react-select"
            onChange={(e) => {
              setValue(
                "departments",
                e.map((e) => e.value)
              );
            }}
            isMulti
            value={values}
          />
          <div className="h-6"></div>
          <InputLabel>Logo</InputLabel>
          <FileUploadButton
            id={logo}
            onChange={(id) => {
              setValue("logo", id);
            }}
          >
            Upload
          </FileUploadButton>
          <div className="h-6"></div>
          <InputLabel>Dark Theme Logo</InputLabel>
          <FileUploadButton
            id={darkLogo}
            onChange={(id) => {
              setValue("darkLogo", id);
            }}
          >
            Upload
          </FileUploadButton>
          <div className="h-6"></div>
          <Checkbox
            id="lock-to-domain"
            checked={lockToDomain}
            onChange={() => {
              setValue("lockToDomain", !lockToDomain);
            }}
          >
            Lock Users to domain?
          </Checkbox>
          <div className="h-6"></div>
          <Button className="bg-primary-600 hover:bg-primary-700">Save</Button>
        </form>
      </div>
    );
  };

  return data && departmentsData ? <Form /> : <CenteredSpinner />;
};

export default EditTenant;
