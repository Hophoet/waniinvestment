import {createStore, combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import authentificationReducer from './reducers/authentification';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

export default createStore(
  persistReducer(persistConfig, authentificationReducer),
);
