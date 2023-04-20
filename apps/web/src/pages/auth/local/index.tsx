import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";

interface Props {}

const LocalAuth: React.FC<Props> = () => {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
        <h1 className="font-bold text-3xl">
          <Routes>
            <Route path="new" element={"New"} />
            <Route path="verify" element={"Verify"} />
            <Route path="register" element={"Register"} />
            <Route path="password" element={"Password"} />
          </Routes>
        </h1>
      </div>
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md  dark:bg-gray-800 dark:border-gray-700 p-4 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 0.5 }}
            key={location.pathname}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LocalAuth;
