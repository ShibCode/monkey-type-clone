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
import React, { useEffect, useState } from "react";
import themes from "@/data/themes.json";
import changeTheme from "@/utils/changeTheme";
import useUpdateEffect from "@/hooks/useUpdateEffect";

const Footer = () => {
  return (
    <footer className="wrapper mt-auto py-7 text-sm">
      <div className="contain justify-between">
        <ul className="flex items-center gap-5">
          <li className="flex items-center gap-1.5 text-primary hover:text-tertiary cursor-pointer transition-colors duration-75">
            <FontAwesomeIcon icon={faEnvelope} />
            contact
          </li>
          <li className="flex items-center gap-1.5 text-primary hover:text-tertiary cursor-pointer transition-colors duration-75">
            <FontAwesomeIcon icon={faDonate} />
            support
          </li>
          <li className="flex items-center gap-1.5 text-primary hover:text-tertiary cursor-pointer transition-colors duration-75">
            <FontAwesomeIcon icon={faCode} />
            github
          </li>
          <li className="flex items-center gap-1.5 text-primary hover:text-tertiary cursor-pointer transition-colors duration-75">
            <FontAwesomeIcon icon={faDiscord} />
            discord
          </li>
          <li className="flex items-center gap-1.5 text-primary hover:text-tertiary cursor-pointer transition-colors duration-75">
            <FontAwesomeIcon icon={faTwitter} />
            twitter
          </li>
          <li className="flex items-center gap-1.5 text-primary hover:text-tertiary cursor-pointer transition-colors duration-75">
            <FontAwesomeIcon icon={faFileContract} />
            terms
          </li>
          <li className="flex items-center gap-1.5 text-primary hover:text-tertiary cursor-pointer transition-colors duration-75">
            <FontAwesomeIcon icon={faShieldAlt} />
            security
          </li>
          <li className="flex items-center gap-1.5 text-primary hover:text-tertiary cursor-pointer transition-colors duration-75">
            <FontAwesomeIcon icon={faLock} />
            privacy
          </li>
        </ul>

        <ChangeTheme />
      </div>
    </footer>
  );
};

export default Footer;

const ChangeTheme = () => {
  const { getSettingValue, setSettingValue } = useSettings();
  const activeTheme = getSettingValue("theme");

  const [modalActive, setModalActive] = useState(true);
  const [tempActiveTheme, setTempActiveTheme] = useState(activeTheme);

  const [search, setSearch] = useState("");
  const [filteredThemes, setFilteredThemes] = useState(Object.keys(themes));

  const tempChangeTheme = (themeName) => {
    setTempActiveTheme(themeName);
  };

  useUpdateEffect(() => {
    const id = setTimeout(() => changeTheme(tempActiveTheme), 250);
    return () => clearTimeout(id);
  }, [tempActiveTheme]);

  useUpdateEffect(() => {
    if (!modalActive) changeTheme(activeTheme);
  }, [modalActive]);

  useUpdateEffect(() => {
    const filteredThemes = Object.keys(themes).filter((themeName) =>
      themeName.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredThemes(filteredThemes);
  }, [search]);

  return (
    <>
      <Overlay isActive={modalActive} setIsActive={setModalActive}>
        <div
          className="bg-bgColor w-[90%] max-w-[600px] rounded-lg overflow-auto max-h-[70vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-[52px] flex px-4 gap-3">
            <div className="flex items-center text-lg">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="text-primary"
              />
            </div>

            <input
              placeholder="Search..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none caret-secondary text-tertiary placeholder:text-primary text-base"
            />
          </div>

          <div className="flex flex-col">
            {filteredThemes.map((themeName) => {
              const { primary, secondary, tertiary, bg } = themes[themeName];

              return (
                <button
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
                        activeTheme === themeName ? "opacity-100" : "opacity-0"
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
