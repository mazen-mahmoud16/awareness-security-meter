import { useMutation } from "@tanstack/react-query";
import React from "react";
import { Helmet } from "react-helmet";
import { FormProvider, useForm } from "react-hook-form";
import { TenantProgramInput } from "../../../api/tenant/program";
import Button from "../../UI/Button";
import Divider from "../../UI/Divider";
import DepartmentPicker from "../tenant-spec/DepartmentPicker";
import Metadata from "../tenant-spec/Metadata";
import ProgramPicker from "./ProgramPicker";

interface Props {
  tenantName: string;
  onSubmit(input: TenantProgramInput): Promise<void>;
  onSuccess(): void;
  initialValues?: Partial<TenantProgramInput>;
  isEditMode?: boolean;
}

const TenantProgramEditor: React.FC<Props> = ({
  tenantName,
  onSubmit,
  initialValues,
  isEditMode,
  onSuccess,
}) => {
  const methods = useForm<TenantProgramInput>({
    defaultValues: initialValues ?? {
      showInLibrary: true,
      disabled: false,
      showModulesInLibrary: true,
    },
  });

  const { mutate } = useMutation(onSubmit, {
    async onSuccess(data, variables, context) {
      onSuccess();
    },
    onError(error, variables, context) {},
  });

  return (
    <div className="py-4">
      <Helmet>
        <title>Awareness Admin | Expose Program</title>
      </Helmet>
      <h1 className="font-semibold text-3xl pb-4">
        Expose Program To{" "}
        <span className="opacity-70 font-light italic">{tenantName}</span>
      </h1>
      <FormProvider {...methods}>
        <ProgramPicker disabled={!!isEditMode} />
        <Divider />
        <DepartmentPicker />
        <Divider />
        <Metadata type="tenant-program" />
        <Button
          className="float-right bg-primary-600 hover:bg-primary-700"
          onClick={() => {
            mutate(methods.getValues());
          }}
        >
          Submit
        </Button>
      </FormProvider>
    </div>
  );
};

export default TenantProgramEditor;
