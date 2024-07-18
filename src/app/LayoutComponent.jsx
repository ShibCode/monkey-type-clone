"use client";

import React, { useState } from "react";
import Header from "@/layout/Header";
import LoadingPage from "@/components/LoadingPage";
import User from "@/context/User";

import Settings from "@/context/Settings";
import { ToastContainer } from "react-toastify";
import Language from "@/context/Language";
import "react-toastify/dist/ReactToastify.css";
import Footer from "@/layout/Footer";
import TestEssentials from "@/context/TestEssentials";

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
            <TestEssentials>
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
            </TestEssentials>
          </Language>
        </Settings>
      </User>
    </>
  );
};

export default LayoutComponent;
