import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useParams } from "react-router-dom";
import Select from "react-select";
import { moduleNamesForTenantQuery, moduleQuery } from "../../../api/module";
import AuthenticatedImage from "../../file/AuthenticatedImage";
import InputLabel from "../../UI/InputLabel";

const ModulePicker: React.FC<{ disabled: boolean }> = ({ disabled }) => {
  const { watch, setValue } = useFormContext();
  const id = watch("module");
  const tenantId = useParams().id!;
  const [search, setSearch] = useState("");
  const [isTenantSpecific, setIsTenantSpecific] = useState(false);
  const { data, isFetching } = useQuery(
    moduleNamesForTenantQuery(
      { skip: 0, take: 100, search },
      tenantId,
      isTenantSpecific
    )
  );

  const options = useMemo(
    () =>
      data?.result.map((m) => ({
        label: m.name,
        value: m.id,
        image: m.thumbnailImage,
      })),
    [data]
  );

  const inOptions = useMemo(
    () => options?.find((option) => option.value === id),
    [options, id]
  );

  const { data: moduleData } = useQuery(
    moduleQuery(id, inOptions === undefined && id !== undefined)
  );

  const value =
    inOptions ??
    (moduleData
      ? {
          image: moduleData?.result.thumbnailImage,
          value: moduleData?.result.id,
          label: moduleData?.result.name,
        }
      : undefined);

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="font-semibold text-2xl pb-4">Pick Module</h2>
        <div className="flex items-center mb-4">
          <input
            checked={isTenantSpecific}
            onChange={(e) => {
              setIsTenantSpecific(!isTenantSpecific);
            }}
            id="default-checkbox"
            type="checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            htmlFor="default-checkbox"
            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Is Tenant Specific
          </label>
        </div>
      </div>
      <div className="md:w-1/2 sm:w-3/4">
        <div>
          <InputLabel>Search</InputLabel>
          <Select
            isDisabled={disabled}
            placeholder="Search"
            className="my-react-select-container min-w-80"
            classNamePrefix="my-react-select"
            inputValue={search}
            options={options}
            isLoading={isFetching}
            value={value}
            formatOptionLabel={(data) => {
              return (
                <div className="min-h-10 flex items-center">
                  <div className="w-8 h-8 flex justify-center items-center">
                    {data.image && (
                      <AuthenticatedImage
                        className="max-w-8 max-h-8"
                        src={`/admin/content/images/${data.image}`}
                      />
                    )}
                  </div>
                  <div className="w-3" />
                  <p>{data.label}</p>
                </div>
              );
            }}
            onChange={(e) => {
              setValue("module", e?.value);
            }}
            onInputChange={(i) => {
              setSearch(i);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ModulePicker;
