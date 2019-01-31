import { createStore, combineReducers } from 'redux';

import listingsReducer from './reducers/listings';

const rootReducer = combineReducers({
  listings: listingsReducer
});

const configureStore = () => {
  return createStore(rootReducer);
};

export default configureStore;