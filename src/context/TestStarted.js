"use client";

import { createContext, useContext, useState } from "react";

const TestStartedContext = createContext();

export const useTestStarted = () => useContext(TestStartedContext);

const TestStarted = ({ children }) => {
  const [testStarted, setTestStarted] = useState(false);

  return (
    <TestStartedContext.Provider value={{ testStarted, setTestStarted }}>
      {children}
    </TestStartedContext.Provider>
  );
};

export default TestStarted;
