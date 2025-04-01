import Spinner from "@/components/Spinner";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { forwardRef } from "react";

const Input = (
  { success, error, loading, tooltip, className, ...props },
  ref
) => {
  return (
    <div className="flex h-[33px] relative">
      <input
        ref={ref}
        className={`text-tertiary caret-secondary w-full h-full pl-2 rounded-md placeholder:text-primary outline-none bg-bgSecondary focus-visible:outline-1 focus-visible:outline-tertiary focus-visible:outline pr-[33px] ${className}`}
        {...props}
      />

      {loading && (
        <div className="absolute right-0 flex items-center justify-center size-[33px] bg-bgSecondary">
          <Spinner className="!size-[19.8px] !m-0" />
        </div>
      )}

      {success && !loading && (
        <div
          tooltip={success.toString()}
          className={`!absolute right-0 flex items-center justify-center size-[33px] bg-bgSecondary ${
            typeof success === "string" && "hover-tooltip"
          }`}
        >
          <FontAwesomeIcon icon={faCheck} className="h-[60%] text-secondary" />
        </div>
      )}

      {error && !loading && (
        <div
          tooltip={error.toString()}
          className={`!absolute right-0 flex items-center justify-center size-[33px] bg-bgSecondary ${
            typeof error === "string" && "hover-tooltip"
          }`}
        >
          <FontAwesomeIcon icon={faXmark} className="h-[60%] text-error" />
        </div>
      )}
    </div>
  );
};

export default forwardRef(Input);
