import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Setting from "./Setting";

const Section = ({ heading, settings }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex flex-col">
      <div
        className="px-[25px] text-primary text-[32px] flex items-center gap-5 cursor-pointer select-none hover:text-tertiary w-fit transition-colors duration-100"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <button>
          <FontAwesomeIcon
            icon={faChevronDown}
            className={`!transition-transform duration-100 ease-linear ${
              isExpanded ? "rotate-0" : "-rotate-90"
            }`}
          />
        </button>

        <h2>{heading}</h2>
      </div>

      <div
        className={`grid !transition-[grid-template-rows] duration-200 ease-in-out ${
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="px-[25px] overflow-hidden">
          <div className="flex flex-col gap-5 py-4">
            {Object.keys(settings).map((settingName, i) => {
              const setting = { ...settings[settingName], title: settingName };
              return <Setting key={i} {...setting} sectionHeading={heading} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section;
