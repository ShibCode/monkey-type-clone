import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Spinner from "@/components/Spinner";

const Button = ({
  icon,
  text,
  className = "",
  disabled = false,
  isLoading = false,
}) => {
  return (
    <button
      className={`text-tertiary bg-bgSecondary transition-all duration-200 h-[35px] rounded-md disabled:hover:bg-bgSecondary disabled:hover:text-tertiary disabled:opacity-70 flex justify-center items-center gap-1.5 ${className} ${
        isLoading ? "" : "hover:text-bgSecondary hover:bg-tertiary"
      }`}
      disabled={disabled}
    >
      {isLoading ? (
        <Spinner className="size-[22px]" />
      ) : (
        <>
          <FontAwesomeIcon icon={icon} /> <span>{text}</span>
        </>
      )}
    </button>
  );
};

export default Button;
