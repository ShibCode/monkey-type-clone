const getColor = (type, opacity = 1) => {
  const theme = JSON.parse(localStorage.getItem("monkey-type-clone-theme"));
  const themeName = Object.keys(theme);

  const color = theme[themeName][type];

  return hexToRgbA(color, opacity);
};

export default getColor;

function hexToRgbA(hex, opacity) {
  var c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = "0x" + c.join("");
    return (
      "rgba(" +
      [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") +
      "," +
      opacity +
      ")"
    );
  }
  throw new Error("Bad Hex");
}
