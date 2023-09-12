"use client";

import useUpdateEffect from "@/hooks/useUpdateEffect";
import { createContext, useEffect, useState } from "react";

export const SettingsContext = createContext();

const Settings = ({ children }) => {
  const [settings, setSettings] = useState({
    flipTestColors: "off",
    liveWpm: "hide",
    timerProgress: "show",
  });

  useEffect(() => {
    const localStorageSettings = JSON.parse(localStorage.getItem("settings"));
    if (localStorageSettings) setSettings(localStorageSettings);
  }, []);

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
