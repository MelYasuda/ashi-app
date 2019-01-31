const initialState = {
  searchQuery: {
    country: null,
    city: null
  }
}

const reducer = (state = initialState, action) => {
  const { country, city } = action;
  switch (action.type) {
    case 'SEARCH':
    state.searchQuery.country = country;
    state.searchQuery.city = city;
    console.log(state)
    return state;
    default:
    return state;
  }
}

export default reducer;