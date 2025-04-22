import React from "react";
import { useTheme } from "../context/ThemeContext";

const Loading = () => {
  const { theme } = useTheme();

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral">
      <div
        className={`text-center p-8 rounded-xl shadow-lg ${theme === "light" ? "bg-white" : "bg-primary"}`}
      >
        <div className="flex justify-center mb-4">
          <div className="relative w-20 h-20">
            <div
              className={`absolute inset-0 rounded-full border-4 ${theme === "light" ? "border-gray-200" : "border-secondary/30"}`}
            ></div>
            <div
              className={`absolute inset-0 rounded-full border-4 border-t-transparent animate-spin ${theme === "light" ? "border-secondary" : "border-secondary"}`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
