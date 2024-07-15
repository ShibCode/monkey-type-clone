"use client";

import React, { useState } from "react";
import Header from "@/layout/Header";
import LoadingPage from "@/components/LoadingPage";
import User from "@/context/User";
import TestStarted from "@/context/TestStarted";
import Settings from "@/context/Settings";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Language from "@/context/Language";

const LayoutComponent = ({ children }) => {
  const [colorsLoaded, setColorsLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const path = usePathname();

  return (
    <>
      <ToastContainer
        hideProgressBar
        autoClose={2500}
        closeOnClick
        closeButton={false}
      />

      <User setIsLoaded={setIsLoaded}>
        <Settings>
          <Language>
            <TestStarted>
              {isLoaded ? (
                <>
                  <Header />
                  <motion.div
                    key={path}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.1, ease: "linear" }}
                    className="flex-1 flex"
                  >
                    {children}
                  </motion.div>
                </>
              ) : (
                <LoadingPage
                  setIsLoaded={setIsLoaded}
                  colorsLoaded={colorsLoaded}
                  setColorsLoaded={setColorsLoaded}
                />
              )}
            </TestStarted>
          </Language>
        </Settings>
      </User>
    </>
  );
};

export default LayoutComponent;
