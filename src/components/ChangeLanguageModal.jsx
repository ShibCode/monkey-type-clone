import React from "react";
import Overlay from "./Overlay";
import groups from "../../public/languages/groups";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useSettings } from "@/context/Settings";

const ChangeLanguageModal = ({ isActive, setIsActive, duringTestRestart }) => {
  const languages = groups.reduce(
    (acc, curr) => [...acc, ...curr.languages.map((language) => language)],
    []
  );

  const { getSettingValue, setSettingValue } = useSettings();

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
              onClick={() => {
                setSettingValue("language", language);
                setIsActive(false);
                duringTestRestart();
              }}
            >
              <FontAwesomeIcon
                icon={faCheck}
                className={
                  getSettingValue("language") === language
                    ? "opacity-100 visible"
                    : "opacity-0 invisible"
                }
              />
              <span>{language.replace(/_/g, " ")}</span>
            </li>
          ))}
        </ul>
      </div>
    </Overlay>
  );
};

export default ChangeLanguageModal;
