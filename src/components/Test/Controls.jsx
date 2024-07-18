import React from "react";
import { useTestEssentials } from "@/context/TestEssentials";
import { MODES } from "./index";

const Controls = ({ mode, changeMode }) => {
  const { testStarted } = useTestEssentials();

  return (
    <div
      className={`flex text-[14px] gap-4 self-center transition-all duration-150 bg-bgSecondary rounded-lg px-4 py-2.5 ${
        testStarted ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex gap-4">
        {Object.keys(MODES).map((modeName) => (
          <button
            key={modeName}
            onClick={() => changeMode(modeName, MODES[modeName][0])}
            className={`text-primary cursor-pointer ${
              mode.name === modeName && "text-secondary"
            }`}
          >
            {modeName}
          </button>
        ))}
      </div>
      <div className="bg-bgColor self-stretch w-1"></div>

      <Categories
        modeName={mode.name}
        activeCategory={mode.category}
        changeMode={changeMode}
      />
    </div>
  );
};

export default Controls;

const Categories = ({ modeName, activeCategory, changeMode }) => {
  const categories = MODES[modeName];

  return (
    <div className="flex gap-4">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => changeMode(modeName, category)}
          className={`text-primary cursor-pointer ${
            activeCategory === category && "text-secondary"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};
