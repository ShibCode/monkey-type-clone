export const getSettingValue = (setting, settings) => {
  let value = "";

  Object.keys(settings).forEach((sectionName) => {
    Object.keys(settings[sectionName]).forEach((settingName) => {
      if (settingName === setting)
        value = settings[sectionName][settingName].active;
    });
  });

  return value;
};
