import Spinner from "@/components/Spinner";
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
  icons = null,
}) => {
  if (notValid === undefined) return;

  return (
    <div className="flex h-[33px] relative">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        autoComplete=""
        className="text-tertiary caret-secondary w-full h-full pl-2 rounded-md placeholder:text-primary outline-none bg-bgSecondary focus-visible:outline-1 focus-visible:outline-tertiary focus-visible:outline"
      />

      {notValid !== null && (
        <div
          tooltip={tooltip ? tooltip : ""}
          className={`!absolute right-0 flex items-center justify-center size-[33px] ${
            tooltip ? "hover-tooltip" : ""
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
