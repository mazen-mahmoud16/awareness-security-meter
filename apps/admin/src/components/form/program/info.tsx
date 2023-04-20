import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import FileUploadButton from "../../file/FileUploadButton";
import Button from "../../UI/Button";
import Input from "../../UI/Input";
import InputLabel from "../../UI/InputLabel";
import TextArea from "../../UI/TextArea";
import Select from "react-select";
import { ProgramInput } from "../../../api/program";

interface Props {
  next(): void;
  title: string;
}

const Info: React.FC<Props> = ({ next, title }) => {
  const { register, watch, setValue, getValues, setError } =
    useFormContext<ProgramInput>();
  const [coverImage, thumbnailImage] = watch(["coverImage", "thumbnailImage"]);

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
            next();
          }}
        >
          Next
        </Button>
      </form>
    </>
  );
};

export default Info;
