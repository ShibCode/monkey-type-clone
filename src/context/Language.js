"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSettings } from "./Settings";

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

const Language = ({ children }) => {
  const [language, setLanguage] = useState(false);

  const { getSettingValue } = useSettings();

  const activeLanguage = getSettingValue("language");

  const fetchLanguage = async () => {
    const response = await fetch(`/languages/${activeLanguage}.json`);
    return await response.json();
  };

  useEffect(() => {
    fetchLanguage().then((language) => {
      setLanguage(language);
    });
  }, [activeLanguage]);

  return (
    <LanguageContext.Provider value={language}>
      {children}
    </LanguageContext.Provider>
  );
};

export default Language;
