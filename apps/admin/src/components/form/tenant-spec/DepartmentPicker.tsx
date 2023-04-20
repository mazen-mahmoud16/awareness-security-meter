import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.min.css";
import { useFormContext } from "react-hook-form";
import { MdClose } from "react-icons/md";
import { useParams } from "react-router-dom";
import Select from "react-select/creatable";
import { departmentsQuery } from "../../../api/tenant/department";
import type { TenantModuleInput } from "../../../api/tenant/module";
import Button from "../../UI/Button";
import Checkbox from "../../UI/Checkbox";

const DepartmentPicker: React.FC = () => {
  const id = useParams().id!;
  const { data, isLoading } = useQuery(departmentsQuery(id));
  const { watch, setValue } = useFormContext();

  const departments: TenantModuleInput["deadlines"] = watch("deadlines") || [];

  const options = useMemo(
    () => [
      { label: "All", value: "All" },
      ...(data?.result.map((d) => ({ label: d, value: d })) || []),
    ],
    [data]
  );

  const isAll = useMemo(
    () => departments?.find((o) => o.department === "All") !== undefined,
    [departments]
  );

  useEffect(() => {
    if (isAll) {
      setValue("deadlines", [
        { department: "All", deadline: departments[0]?.deadline || undefined },
      ]);
    }
  }, [isAll]);

  return (
    <div>
      <h2 className="font-semibold text-2xl pb-4">Pick Departments</h2>
      {!isAll ? (
        <div className="md:w-1/2 sm:w-3/4">
          <Select
            isMulti
            isLoading={isLoading}
            className="my-react-select-container min-w-80"
            classNamePrefix="my-react-select"
            options={options}
            value={departments?.map((d) => ({
              label: d.department,
              value: d.department,
            }))}
            placeholder="Select Department"
            onChange={(e) => {
              const newDeps: typeof departments = e.map((o) => ({
                department: o.value,
                deadline: departments?.find((d) => d.department === o.value)
                  ?.deadline,
              }));
              setValue("deadlines", newDeps);
            }}
          />
        </div>
      ) : (
        <Button
          className="flex items-center"
          onClick={() => setValue("deadlines", [])}
        >
          All
          <MdClose className="ml-2" />
        </Button>
      )}
      <div>
        {departments?.map((d, i) => (
          <div className="py-3" key={d.department}>
            <h3 className="text-lg font-semibold">{d.department}</h3>
            <DepartmentDeadlineEditor
              i={i}
              deadline={
                typeof d.deadline == "string"
                  ? new Date(d.deadline)
                  : d.deadline
              }
              setDeadline={(d) => {
                const newDepartments = [...departments];
                newDepartments[i].deadline = d;
                setValue("deadlines", newDepartments);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const DepartmentDeadlineEditor: React.FC<{
  deadline?: Date;
  setDeadline(d?: Date): void;
  i: number;
}> = ({ deadline, setDeadline, i }) => {
  return (
    <div className="flex flex-col items-start my-2">
      <Checkbox
        id={`checkbox-${i}`}
        className="mb-3"
        checked={!!deadline}
        onChange={(e) => {
          setDeadline(deadline ? undefined : new Date());
        }}
      >
        Has Deadline?
      </Checkbox>
      {deadline && (
        <div className="relative">
          <DatePicker
            placeholderText="Enter Date"
            selected={deadline}
            onChange={(date) => {
              setDeadline(date ?? undefined);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DepartmentPicker;
