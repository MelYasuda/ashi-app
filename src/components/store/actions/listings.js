export const searchQuery = (country, city) => {
  return {
      type: SEARCH,
      country: country,
      city: city
  };
};