import {
  faChartPie,
  faCircleHalfStroke,
  faEyeSlash,
  faGauge,
  faLanguage,
  faPalette,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";

const defaultSettings = {
  behaviour: {
    "blind mode": {
      type: "someOpt",
      icon: faEyeSlash,
      desc: "No errors or incorrect words are highlighted. Helps you to focus on raw speed. If enabled, quick end is recommended.",
      options: ["off", ""],
      active: "off",
    },

    language: {
      type: "language",
      icon: faLanguage,
      desc: "Change in which language you want to type.",
      active: "english",
    },
  },

  theme: {
    "flip test colors": {
      type: "someOpt",
      icon: faCircleHalfStroke,
      desc: "By default, typed text is brighter than the future text. When enabled, the colors will be flipped and the future text will be brighter than the already typed text.",
      options: ["off", "on"],
      active: "off",
    },

    theme: {
      type: "theme",
      icon: faPalette,
      active: "carbon",
    },
  },

  "hide elements": {
    "live speed": {
      type: "someOpt",
      icon: faGauge,
      desc: "Displays a live speed during the test. Updates once every second.",
      options: ["hide", "show"],
      active: "hide",
    },

    "live progress": {
      type: "someOpt",
      icon: faChartPie,
      desc: "Displays a live timer for timed tests and word count for word based tests (word, quote or custom mode).",
      options: ["hide", "show"],
      active: "show",
    },

    "out of focus warning": {
      type: "someOpt",
      icon: faWarning,
      desc: " Shows an out of focus reminder after few moments of being 'out of focus' (not being able to type). ",
      options: ["hide", "show"],
      active: "show",
    },
  },
};

export default defaultSettings;
