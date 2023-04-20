import React from "react";

interface Props {
  entity: string;
}

const EmptyListMessage: React.FC<Props> = ({ entity }) => {
  return (
    <div className="opacity-60 font-light text-center">
      <i>Looks like the {entity} List is Empty. Click + to add a new one</i>
    </div>
  );
};

export default EmptyListMessage;
