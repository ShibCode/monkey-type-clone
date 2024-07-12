import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Button = ({ icon, text }) => {
  return (
    <button className="text-tertiary bg-bgSecondary hover:text-bgSecondary hover:bg-tertiary transition-all duration-200 h-[35px] rounded-md">
      <FontAwesomeIcon icon={icon} /> {text}
    </button>
  );
};

export default Button;
