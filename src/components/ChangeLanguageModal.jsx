import React from "react";
import Overlay from "./Overlay";
import groups from "../../public/languages/groups";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { getSettingValue } from "@/utils/getSettingValue";
import { useSettings } from "@/context/Settings";

const ChangeLanguageModal = ({ isActive, setIsActive }) => {
  const languages = groups.reduce(
    (acc, curr) => [
      ...acc,
      ...curr.languages.map((language) => language.replace(/_/g, " ")),
    ],
    []
  );

  const { settings } = useSettings();

  console.log(getSettingValue("language", settings));

  return (
    <Overlay isActive={isActive} setIsActive={setIsActive}>
      <div
        className="bg-bgColor w-[90%] max-w-[600px] rounded-lg overflow-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <ul>
          {languages.map((language, index) => (
            <li
              className="flex items-center px-6 gap-3 text-primary text-sm h-[30px] bg-transparent hover:bg-tertiary hover:text-bgColor transition-colors duration-150 cursor-pointer"
              key={index}
            >
              <FontAwesomeIcon
                icon={faCheck}
                className={
                  getSettingValue("language", settings).replace(/_/g, " ") ===
                  language
                    ? "opacity-100 visible"
                    : "opacity-0 invisible"
                }
              />
              <span>{language}</span>
            </li>
          ))}
        </ul>
      </div>
    </Overlay>
  );
};

export default ChangeLanguageModal;
