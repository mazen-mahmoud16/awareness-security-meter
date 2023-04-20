import React from "react";
import { Helmet } from "react-helmet";
import { BsFillInboxesFill } from "react-icons/bs";
import { CgOrganisation } from "react-icons/cg";
import { FiSettings } from "react-icons/fi";
import { HiArchive } from "react-icons/hi";
import { Link } from "react-router-dom";
interface Props {}

const Item = ({ children, to }: { children: React.ReactNode; to: string }) => {
  return (
    <Link to={to}>
      <div className="border bg-gray-800 hover:bg-gray-900 border-gray-400 border-opacity-40 p-6 py-12 rounded-lg shadow-md cursor-pointer hover:-translate-y-1 transition-all flex items-center justify-center">
        {children}
      </div>
    </Link>
  );
};

const Home: React.FC<Props> = () => {
  return (
    <div className="py-8 px-4">
      <Helmet>
        <title>Awareness Admin | Home</title>
      </Helmet>
      <h1 className="font-bold text-3xl text-center">Home</h1>
      <div className="h-8"></div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-6">
        <Item to="/tenants">
          <CgOrganisation size={26} />
          <div className="w-4"></div>
          <h1 className="font-semibold text-2xl text-center">Tenants</h1>
        </Item>
        <Item to="/modules">
          <HiArchive size={26} />
          <div className="w-4"></div>
          <h1 className="font-semibold text-2xl text-center">Modules</h1>
        </Item>
        <Item to="/programs">
          <BsFillInboxesFill size={26} />
          <div className="w-4"></div>
          <h1 className="font-semibold text-2xl text-center">Programs</h1>
        </Item>
        <Item to="/settings">
          <FiSettings size={26} />
          <div className="w-4"></div>
          <h1 className="font-semibold text-2xl text-center">Settings</h1>
        </Item>
      </div>
    </div>
  );
};

export default Home;
