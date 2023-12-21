"use client";

import { AnimatePresence, motion } from "framer-motion";
import Section from "./Section";
import { useSettings } from "@/context/Settings";

const Settings = () => {
  const { settings } = useSettings();

  return (
    <div id="settingsPage" className="wrapper mt-14">
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
  );
};

export default Settings;
