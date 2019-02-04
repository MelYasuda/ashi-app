let initialState = {
  searchQuery: {
    country: null,
    city: null
  }
}

const reducer = (state = initialState, action) => {
  const { country, city } = action;
  switch (action.type) {
    case 'SEARCH':
    let newState = Object.assign({}, state, {
      searchQuery: {
        country: country,
        city: city
      }
    })
    return newState;
    default:
    return state;
  }
}

export default reducer;