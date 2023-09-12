"use client";

import { createContext, useState } from "react";

export const TestStartedContext = createContext();

const TestStarted = ({ children }) => {
  const [testStarted, setTestStarted] = useState(false);

  return (
    <TestStartedContext.Provider value={{ testStarted, setTestStarted }}>
      {children}
    </TestStartedContext.Provider>
  );
};

export default TestStarted;
