export const ICON_MAP = new Map();

addMapping([0, 1], 'weather-sunny');
addMapping([2], 'weather-partly-cloudy');
addMapping([3], 'weather-cloudy');
addMapping([45, 48], 'weather-fog');
addMapping(
  [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82],
  'weather-pouring',
);
addMapping([71, 73, 75, 77, 85, 86], 'weather-snowy');
addMapping([95, 96, 99], 'weather-lightning-rainy');

function addMapping(values, icon) {
  values.forEach(value => {
    ICON_MAP.set(value, icon);
  });
}
