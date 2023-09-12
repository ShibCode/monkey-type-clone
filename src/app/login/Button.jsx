import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Button = ({ icon, text }) => {
  return (
    <button className="text-tertiary bg-bgSecondary h-[35px] rounded-md">
      <FontAwesomeIcon icon={icon} /> {text}
    </button>
  );
};

export default Button;
