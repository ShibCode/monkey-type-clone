import Header from "@/components/Header";
import User from "@/context/User";
import { Lexend_Deca } from "next/font/google";
import "./globals.css";
import TestStarted from "@/context/TestStarted";
import Settings from "@/context/Settings";

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
        <User>
          <Settings>
            <TestStarted>
              <Header />
              {children}
            </TestStarted>
          </Settings>
        </User>
      </body>
    </html>
  );
}
