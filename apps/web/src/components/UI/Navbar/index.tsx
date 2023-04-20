import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom } from "jotai";
import { useMemo, useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaMoon, FaSun } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "../../../api/auth";
import { useThemeStore } from "../../../stores/theme";
import { userAtom } from "../../../stores/user";
import useOnClickOutside from "../../../utils/hooks/useOnClickOutside";
import AuthenticatedImage from "../AuthenticatedImage";
import Button from "../Button";

const Links = [
  { link: "/", name: "Home" },
  { link: "/programs", name: "My Programs" },
  { link: "/modules", name: "Library" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { changeTheme, theme } = useThemeStore();

  const linkSize = 160;

  const currentIndex = useMemo(() => {
    const i = Links.findIndex(({ link }) => {
      return (
        (location.pathname.startsWith(link) && link !== "/") ||
        (link === "/" && location.pathname == "/")
      );
    });
    if (i === -1) return 0;
    return i;
  }, [location.pathname]);

  return (
    <div className="px-6 border-b dark:border-b-gray-300 dark:border-opacity-30 border-opacity-30 border-b-gray-600 absolute w-full z-50 dark:bg-gray-900">
      <div className="h-16 flex items-center justify-between ">
        <Button className="lg:hidden block " onClick={() => setIsOpen(!isOpen)}>
          <GiHamburgerMenu />
        </Button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{
                opacity: 1,
                scaleY: 1,
                transition: { duration: 0.15, type: "tween" },
              }}
              exit={{
                opacity: 0,
                scaleY: 0,
                transition: { duration: 0.15, type: "tween" },
              }}
              className="lg:hidden block absolute top-16 bg-white dark:bg-gray-900 p-4 origin-top w-full left-0 border-t dark:border-t-gray-300 dark:border-opacity-30 border-opacity-30 border-t-gray-600 border-b dark:border-b-gray-300 border-b-gray-600 shadow-md"
            >
              <div className="flex flex-col">
                {Links.map((link) => (
                  <Link
                    onClick={() => {
                      setIsOpen(false);
                    }}
                    key={link.name}
                    to={link.link}
                    className="py-3 px-3 rounded-md dark:hover:bg-gray-800 hover:bg-slate-200 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="space-x-8 items-center h-full lg:flex hidden">
          <AuthenticatedImage
            src={`/tenant/${theme === "dark" ? "darkLogo" : "logo"}`}
            className="h-4/5"
          />
          <nav className="flex h-full relative">
            <motion.div
              className="absolute dark:bg-primary-500 bg-primary-600 bottom-0"
              style={{ width: linkSize, height: 2 }}
              animate={{
                x: linkSize * currentIndex,
                transition: { type: "tween", duration: 0.15 },
              }}
            />
            {Links.map(({ link, name }, idx) => (
              <motion.div
                className={`h-full flex items-center justify-center cursor-pointer relative border-b-2 border-transparent transition-colors ${
                  currentIndex !== idx ? `hover:border-gray-400` : ""
                }`}
                style={{ width: linkSize }}
                key={link}
                onClick={() => navigate(link)}
              >
                <p className="font-bold text-center">{name}</p>
              </motion.div>
            ))}
          </nav>
        </div>
        <div className="flex">
          <Button
            onClick={() => {
              changeTheme(theme === "dark" ? "light" : "dark");
            }}
          >
            {theme === "dark" ? <FaMoon /> : <FaSun />}
          </Button>
          <div className="w-2"></div>
          <SettingsMenu />
        </div>
      </div>
    </div>
  );
}

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
