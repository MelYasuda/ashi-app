import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import listingsReducer from './reducers/listings';

const rootReducer = listingsReducer;

// before persist
// const configureStore = () => {
//   return createStore(rootReducer);
// };

// export default configureStore;


//after persist
const persistConfig = {
  key: 'root',
  storage: storage,
  // stateReconciler: autoMergeLevel2
}
 
const persistedReducer = persistReducer(persistConfig, rootReducer)

export let store = createStore(persistedReducer)
export let persistor = persistStore(store)