"use client";

import useUpdateEffect from "@/hooks/useUpdateEffect";
import { createContext, useContext, useState } from "react";
import themes from "@/data/themes";
import defaultSettings from "@/data/settings";

export const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

const Settings = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    let localStorageSettings = JSON.parse(
      localStorage.getItem("monkey-type-clone-settings")
    );

    if (!localStorageSettings) return defaultSettings;

    if (!themes[localStorageSettings.theme.theme.active])
      localStorageSettings.theme.theme.active = "carbon";

    const localSections = Object.keys(localStorageSettings);
    const defaultSections = Object.keys(defaultSettings);

    // removing a whole section
    if (localSections.length > defaultSections.length) {
      localSections.forEach((localSection) => {
        if (!defaultSections.includes(localSection)) {
          const keyValues = Object.entries(localStorageSettings);
          const newKeyValues = keyValues.filter((keyValue) => {
            if (keyValue[0] !== localSection) return keyValue;
          });
          const newObj = Object.fromEntries(newKeyValues);
          localStorageSettings = newObj;
        }
      });
    }

    defaultSections.forEach((defaultSection, i) => {
      let localSettings = localStorageSettings[defaultSection];
      const defSettingsKeys = Object.keys(defaultSettings[defaultSection]);

      // if section already exists
      if (localSettings) {
        const localSettingsKeys = Object.keys(localSettings);

        // adding a setting within a section
        if (defSettingsKeys.length > localSettingsKeys.length) {
          defSettingsKeys.forEach((defSetting, settingIndex) => {
            if (!localSettingsKeys.includes(defSetting)) {
              const keyValues = Object.entries(localSettings);
              keyValues.splice(settingIndex, 0, [
                defSetting,
                defaultSettings[defaultSection][defSetting],
              ]);
              const newObj = Object.fromEntries(keyValues);
              localSettings = newObj;
            }
          });
        }
        // removing a setting within a section
        else {
          localSettingsKeys.forEach((localSetting) => {
            if (!defSettingsKeys.includes(localSetting)) {
              const keyValues = Object.entries(localSettings);
              const newKeyValues = keyValues.filter((keyValue) => {
                if (keyValue[0] !== localSetting) return keyValue;
              });
              const newObj = Object.fromEntries(newKeyValues);
              localSettings = newObj;
            }
          });
        }

        localStorageSettings[defaultSection] = localSettings;
      }
      // if section does not exist so it adds section
      else {
        const keyValues = Object.entries(localStorageSettings);
        keyValues.splice(i, 0, [
          defaultSection,
          defaultSettings[defaultSection],
        ]);
        const newObj = Object.fromEntries(keyValues);
        localStorageSettings = newObj;
      }
    });

    return localStorageSettings;
  });

  useUpdateEffect(() => {
    localStorage.setItem(
      "monkey-type-clone-settings",
      JSON.stringify(settings)
    );
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default Settings;
