import { SettingsContext } from "@/context/Settings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";

const Setting = ({ icon, name, desc, buttonOptions, settingName }) => {
  const { settings, setSettings } = useContext(SettingsContext);

  const thisSetting = settings[settingName];

  return (
    <div className="flex justify-between items-center gap-6">
      <div>
        <div className="text-primary">
          <FontAwesomeIcon icon={icon} className="mr-2" />
          {name}
        </div>

        <p className="text-tertiary">{desc}</p>
      </div>

      <div className="flex gap-2 min-w-[375px]">
        {buttonOptions.map((option, index) => {
          return (
            <button
              key={index}
              className={`h-[36px] w-full rounded-lg border-transparent hover:bg-tertiary hover:text-bgColor transition-all duration-150 ${
                thisSetting === option
                  ? "bg-secondary text-bgColor"
                  : "bg-bgSecondary text-tertiary"
              }`}
              onClick={() =>
                setSettings((prev) => ({
                  ...prev,
                  [settingName]: option,
                }))
              }
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Setting;
