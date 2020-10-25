export const defaultTheme = 'blue';

const themes = {
  '/motorbike-guides': 'purple',
  '/hotel-reviews': 'red',
  '/food-drink': 'yellow',
  '/destinations': 'green',
};

export function getThemeFromPathname(pathname) {
  let theme = defaultTheme;
  Object.keys(themes).forEach(key => {
    if (pathname.startsWith(key)) {
      theme = themes[key];
    }
  });
  return theme;
}

export default themes;
