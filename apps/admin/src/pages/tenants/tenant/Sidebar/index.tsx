import React from "react";
import { Link, NavLink, useLocation, useParams } from "react-router-dom";
import { twMerge } from "tailwind-merge";

interface Props {}

const SidebarItem: React.FC<{ children: React.ReactNode; to: string }> = ({
  children,
  to,
}) => {
  const location = useLocation();
  const id = useParams().id!;
  const match = to == "" ? `/tenants/${id}` : to;
  const isActive = location.pathname.endsWith(match);
  return (
    <Link
      to={to}
      className={`flex text-lg font-semibold py-3 px-6 cursor-pointer hover:bg-white hover:bg-opacity-5 transition-colors rounded-md ${
        isActive ? "bg-gray-800" : "bg-opacity-0"
      }
        `}
    >
      {children}
    </Link>
  );
};

const Sidebar: React.FC<Props> = () => {
  return (
    <div className="h-[calc(100%-4rem)] w-52 border-r border-r-gray-600 border-opacity-30 absolute top-16 left-0 hidden lg:block">
      <div className="flex flex-col px-4 pt-6 space-y-2">
        <SidebarItem to="">Info</SidebarItem>
        <SidebarItem to="auth">Auth Providers</SidebarItem>
        <SidebarItem to="users">Users</SidebarItem>
        <SidebarItem to="modules">Modules</SidebarItem>
        <SidebarItem to="programs">Programs</SidebarItem>
      </div>
    </div>
  );
};

export default Sidebar;
