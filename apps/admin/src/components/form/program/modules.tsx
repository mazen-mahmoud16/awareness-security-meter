import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { MdArrowBack, MdArrowForward, MdDelete } from "react-icons/md";
import Select from "react-select";
import { moduleNamesQuery, moduleQuery } from "../../../api/module";
import AuthenticatedImage from "../../file/AuthenticatedImage";
import Button from "../../UI/Button";
import CenteredSpinner from "../../UI/CenteredSpinner";
import Divider from "../../UI/Divider";
import { SortableList } from "./SortableList";

interface Props {
  previous(): void;
  next(): void;
}

export function createRange<T>(
  length: number,
  initializer: (index: number) => T
): T[] {
  return [...new Array(length)].map((_, index) => initializer(index));
}

const ModulesSelector: React.FC<Props> = ({ previous, next }) => {
  const [search, setSearch] = useState("");
  const { setValue, watch } = useFormContext();
  const modules: string[] = watch("modules") || [];

  const { data, isFetching } = useQuery({
    ...moduleNamesQuery({ skip: 0, take: 100, search }),
  });

  const options = useMemo(
    () =>
      data?.result
        .filter((m) => !modules.includes(m.id))
        .map((m) => ({
          label: m.name,
          value: m.id,
          image: m.thumbnailImage,
        })),
    [data, modules]
  );

  return (
    <div>
      <div className="flex justify-between">
        <Button onClick={previous}>
          <MdArrowBack />
        </Button>
        <Button onClick={next}>
          <MdArrowForward />
        </Button>
      </div>
      <div className="h-4" />
      <h1 className="text-3xl font-bold">Select Modules</h1>
      <div className="h-6" />
      <Select
        isClearable={true}
        placeholder="Search For Modules"
        className="my-react-select-container min-w-80"
        classNamePrefix="my-react-select"
        inputValue={search}
        options={options}
        isLoading={isFetching}
        formatOptionLabel={(data) => {
          return (
            <div className="min-h-10 flex items-center">
              <div className="w-8 h-8 flex justify-center items-center">
                {data?.image && (
                  <AuthenticatedImage
                    className="max-w-8 max-h-8"
                    src={`/admin/content/images/${data?.image}`}
                  />
                )}
              </div>
              <div className="w-3" />
              <p>{data?.label}</p>
            </div>
          );
        }}
        value={null}
        onChange={(e) => {
          if (e) setValue("modules", [...modules, e.value]);
        }}
        onInputChange={(i) => {
          setSearch(i);
        }}
      />
      <Divider />
      <h1 className="text-2xl font-semibold">List</h1>
      <div className="h-3" />
      <SortableList
        items={modules.map((m) => ({ id: m }))}
        onChange={(i) => {
          setValue(
            "modules",
            i.map((i) => i.id)
          );
        }}
        renderItem={(item) => (
          <SortableList.Item id={item.id}>
            <ModuleItem id={item.id} />
            <div className="flex">
              <Button
                className="bg-transparent hover:bg-black hover:bg-opacity-5"
                onClick={() => {
                  const newModules = modules.filter((m) => m !== item.id);

                  setValue("modules", newModules);
                }}
              >
                <MdDelete className="text-red-300" />
              </Button>
              <SortableList.DragHandle />
            </div>
          </SortableList.Item>
        )}
      />
    </div>
  );
};

const ModuleItem: React.FC<{ id: string }> = ({ id }) => {
  const { data, isError, isLoading } = useQuery(moduleQuery(id));

  if (isLoading) return <CenteredSpinner />;

  if (isError)
    return (
      <div>
        <h3 className="font-semibold text-lg">Module Not Found</h3>
      </div>
    );

  return (
    <div className="flex items-center">
      {data?.result.thumbnailImage && (
        <AuthenticatedImage
          className="max-w-lg max-h-10"
          src={`/admin/content/images/${data?.result.thumbnailImage}`}
        />
      )}
      <div className="w-4" />
      <h3 className="font-semibold text-lg">{data?.result.name}</h3>
    </div>
  );
};

export default ModulesSelector;
