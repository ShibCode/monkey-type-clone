"use client";

import { createContext, useContext, useState } from "react";

const TestEssentialsContext = createContext();

export const useTestEssentials = () => useContext(TestEssentialsContext);

const TestEssentials = ({ children }) => {
  const [testStarted, setTestStarted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <TestEssentialsContext.Provider
      value={{ testStarted, setTestStarted, modalOpen, setModalOpen }}
    >
      {children}
    </TestEssentialsContext.Provider>
  );
};

export default TestEssentials;
