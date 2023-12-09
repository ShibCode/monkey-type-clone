"use client";

import { useEffect, useState } from "react";
import Section from "./Section";
import LoadingPage from "@/components/LoadingPage";
import onLoad from "@/utils/onLoad";
import { useSettings } from "@/context/Settings";

const Settings = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [colorsLoaded, setColorsLoaded] = useState(false);

  const { settings } = useSettings();

  useEffect(() => {
    onLoad(setColorsLoaded);
    setTimeout(() => setIsLoaded(true), 500);
  }, []);

  return isLoaded ? (
    <div className="wrapper mt-14">
      <div className="max-w-[calc(1200px+50px)] w-[calc(90%+50px)] flex flex-col gap-4">
        {Object.keys(settings).map((sectionName, index) => {
          const sectionSettings = settings[sectionName];

          return (
            <Section
              key={index}
              heading={sectionName}
              settings={sectionSettings}
            />
          );
        })}
      </div>
    </div>
  ) : (
    <LoadingPage colorsLoaded={colorsLoaded} />
  );
};

export default Settings;
