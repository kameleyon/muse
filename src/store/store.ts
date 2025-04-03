import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { 
  FLUSH, 
  PAUSE, 
  PERSIST, 
  PURGE, 
  REGISTER, 
  REHYDRATE, 
  persistReducer, 
  persistStore 
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import contentReducer from './slices/contentSlice';
import uiReducer from './slices/uiSlice';

// Configure persistence for auth state
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'tokens'], // Only persist these fields
};

// Configure persistence for UI state
const uiPersistConfig = {
  key: 'ui',
  storage,
  whitelist: ['theme', 'sidebarCollapsed'], // Only persist these fields
};

// Create root reducer with persistence
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  content: contentReducer, // Not persisted - frequent updates
  ui: persistReducer(uiPersistConfig, uiReducer),
});

// Configure the store with performance optimizations
export const store = configureStore({
  reducer: rootReducer,
  // Middleware configuration for better performance
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      // Optimize serializable check
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Ignore non-serializable paths
        ignoredPaths: ['auth.user.createdAt', 'auth.user.updatedAt'],
      },
      // Disable immutability check in production for better performance
      immutableCheck: process.env.NODE_ENV !== 'production',
      // Disable thunk serializable check in production for better performance
      thunk: { extraArgument: {} },
    }),
  // Only enable devTools in development
  devTools: process.env.NODE_ENV !== 'production',
});

// Create persisted store
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
