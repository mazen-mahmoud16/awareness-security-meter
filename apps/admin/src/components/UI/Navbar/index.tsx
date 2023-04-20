import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom } from "jotai";
import React, { useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "../../../api/auth";
import { userAtom } from "../../../atoms/user";
import useOnClickOutside from "../../../utils/hook/useOnClickOutside";
import Button from "../Button";

interface Props {}

const NavItem: React.FC<{ to: string; children: React.ReactNode }> = ({
  to,
  children,
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `mx-1 px-3 py-2 rounded-md hover:bg-white hover:bg-opacity-10 transition-colors ${
          isActive ? "bg-white bg-opacity-5" : ""
        }`
      }
    >
      {children}
    </NavLink>
  );
};

const Navbar: React.FC<Props> = () => {
  return (
    <div className="h-16 border-b border-b-gray-500 border-opacity-30 w-screen py-2 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <NavLink to="/" className="font-semibold mr-4 text-lg">
          Awareness
        </NavLink>
        <NavItem to="/tenants">Tenants</NavItem>
        <NavItem to="/modules">Modules</NavItem>
        <NavItem to="/programs">Programs</NavItem>
      </div>
      <SettingsMenu />
    </div>
  );
};

const SettingsMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [, setUser] = useAtom(userAtom);
  useOnClickOutside(ref, () => setIsOpen(false));
  const navigate = useNavigate();
  const { mutate } = useMutation(signOut, {
    onSuccess() {
      setUser({ loading: false, user: undefined });
      navigate("/auth/login");
    },
  });

  return (
    <div className="relative" ref={ref}>
      <Button onClick={() => setIsOpen(!isOpen)}>
        <BsThreeDots />
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.1 } }}
            exit={{ scale: 0.4, opacity: 0, transition: { duration: 0.1 } }}
            className="absolute w-32 top-10 right-0 origin-top-right flex flex-col shadow-md border border-gray-400 border-opacity-40 rounded-md bg-white dark:bg-gray-800"
          >
            <div
              className="py-2 px-3 hover:bg-slate-100 dark:hover:bg-gray-700 cursor-pointer transition-all"
              onClick={() => navigate("/settings")}
            >
              Settings
            </div>
            <div
              className="py-2 px-3 hover:bg-slate-100 dark:hover:bg-gray-700 cursor-pointer transition-all"
              onClick={() => {
                mutate();
              }}
            >
              Sign out
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
