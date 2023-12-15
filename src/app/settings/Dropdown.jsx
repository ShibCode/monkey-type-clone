import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

const Dropdown = ({ active, groups, updateSetting }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-2 w-1/3 relative">
      <button
        className="bg-bgSecondary text-tertiary h-[38px] flex justify-between items-center px-3 rounded-lg"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <span>{active.replace(/_/g, " ")}</span>
        <FontAwesomeIcon icon={faCaretDown} />
      </button>

      {isExpanded && (
        <div className="bg-bgColor border border-bgSecondary absolute w-full top-full max-h-[194px] overflow-auto shadow-lg">
          {groups.map((group, index) => (
            <div key={index}>
              <div className="px-3 text-tertiary font-bold h-8 flex items-center">
                {group.name}
              </div>

              <ul>
                {group.languages.map((language, i) => (
                  <li
                    key={i}
                    onClick={() => {
                      updateSetting(language);
                      setIsExpanded(false);
                    }}
                    className={`px-6 h-8 flex items-center !duration-100 cursor-pointer ${
                      active === language
                        ? "text-bgColor bg-secondary"
                        : "text-primary hover:bg-tertiary hover:text-bgColor"
                    }`}
                  >
                    {language.replace(/_/g, " ")}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
