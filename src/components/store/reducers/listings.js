let initialState = {
  searchQuery: {
    country: null,
    city: null
  }
}

const reducer = (state = initialState, action) => {
  console.log(initialState)
  const { country, city } = action;
  let newState;
  switch (action.type) {
    case 'SEARCH':
    newState=state;
    newState.searchQuery.country = country;
    newState.searchQuery.city = city;
    return newState;
    default:
    return state;
  }
}

export default reducer;