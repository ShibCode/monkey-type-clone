import themes from "@/themes";

const changeTheme = (theme) => {
  const { primary, secondary, tertiary, bg, bgSecondary, error, extra } =
    themes[theme];

  document.documentElement.style.setProperty("--primary-color", primary);
  document.documentElement.style.setProperty("--secondary-color", secondary);
  document.documentElement.style.setProperty("--tertiary-color", tertiary);
  document.documentElement.style.setProperty("--bg-color", bg);
  document.documentElement.style.setProperty(
    "--bg-secondary-color",
    bgSecondary
  );
  document.documentElement.style.setProperty("--error-color", error);
  document.documentElement.style.setProperty("--extra-color", extra);

  localStorage.setItem(
    "theme",
    JSON.stringify({
      [theme]: {
        primary,
        secondary,
        tertiary,
        bgColor: bg,
        bgSecondary,
        error,
        extra,
      },
    })
  );
};

export default changeTheme;
