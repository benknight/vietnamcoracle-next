const themes = {
  default: 'blue',
  motorbikeGuides: 'green',
  hotelReviews: 'red',
  foodDrink: 'yellow',
  destinations: 'purple',
};

const pathToTheme = {
  '/motorbike-guides': themes.motorbikeGuides,
  '/hotel-reviews': themes.hotelReviews,
  '/food-drink': themes.foodDrink,
  '/destinations': themes.destinations,
};

export const getThemeFromPathname = (pathname: string): string => {
  let theme = themes.default;
  Object.keys(pathToTheme).forEach(key => {
    if (pathname.startsWith(key)) {
      theme = pathToTheme[key];
    }
  });
  return theme;
};

export default themes;
