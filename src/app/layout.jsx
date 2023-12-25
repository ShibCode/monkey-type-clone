"use client";

import { useState } from "react";
import { Lexend_Deca } from "next/font/google";
import Header from "@/layout/Header";
import LoadingPage from "@/components/LoadingPage";
import User from "@/context/User";
import TestStarted from "@/context/TestStarted";
import Settings from "@/context/Settings";
import "./globals.css";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const lexendDeca = Lexend_Deca({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Monkeytype Clone",
  description: "Just a clone of monkeytype",
};

export default function RootLayout({ children }) {
  const [colorsLoaded, setColorsLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const path = usePathname();

  return (
    <html lang="en">
      <body
        className={`${lexendDeca.className} bg-bgColor`}
        suppressHydrationWarning={true}
      >
        <User setIsLoaded={setIsLoaded}>
          <Settings>
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
          </Settings>
        </User>
      </body>
    </html>
  );
}
