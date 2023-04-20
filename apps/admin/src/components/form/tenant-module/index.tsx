import { useMutation } from "@tanstack/react-query";
import React from "react";
import { Helmet } from "react-helmet";
import { FormProvider, useForm } from "react-hook-form";
import { TenantModuleInput } from "../../../api/tenant/module";
import Button from "../../UI/Button";
import Divider from "../../UI/Divider";
import DepartmentPicker from "../tenant-spec/DepartmentPicker";
import Metadata from "../tenant-spec/Metadata";
import ModulePicker from "./ModulePicker";

interface Props {
  tenantName: string;
  onSubmit(input: TenantModuleInput): Promise<void>;
  onSuccess(): void;
  initialValues?: Partial<TenantModuleInput>;
  isEditMode?: boolean;
}

const TenantModuleEditor: React.FC<Props> = ({
  tenantName,
  onSubmit,
  initialValues,
  isEditMode,
  onSuccess,
}) => {
  const methods = useForm<TenantModuleInput>({
    defaultValues: initialValues ?? { showInLibrary: true, disabled: false },
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
        <title>Awareness Admin | Expose Module</title>
      </Helmet>
      <h1 className="font-semibold text-3xl pb-4">
        Expose Module To{" "}
        <span className="opacity-70 font-light italic">{tenantName}</span>
      </h1>
      <FormProvider {...methods}>
        <ModulePicker disabled={!!isEditMode} />
        <Divider />
        <DepartmentPicker />
        <Divider />
        <Metadata />
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

export default TenantModuleEditor;
