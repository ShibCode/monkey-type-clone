"use client";

import LoadingPage from "@/components/LoadingPage";
import themes from "@/themes";
import changeTheme from "@/utils/changeTheme";
import onLoad from "@/utils/onLoad";
import {
  faCircleHalfStroke,
  faClock,
  faGauge,
  faPalette,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import SectionHeading from "./SectionHeading";
import { SettingsContext } from "@/context/Settings";
import Setting from "./Setting";

const Settings = () => {
  // states for dropdown of section
  const [themeIsOpen, setThemeIsOpen] = useState(true);
  const [hideElementsIsOpen, setHideElementsIsOpen] = useState(true);

  const [activeTheme, setActiveTheme] = useState("carbon");

  const [isLoaded, setIsLoaded] = useState(false);
  const [colorsLoaded, setColorsLoaded] = useState(false);

  const { settings, setSettings } = useContext(SettingsContext);

  useEffect(() => {
    onLoad(setColorsLoaded);

    const theme = localStorage.getItem("theme");
    if (theme) setActiveTheme(Object.keys(JSON.parse(theme))[0]);

    setIsLoaded(true);
  }, []);

  const addSectionContentClasses = (sectionIsOpen) => {
    return `w-full transition-all origin-top flex flex-col gap-7 ${
      sectionIsOpen ? "max-h-[1000px]" : "max-h-0"
    }`;
  };

  return isLoaded ? (
    <div className="wrapper my-8">
      <div className="contain flex-col gap-8">
        <div className="settings-section">
          <SectionHeading
            heading="theme"
            sectionIsOpen={themeIsOpen}
            setSectionIsOpen={setThemeIsOpen}
          />

          <div className={addSectionContentClasses(themeIsOpen)}>
            <Setting
              icon={faCircleHalfStroke}
              name="flip test colors"
              desc="By default, typed text is brighter than the future text. When enabled, the colors will be flipped and the future text will be brighter than the already typed text."
              buttonOptions={["off", "on"]}
              settingName="flipTestColors"
            />

            <div className="w-full flex flex-col gap-5">
              <h3 className="text-primary">
                <FontAwesomeIcon icon={faPalette} /> theme
              </h3>

              <div className="grid grid-cols-themesLayout gap-2">
                {Object.keys(themes).map((themeName, index) => {
                  const thisTheme = themes[themeName];

                  return (
                    <div
                      key={index}
                      style={{
                        color: thisTheme.secondary,
                        backgroundColor: thisTheme.bg,
                        borderColor:
                          activeTheme === themeName
                            ? thisTheme.secondary
                            : "transparent",
                        borderWidth: 3,
                      }}
                      className="relative h-[40px] flex cursor-pointer transition duration-100 rounded-xl items-center justify-center"
                      onClick={() => {
                        setActiveTheme(themeName);
                        changeTheme(themeName);
                      }}
                    >
                      {themeName}

                      <div className="flex items-center gap-2 absolute right-2">
                        <div
                          className="rounded-full w-5 aspect-square"
                          style={{
                            backgroundColor: thisTheme.secondary,
                          }}
                        ></div>
                        <div
                          className="rounded-full w-5 aspect-square"
                          style={{
                            backgroundColor: thisTheme.primary,
                          }}
                        ></div>
                        <div
                          className="rounded-full w-5 aspect-square"
                          style={{
                            backgroundColor: thisTheme.tertiary,
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <SectionHeading
            heading="hide elements"
            sectionIsOpen={hideElementsIsOpen}
            setSectionIsOpen={setHideElementsIsOpen}
          />

          <div className={addSectionContentClasses(hideElementsIsOpen)}>
            <Setting
              icon={faGauge}
              name="live speed"
              desc="Displays a live speed during the test. Updates once every second."
              buttonOptions={["hide", "show"]}
              settingName="liveWpm"
            />
            <Setting
              icon={faClock}
              name="timer/progress"
              desc="Displays a live timer for timed tests and progress for words/custom tests."
              buttonOptions={["hide", "show"]}
              settingName="timerProgress"
            />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <LoadingPage colorsLoaded={colorsLoaded} />
  );
};

export default Settings;
