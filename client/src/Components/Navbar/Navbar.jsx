import React from "react";
import useDarkMode from "../../Hooks/DarkMode/DarkMode";
import { Icon } from "@iconify/react";

const Navbar = () => {
  const [darkTheme, setDarkTheme] = useDarkMode();
  const handleMode = () => setDarkTheme(!darkTheme);

  return (
    <div className="relative border-b-2 border-gray-600 dark:border-gray-400 bg-gray-800 dark:bg-gray-200">
      <div className="navbar sticky top-0">
      <div className="flex-1">
        <a className="btn btn-ghost text-gray-200 dark:text-gray-800 normal-case text-xl">
          Chatbot
        </a>
      </div>
      <div className="flex-none mx-6">
        <span className="text-4xl cursor-pointer" onClick={handleMode}>
          {darkTheme ? (
            <Icon
              className="text-gray-800"
              icon="material-symbols:light-mode"
            />
          ) : (
            <Icon className="text-gray-200" icon="ic:round-dark-mode" />
          )}
        </span>
      </div>
      </div>
    </div>
  );
};

export default Navbar;
