"use client";

import Logo from "@/svg component/Logo";
import React, { useEffect, useState } from "react";
import Spinner from "./Spinner";

const LoadingPage = ({ colorsLoaded }) => {
  const [theme, setTheme] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) setTheme(true);
  }, []);

  return (
    <div className="bg-bgColor absolute inset-0 z-30">
      {!theme && (
        <div
          className={`absolute inset-0 bg-[#313131] transition-all z-10 ${
            colorsLoaded ? "opacity-0" : "opacity-100"
          }`}
        ></div>
      )}

      <div className="wrapper relative">
        <div className="contain items-end h-[55px]">
          <div className="flex w-full items-end gap-6">
            <div className="flex items-end gap-2 cursor-pointer">
              <Logo />
              <div className="-mb-1">
                <div className="text-[10px] -mb-3.5 text-primary">
                  monkey see
                </div>
                <div className="text-3xl text-tertiary">monkeytype</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Spinner fill="fill-secondary" />
      </div>
    </div>
  );
};

export default LoadingPage;
