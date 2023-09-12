"use client";

import useUpdateEffect from "@/hooks/useUpdateEffect";
import { createContext, useState } from "react";

export const SettingsContext = createContext();

const Settings = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const localStorageSettings = JSON.parse(localStorage.getItem("settings"));
    if (localStorageSettings) return localStorageSettings;

    return {
      flipTestColors: "off",
      liveWpm: "hide",
      timerProgress: "show",
    };
  });

  useUpdateEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default Settings;
