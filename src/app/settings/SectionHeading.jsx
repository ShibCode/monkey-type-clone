import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const SectionHeading = ({ heading, sectionIsOpen, setSectionIsOpen }) => {
  return (
    <h2
      className="text-primary text-4xl cursor-pointer"
      onClick={() => setSectionIsOpen((prev) => !prev)}
    >
      <FontAwesomeIcon
        icon={faChevronDown}
        className={`transition ${sectionIsOpen ? "rotate-0" : "-rotate-90"}`}
      />{" "}
      {heading}
    </h2>
  );
};

export default SectionHeading;
