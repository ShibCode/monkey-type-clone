import React from "react";
import LayoutComponent from "./LayoutComponent";
import { Lexend_Deca } from "next/font/google";
import "./globals.css";

const lexendDeca = Lexend_Deca({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Monkeytype Clone",
  description: "Just a clone of monkeytype",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${lexendDeca.className} bg-bgColor`}
        suppressHydrationWarning={true}
      >
        <LayoutComponent>{children}</LayoutComponent>
      </body>
    </html>
  );
}
