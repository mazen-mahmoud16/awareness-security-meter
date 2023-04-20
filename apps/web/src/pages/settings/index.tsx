import React from "react";
import { Helmet } from "react-helmet";

interface Props {}

const Settings: React.FC<Props> = () => {
  return (
    <div>
      <Helmet>
        <title>Settings</title>
      </Helmet>
      <h1 className="font-bold text-center text-5xl">Settings</h1>
      <div className="h-10"></div>
      <p className="text-center text-light opacity-70">Coming Soon...</p>
    </div>
  );
};

export default Settings;
