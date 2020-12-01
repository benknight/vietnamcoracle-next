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

exports.getThemeFromPathname = pathname => {
  let theme = themes.default;
  Object.keys(pathToTheme).forEach(key => {
    if (pathname.startsWith(key)) {
      theme = pathToTheme[key];
    }
  });
  return theme;
};

exports.themes = themes;