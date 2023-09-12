import React from "react";

const Input = ({ type = "text", placeholder, onChange, name, value }) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      autoComplete={false}
      className="text-tertiary outline-none caret-secondary h-[33px] pl-2 rounded-md bg-bgSecondary placeholder:text-primary"
    />
  );
};

export default Input;
