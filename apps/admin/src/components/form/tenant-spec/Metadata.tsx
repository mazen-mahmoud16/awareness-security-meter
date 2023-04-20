import React from "react";
import { useFormContext } from "react-hook-form";
import Checkbox from "../../UI/Checkbox";

interface Props {
  type?: "tenant-module" | "tenant-program";
}

const Metadata: React.FC<Props> = ({ type = "tenant-module" }) => {
  const { watch, setValue } = useFormContext();

  const [showInLibrary, disabled, showModulesInLibrary] = watch([
    "showInLibrary",
    "disabled",
    "showModulesInLibrary",
  ]);

  return (
    <>
      <Checkbox
        id="show-in-lib"
        checked={showInLibrary}
        onChange={() => {
          setValue("showInLibrary", !showInLibrary);
        }}
      >
        Show In Library
      </Checkbox>
      {type === "tenant-program" && (
        <>
          <div className="h-2" />
          <Checkbox
            id="disabled"
            checked={showModulesInLibrary}
            onChange={() => {
              setValue("showModulesInLibrary", !showModulesInLibrary);
            }}
          >
            Show Modules In Library
          </Checkbox>
        </>
      )}
      <div className="h-2" />
      <Checkbox
        id="disabled"
        checked={!disabled}
        onChange={() => {
          setValue("disabled", !disabled);
        }}
      >
        Enabled
      </Checkbox>
    </>
  );
};

export default Metadata;
