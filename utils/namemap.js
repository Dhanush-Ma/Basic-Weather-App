export const NAME_MAP = new Map();

addMapping([0, 1], 'Hot');
addMapping([2], 'Partly Cloudy');
addMapping([3], 'Cloudy');
addMapping([45, 48], 'Fog');
addMapping([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82], 'Raining');
addMapping([71, 73, 75, 77, 85, 86], 'Snowy');
addMapping([95, 96, 99], 'Thunderstrom');

function addMapping(values, icon) {
  values.forEach(value => {
    NAME_MAP.set(value, icon);
  });
}
