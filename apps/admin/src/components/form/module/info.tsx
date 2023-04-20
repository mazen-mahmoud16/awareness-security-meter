import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import Select from "react-select";
import { ModuleInput, TYPES } from "../../../api/module";
import FileUploadButton from "../../../components/file/FileUploadButton";
import Button from "../../../components/UI/Button";
import Input from "../../../components/UI/Input";
import InputLabel from "../../../components/UI/InputLabel";
import TextArea from "../../../components/UI/TextArea";

interface Props {
  next(): void;
  title: string;
}

const Info: React.FC<Props> = ({ next, title }) => {
  const { register, watch, setValue, getValues, setError } =
    useFormContext<ModuleInput>();
  // @ts-ignore
  const [coverImage, thumbnailImage, type] = watch([
    "coverImage",
    "thumbnailImage",
    "type",
  ]);

  const selectValue = useMemo(
    () =>
      type
        ? {
            label: TYPES.find((t) => t.value === type)?.label,
            value: type,
          }
        : undefined,
    [type]
  );

  return (
    <>
      <h1 className="font-bold text-3xl">{title}</h1>
      <div className="h-6"></div>
      <form>
        <InputLabel>Name</InputLabel>
        <Input {...register("name")} placeholder="Enter Name" />
        <div className="h-6"></div>
        <InputLabel>Description</InputLabel>
        <TextArea
          {...register("description")}
          placeholder="Enter Description"
        />
        <div className="h-6"></div>
        <InputLabel>Type</InputLabel>
        <Select
          placeholder="Select Type"
          className="my-react-select-container"
          classNamePrefix="my-react-select"
          options={TYPES}
          value={selectValue}
          onChange={(e) => {
            setValue("type", e?.value!);
          }}
        />
        <div className="h-6"></div>
        <InputLabel>Duration</InputLabel>
        <Input
          {...register("duration", {
            valueAsNumber: true,
          })}
          className="w-56"
          type="number"
          placeholder="Enter Duration in minutes"
        />
        <div className="h-6"></div>
        <div className="flex">
          <div>
            <InputLabel>Thumbnail Image</InputLabel>
            <FileUploadButton
              id={thumbnailImage}
              onChange={(id) => {
                setValue("thumbnailImage", id);
              }}
            >
              Upload
            </FileUploadButton>
          </div>
          <div className="w-10"></div>
          <div>
            <InputLabel>Cover Image</InputLabel>
            <FileUploadButton
              id={coverImage}
              onChange={(id) => {
                setValue("coverImage", id);
              }}
            >
              Upload
            </FileUploadButton>
          </div>
        </div>
        <div className="h-6"></div>
        <Button
          type="button"
          className="bg-primary-600 hover:bg-primary-700 float-right"
          onClick={(e) => {
            e.preventDefault();
            if (getValues().type) next();
            else setError("type", { message: "Type is required" });
          }}
        >
          Next
        </Button>
      </form>
    </>
  );
};

export default Info;
