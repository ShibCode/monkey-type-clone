"use client";

import Overlay from "@/components/Overlay";
import { useSettings } from "@/context/Settings";
import { faTwitter, faDiscord } from "@fortawesome/free-brands-svg-icons";
import {
  faCheck,
  faCode,
  faDonate,
  faEnvelope,
  faFileContract,
  faLock,
  faMagnifyingGlass,
  faPalette,
  faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import themes from "@/data/themes.json";
import changeTheme from "@/utils/changeTheme";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { useTestEssentials } from "@/context/TestEssentials";

const Footer = () => {
  const { testStarted } = useTestEssentials();

  return (
    <footer
      className={`wrapper mt-auto py-7 text-sm transition-all duration-150 ${
        testStarted ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="contain justify-between">
        <div className="flex items-center gap-5">
          <a
            href="https://github.com/ShibCode/monkey-type-clone"
            target="_blank"
            className="flex items-center gap-1.5 text-primary hover:text-tertiary cursor-pointer transition-colors duration-75"
          >
            <FontAwesomeIcon icon={faCode} />
            github
          </a>
        </div>

        <ChangeTheme />
      </div>
    </footer>
  );
};

export default Footer;

const ChangeTheme = () => {
  const { getSettingValue, setSettingValue } = useSettings();
  const { setModalOpen } = useTestEssentials();

  const activeTheme = getSettingValue("theme");

  const [modalActive, setModalActive] = useState(false);
  const [tempActiveTheme, setTempActiveTheme] = useState(activeTheme);

  const [search, setSearch] = useState("");
  const [filteredThemes, setFilteredThemes] = useState(Object.keys(themes));

  const inputRef = useRef(null);

  const tempChangeTheme = (themeName) => {
    setTempActiveTheme(themeName);
  };

  useUpdateEffect(() => {
    const id = setTimeout(() => changeTheme(tempActiveTheme), 250);
    return () => clearTimeout(id);
  }, [tempActiveTheme]);

  const moveDown = () => {
    const index = filteredThemes.indexOf(tempActiveTheme);

    if (index === filteredThemes.length - 1)
      setTempActiveTheme(filteredThemes[0]);
    else setTempActiveTheme(filteredThemes[index + 1]);
  };

  const moveUp = () => {
    const index = filteredThemes.indexOf(tempActiveTheme);

    if (index === 0)
      setTempActiveTheme(filteredThemes[filteredThemes.length - 1]);
    else setTempActiveTheme(filteredThemes[index - 1]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") moveDown();
    else if (e.key === "ArrowUp") moveUp();
    else if (e.key === "Enter") {
      setSettingValue("theme", tempActiveTheme);
      setModalActive(false);
    }
  };

  useUpdateEffect(() => {
    setModalOpen(modalActive);

    if (modalActive) inputRef.current.focus();
    else changeTheme(activeTheme);
  }, [modalActive]);

  useEffect(() => {
    if (modalActive) window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modalActive, tempActiveTheme]);

  useUpdateEffect(() => {
    const filteredThemes = Object.keys(themes).filter((themeName) =>
      themeName.toLowerCase().includes(search.toLowerCase())
    );

    if (filteredThemes.includes(tempActiveTheme)) {
      setTempActiveTheme(tempActiveTheme);
    } else if (filteredThemes.includes(activeTheme)) {
      setTempActiveTheme(activeTheme);
    } else setTempActiveTheme(filteredThemes[0]);

    setFilteredThemes(filteredThemes);
  }, [search]);

  return (
    <>
      <Overlay isActive={modalActive} setIsActive={setModalActive}>
        <div
          className="w-[90%] max-w-[600px] h-[70vh] flex items-start"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-bgColor w-full flex flex-col max-h-full rounded-lg">
            <div className="h-[56px] flex px-4 gap-3">
              <div className="flex items-center text-lg">
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="text-primary"
                />
              </div>

              <input
                ref={inputRef}
                placeholder="Search..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none caret-secondary text-tertiary placeholder:text-primary text-base"
              />
            </div>

            <div className="flex flex-col overflow-auto rounded-b-lg h-full">
              {filteredThemes.map((themeName) => {
                const { primary, secondary, tertiary, bg } = themes[themeName];

                return (
                  <button
                    key={themeName}
                    onMouseEnter={() => tempChangeTheme(themeName)}
                    onClick={() => {
                      setSettingValue("theme", themeName);
                      setModalActive(false);
                    }}
                    className={`flex justify-between items-center py-1 px-4 ${
                      tempActiveTheme === themeName
                        ? "bg-tertiary"
                        : "bg-transparent"
                    }`}
                  >
                    <div
                      className={`text-[13px] flex items-center gap-2 ${
                        tempActiveTheme === themeName
                          ? "text-bgColor"
                          : "text-primary"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={faCheck}
                        className={`text-sm translate-y-[0.6px] transition-opacity duration-[125ms] ${
                          activeTheme === themeName
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />
                      {themeName}
                    </div>
                    <div
                      className={`flex gap-1.5 items-center p-1 rounded-full`}
                      style={{ backgroundColor: bg }}
                    >
                      <div
                        className="size-3 rounded-full"
                        style={{ backgroundColor: secondary }}
                      ></div>
                      <div
                        className="size-3 rounded-full"
                        style={{ backgroundColor: primary }}
                      ></div>
                      <div
                        className="size-3 rounded-full"
                        style={{ backgroundColor: tertiary }}
                      ></div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Overlay>

      <button
        className="flex gap-1.5 items-center text-primary hover:text-tertiary cursor-pointer transition-colors duration-75"
        onClick={() => setModalActive(true)}
      >
        <FontAwesomeIcon icon={faPalette} />
        {activeTheme}
      </button>
    </>
  );
};
