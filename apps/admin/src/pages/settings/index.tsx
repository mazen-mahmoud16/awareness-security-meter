import React from "react";
import { Helmet } from "react-helmet";

interface Props {}

const Settings: React.FC<Props> = () => {
  return (
    <div className="py-6">
      <Helmet>
        <title>Awareness Admin | Settings</title>
      </Helmet>
      <h1 className="font-bold text-center text-4xl">Settings</h1>
      <p className="font-light text-center opacity-70">Coming Soon....</p>
    </div>
  );
};

export default Settings;
