import { useSettings } from "@/context/Settings";
import React from "react";

const Word = ({ word, wIndex, typedWords }) => {
  const { getSettingValue } = useSettings();

  // word is eg ['hello'] or ['Antigua', 'and', 'Barbuda']
  // part is each part of that word eg 'hello' or 'Antigua', 'and', 'Barbuda'
  return word.map((part, pIndex) => {
    return (
      <div key={pIndex} className="inline">
        {part.split("").map((char, cIndex) => {
          const typedWord = typedWords[wIndex] ?? [];
          const typedPart = typedWord[pIndex] ?? [];

          const typedPartLength = typedPart.length;

          return (
            <span
              key={`letter-${wIndex}${pIndex}${cIndex}`}
              id={`letter-${wIndex}${pIndex}${cIndex}`}
              className={`text-2xl select-none ${
                typedPart && typedPart[cIndex] === char
                  ? getSettingValue("flip test colors") === "on"
                    ? "text-primary"
                    : "text-secondary"
                  : cIndex >= typedPartLength
                  ? getSettingValue("flip test colors") === "on"
                    ? "text-secondary"
                    : "text-primary"
                  : getSettingValue("blind mode") === ""
                  ? getSettingValue("flip test colors") === "on"
                    ? "text-primary"
                    : "text-secondary"
                  : "text-error"
              }
              
            `}
            >
              {char}
            </span>
          );
        })}

        {typedWords[wIndex] &&
          typedWords[wIndex][pIndex] &&
          typedWords[wIndex][pIndex]
            .split("")
            .slice(part.length)
            .map((char, eIndex) => {
              // eIndex refers to "Extra Index" i.e. the extra letters typed beyond the scope of the word
              return (
                <span
                  key={`letter-${wIndex}${pIndex}${part.length + eIndex}`}
                  id={`letter-${wIndex}${pIndex}${part.length + eIndex}`}
                  className={`text-2xl select-none ${
                    getSettingValue("blind mode") === ""
                      ? getSettingValue("flip test colors") === "on"
                        ? "text-primary"
                        : "text-secondary"
                      : "text-extra"
                  }`}
                >
                  {char}
                </span>
              );
            })}
      </div>
    );
  });
};

export default Word;
