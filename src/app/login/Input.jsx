import Spinner from "@/components/Spinner";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Input = ({
  type = "text",
  placeholder,
  onChange,
  name,
  value,
  notValid = null,
  tooltip = null,
  required = false,
}) => {
  const icons = { valid: faCheck, invalid: faXmark };

  if (notValid === undefined) return;

  return (
    <div className="flex h-[33px] relative">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
        value={value}
        className="text-tertiary caret-secondary w-full h-full pl-2 rounded-md placeholder:text-primary outline-none bg-bgSecondary focus-visible:outline-1 focus-visible:outline-tertiary focus-visible:outline"
      />

      {notValid !== null && (
        <div
          tooltip={tooltip && value && tooltip}
          className={`!absolute right-0 flex items-center justify-center size-[33px] bg-bgSecondary ${
            tooltip && value ? "hover-tooltip" : ""
          }`}
        >
          {value &&
            (notValid === "LOADING" ? (
              <Spinner className="!size-[19.8px] !m-0" />
            ) : (
              <FontAwesomeIcon
                icon={notValid ? icons.invalid : icons.valid}
                className={`h-[60%] ${
                  notValid ? "text-error" : "text-secondary"
                }`}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default Input;
