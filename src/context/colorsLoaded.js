"use client";

import { createContext, useContext, useState } from "react";

const ColorsLoadedContext = createContext();

export const useColorsLoaded = () => useContext(ColorsLoadedContext);

const ColorsLoaded = ({ children }) => {
  const [colorsLoaded, setColorsLoaded] = useState(false);

  return (
    <ColorsLoadedContext.Provider value={{ colorsLoaded, setColorsLoaded }}>
      {children}
    </ColorsLoadedContext.Provider>
  );
};

export default ColorsLoaded;
