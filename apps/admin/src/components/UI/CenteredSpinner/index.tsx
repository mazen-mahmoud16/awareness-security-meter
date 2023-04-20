import React from "react";
import Spinner from "../Spinner";

type Props = React.ComponentProps<typeof Spinner>;

const CenteredSpinner: React.FC<Props> = (props) => {
  return (
    <div className="flex flex-col items-center justify-center mt-16">
      <Spinner {...props} />
    </div>
  );
};

export default CenteredSpinner;
