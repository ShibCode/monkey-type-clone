import changeTheme from "./changeTheme";

const onLoad = (setColorsState) => {
  if (localStorage.getItem("theme") === null) {
    const primary = getComputedStyle(document.documentElement).getPropertyValue(
      "--primary-color"
    );
    const secondary = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--secondary-color");
    const tertiary = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--tertiary-color");
    const bgColor = getComputedStyle(document.documentElement).getPropertyValue(
      "--bg-color"
    );
    const bgSecondary = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--bg-secondary-color");
    const error = getComputedStyle(document.documentElement).getPropertyValue(
      "--error-color"
    );
    const extra = getComputedStyle(document.documentElement).getPropertyValue(
      "--extra-color"
    );

    const theme = {
      carbon: {
        primary,
        secondary,
        tertiary,
        bgColor,
        bgSecondary,
        error,
        extra,
      },
    };

    localStorage.setItem("theme", JSON.stringify(theme));
  } else {
    const activeTheme = JSON.parse(localStorage.getItem("theme"));
    changeTheme(Object.keys(activeTheme)[0]);
    setColorsState(true);
  }
};
export default onLoad;
