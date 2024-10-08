import React from "react";
import themes from "@/data/themes";
import { useSettings } from "@/context/Settings";
import groups from "../../../public/languages/groups.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dropdown from "./Dropdown";

const Setting = ({ type, icon, title, desc, options, active }) => {
  const { setSettingValue } = useSettings();

  const updateSetting = (newValue) => setSettingValue(title, newValue);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center gap-y-3 gap-x-6 w-full flex-col sm:flex-row">
        <div className={`flex flex-col w-full sm:w-2/3 flex-1`}>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={icon} className="text-primary" />

            <h6 className="text-primary">{title}</h6>
          </div>

          {desc && <p className="text-tertiary">{desc}</p>}
        </div>

        {type === "someOpt" && (
          <div className="flex gap-2 w-full sm:w-1/3">
            {options.map((option, i) => (
              <button
                key={i}
                onClick={() => updateSetting(option)}
                className={`h-9 w-full rounded-lg hover:bg-tertiary hover:text-bgColor transition-colors ${
                  option === active
                    ? "bg-secondary text-bgColor"
                    : "bg-bgSecondary text-tertiary"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {type === "language" && (
          <Dropdown
            active={active}
            groups={groups}
            updateSetting={updateSetting}
          />
        )}
      </div>

      {type === "manyOpt" && (
        <div className="grid grid-cols-5 gap-2">
          {options.map((option, i) => (
            <button
              key={i}
              onClick={() => updateSetting(option)}
              className={`h-9 w-full rounded-lg hover:bg-tertiary hover:text-bgColor transition-colors ${
                option === active
                  ? "bg-secondary text-bgColor"
                  : "bg-bgSecondary text-tertiary"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {type === "theme" && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-2">
          {Object.keys(themes).map((themeName, i) => {
            const { primary, secondary, tertiary, bg } = themes[themeName];

            return (
              <button
                key={i}
                onClick={() => updateSetting(themeName)}
                style={{ color: secondary, backgroundColor: bg }}
                className={`group h-9 w-full rounded-lg hover:scale-105 hover:z-10 !transition-transform relative ${
                  themeName === active ? "outline scale-105 z-20" : ""
                }`}
              >
                {themeName}

                <div
                  className={`absolute top-1/2 -translate-y-1/2 right-3 flex gap-2 group-hover:opacity-100 transition-opacity durtaion-100 ${
                    themeName === active ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: secondary }}
                  ></div>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: primary }}
                  ></div>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: tertiary }}
                  ></div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Setting;
