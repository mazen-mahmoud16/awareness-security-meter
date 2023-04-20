import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { FormProvider, useForm } from "react-hook-form";
import { ModuleInput } from "../../../api/module";
import Content from "./content";
import Info from "./info";
import Overview from "./overview";

export type CreateModuleStep = "info" | "content" | "overview";

interface Props {
  initialValues?: ModuleInput;
  onSubmit(values: ModuleInput): Promise<any>;
  onSuccess(): void;
  mode?: "edit" | "create";
}

const titles = {
  create: "Create Module",
  edit: "Edit Module",
};

const ModuleForm: React.FC<Props> = ({
  onSubmit,
  initialValues,
  onSuccess,
  mode = "create",
}) => {
  const methods = useForm<ModuleInput>({
    shouldUnregister: false,
    defaultValues: initialValues,
  });
  const [step, setStep] = useState<CreateModuleStep>("info");

  const { mutate } = useMutation(onSubmit, {
    async onSuccess(data, variables, context) {
      onSuccess();
    },
    onError(error, variables, context) {},
  });

  return (
    <div className="px-6 py-6">
      <Helmet>
        <title>
          Awareness Admin |{" "}
          {mode === "create" ? "Create Module" : "Edit Module"}
        </title>
      </Helmet>
      <FormProvider {...methods}>
        {step === "info" && (
          <Info title={titles[mode]} next={() => setStep("content")} />
        )}
        {step === "content" && (
          <Content
            previous={() => setStep("info")}
            next={() => setStep("overview")}
          />
        )}
        {step === "overview" && (
          <Overview submit={() => mutate(methods.getValues())} goTo={setStep} />
        )}
      </FormProvider>
    </div>
  );
};

export default ModuleForm;
