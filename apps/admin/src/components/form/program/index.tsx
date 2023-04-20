import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { FormProvider, useForm } from "react-hook-form";
import { ProgramInput } from "../../../api/program";
import Info from "./info";
import ModulesSelector from "./modules";
import Overview from "./overview";

export type CreateProgramStep = "info" | "modules" | "overview";

interface Props {
  initialValues?: ProgramInput;
  onSubmit(values: ProgramInput): Promise<any>;
  onSuccess(): void;
  mode?: "edit" | "create";
}

const titles = {
  create: "Create Program",
  edit: "Edit Program",
};

const ProgramForm: React.FC<Props> = ({
  onSubmit,
  onSuccess,
  initialValues,
  mode = "create",
}) => {
  const methods = useForm<ProgramInput>({
    shouldUnregister: false,
    defaultValues: initialValues,
  });
  const [step, setStep] = useState<CreateProgramStep>("info");

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
          {mode === "create" ? "Create Program" : "Edit Program"}
        </title>
      </Helmet>
      <FormProvider {...methods}>
        {step === "info" && (
          <Info title={titles[mode]} next={() => setStep("modules")} />
        )}
        {step === "modules" && (
          <ModulesSelector
            previous={() => setStep("info")}
            next={() => setStep("overview")}
          />
        )}
        {step === "overview" && (
          <Overview
            goTo={(t) => setStep(t)}
            submit={() => {
              mutate(methods.getValues());
            }}
          />
        )}
      </FormProvider>
    </div>
  );
};

export default ProgramForm;
