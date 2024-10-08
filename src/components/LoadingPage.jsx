"use client";

import { useEffect } from "react";
import Logo from "@/svg component/Logo";
import Spinner from "./Spinner";
import themes from "@/data/themes";
import changeTheme from "@/utils/changeTheme";
import { useLanguage } from "@/context/Language";
import { useUser } from "@/context/User";

const start = new Date();

const LoadingPage = ({ setIsLoaded, colorsLoaded, setColorsLoaded }) => {
  const language = useLanguage();
  const { user } = useUser();

  useEffect(() => {
    if (!colorsLoaded) {
      const theme = JSON.parse(localStorage.getItem("monkey-type-clone-theme"));

      if (theme) changeTheme(Object.keys(theme)[0]);
      else {
        const theme = { carbon: themes.carbon };
        localStorage.setItem("monkey-type-clone-theme", JSON.stringify(theme));
      }

      setColorsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (colorsLoaded && language && user !== undefined) {
      setTimeout(
        () => {
          setIsLoaded(true);
        },
        Date.now() - start > 1000 ? 0 : 1000 - (Date.now() - start)
      );
    }
  }, [language, colorsLoaded, user]);

  return (
    <div className="bg-bgColor absolute inset-0 z-30">
      <div
        className={`absolute inset-0 bg-[#313131] z-10 transition-opacity duration-150 ${
          colorsLoaded ? "opacity-0" : "opacity-100"
        }`}
      ></div>
      <div className="wrapper relative">
        <div className="contain items-end h-[60px]">
          <div className="flex w-full items-end gap-6">
            <div className="flex items-end gap-2 cursor-pointer">
              <Logo isFillPrimary />
              <div className="-mb-1">
                <div className="text-3xl text-primary">monkeytype</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Spinner />
      </div>
    </div>
  );
};

export default LoadingPage;
