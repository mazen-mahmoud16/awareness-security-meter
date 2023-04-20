import { useQuery } from "@tanstack/react-query";
import { LayoutGroup } from "framer-motion";
import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { MdArrowBack, MdEdit } from "react-icons/md";
import { CreateProgramStep } from ".";
import { ProgramInput } from "../../../api/program";
import { tenantNamesQuery } from "../../../api/tenant";
import Button from "../../../components/UI/Button";
import Divider from "../../../components/UI/Divider";
import { motion } from "framer-motion";
import InputLabel from "../../UI/InputLabel";
import Select from "react-select";

interface Props {
  goTo(e: CreateProgramStep): void;
  submit(): void;
}

const Overview: React.FC<Props> = ({ goTo, submit }) => {
  const { getValues, watch, setValue } = useFormContext<ProgramInput>();

  const { name, description, modules } = getValues();

  // @ts-ignore
  const tenant = watch("tenant");

  const { data: tenantNames } = useQuery(tenantNamesQuery());

  const options = useMemo(
    () => [
      { label: "None", value: undefined },
      ...(tenantNames?.result.map((n) => ({ label: n.name, value: n.id })) ||
        []),
    ],
    [tenantNames]
  );

  return (
    <LayoutGroup>
      <div>
        <div className="flex justify-between items-stretch">
          <Button onClick={() => goTo("modules")}>
            <MdArrowBack />
          </Button>
        </div>
        <div className="h-4" />
        <motion.div layout="position">
          <InputLabel>Tenant</InputLabel>
          <Select
            className="my-react-select-container w-72"
            classNamePrefix="my-react-select"
            options={options}
            placeholder={"Select Tenant"}
            value={options.find((o) => o.value === tenant)}
            onChange={(e) => {
              // @ts-ignore
              if (e) setValue("tenant", e.value);
            }}
          />
        </motion.div>
        <div className="h-4" />
        <div className="grid md:grid-cols-4 gap-2 sm:grid-cols-2 place-items-start">
          <h1 className="text-4xl font-bold">Overview</h1>
          <Button onClick={() => goTo("info")}>
            <MdEdit />
          </Button>
        </div>
        <div className="h-4" />
        <div className="text-3xl font-semibold">Info</div>
        <div className="h-4" />
        <dl>
          <KeyValue label="Name" value={name ? name : "Undefined"} />
          <KeyValue
            label="Description"
            value={description ? description : "Undefined"}
          />
          <KeyValue label="Module Count" value={modules.length.toString()} />
        </dl>
        <Divider />
        <div>
          <Button
            className="bg-primary-600 hover:bg-primary-700 float-right"
            onClick={() => {
              // TODO: Validate
              submit();
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </LayoutGroup>
  );
};

const KeyValue: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => {
  return (
    <div className="grid md:grid-cols-4 gap-2 sm:grid-cols-2 py-2">
      <dt className="font-semibold">{label}</dt>
      <dd className="opacity-70">{value}</dd>
    </div>
  );
};

export default Overview;
