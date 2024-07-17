"use client";

import React, { useState } from "react";
import Header from "@/layout/Header";
import LoadingPage from "@/components/LoadingPage";
import User from "@/context/User";
import TestStarted from "@/context/TestStarted";
import Settings from "@/context/Settings";
import { ToastContainer } from "react-toastify";
import Language from "@/context/Language";
import "react-toastify/dist/ReactToastify.css";
import Footer from "@/layout/Footer";

const LayoutComponent = ({ children }) => {
  const [colorsLoaded, setColorsLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <ToastContainer
        hideProgressBar
        autoClose={2500}
        closeOnClick
        closeButton={false}
      />

      <User>
        <Settings>
          <Language>
            <TestStarted>
              {isLoaded ? (
                <>
                  <Header />
                  {children}
                  <Footer />
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
