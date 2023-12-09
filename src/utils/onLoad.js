import changeTheme from "./changeTheme";
import themes from "@/data/themes";

const onLoad = (setColorsState) => {
  if (localStorage.getItem("monkey-type-clone-theme") === null) {
    const theme = {
      carbon: themes.carbon,
    };
    localStorage.setItem("monkey-type-clone-theme", JSON.stringify(theme));
  } else {
    const activeTheme = JSON.parse(
      localStorage.getItem("monkey-type-clone-theme")
    );
    changeTheme(Object.keys(activeTheme)[0]);
    setColorsState(true);
  }
};
export default onLoad;
