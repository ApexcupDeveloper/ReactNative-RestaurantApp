import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from '@react-native-async-storage/async-storage';

const middleware = [thunk];
// Middleware: Redux Persist Config
const persistConfig = {
    // Root
    key: "root-1",
    // Storage Method (React Native)
    storage: AsyncStorage,

    // Whitelist (Save Specific Reducers)
    // Blacklist (Don't Save Specific Reducers)
    // blacklist: [
    //     "auth"
    // ],
};

// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
    persistedReducer,
    compose(
        applyMiddleware(...middleware),
        // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);

// Middleware: Redux Persist Persister
let persistor = persistStore(store);
// persistor.purge();
// Exports
export { store, persistor };
