"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faKeyboard,
  faCrown,
  faInfo,
  faGear,
  faUser,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Logo from "@/svg component/Logo";
import { useUser } from "@/context/User";
import { useTestStarted } from "@/context/TestStarted";
import { useRouter } from "next/navigation";

const Header = () => {
  const { user, logoutUser } = useUser();
  const { testStarted } = useTestStarted();

  const router = useRouter();

  return (
    <div className="wrapper relative z-20">
      <div className="contain items-end h-[60px]">
        <div className="flex w-full items-end gap-6">
          <Link
            href="/"
            className="flex items-end gap-2 cursor-pointer"
            tabIndex={-1}
          >
            <Logo testStarted={testStarted} />
            <div className="-mb-1">
              <div
                className={`text-primary transition-all duration-150 text-[10px] -mb-3 ${
                  testStarted ? "opacity-0" : "opacity-100"
                }`}
              >
                monkey see
              </div>

              <div
                className={`text-3xl transition-all duration-150 ${
                  testStarted ? "text-primary" : "text-tertiary"
                }`}
              >
                monkeytype
              </div>
            </div>
          </Link>
          <div
            className={`flex gap-6 items-end transition-all duration-150 ${
              testStarted ? "opacity-0" : "opacity-100"
            }`}
          >
            <Link href="/">
              <FontAwesomeIcon
                icon={faKeyboard}
                width={20}
                height={20}
                className="text-primary hover:text-tertiary cursor-pointer transition-colors duration-75"
              />
            </Link>
            <Link href="/leaderboards">
              <FontAwesomeIcon
                icon={faCrown}
                width={20}
                height={20}
                className="text-primary hover:text-tertiary cursor-pointer transition-colors duration-75"
              />
            </Link>
            <Link href="/">
              <FontAwesomeIcon
                icon={faInfo}
                width={20}
                height={20}
                className="text-primary hover:text-tertiary cursor-pointer transition-colors duration-75"
              />
            </Link>
            <Link href="/settings" tabIndex={-1}>
              <FontAwesomeIcon
                icon={faGear}
                width={20}
                height={20}
                className="text-primary hover:text-tertiary cursor-pointer transition-colors duration-75"
              />
            </Link>
          </div>
        </div>

        <div
          className={`flex items-center gap-6 transition-all duration-150 ${
            testStarted ? "opacity-0" : "opacity-100"
          }`}
        >
          {user.username ? (
            <>
              <Link
                tabIndex={-1}
                href="/account"
                className="h-[20px] flex items-center gap-1 text-primary hover:text-tertiary transition-colors duration-75"
              >
                <FontAwesomeIcon icon={faUser} width={20} height={20} />
                <span className="text-sm">{user.username}</span>
              </Link>
              <button
                tabIndex={-1}
                className="h-[20px]"
                onClick={() => {
                  logoutUser();
                  sessionStorage.removeItem("stats");
                  router.push("/login");
                }}
              >
                <FontAwesomeIcon
                  icon={faRightToBracket}
                  width={20}
                  height={20}
                  className="text-primary hover:text-tertiary cursor-pointer transition-colors duration-75"
                />
              </button>
            </>
          ) : (
            <Link href="/login" className="h-[20px]" tabIndex={-1}>
              <FontAwesomeIcon
                icon={faUser}
                width={20}
                height={20}
                className="text-primary hover:text-tertiary cursor-pointer transition-colors duration-75"
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
