import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import mailReducer from './slices/mail';
import chatReducer from './slices/chat';
import productReducer from './slices/product';
import calendarReducer from './slices/calendar';
import kanbanReducer from './slices/kanban';
import productCharsReducer from './slices/product-char';
import productTypeReducer from './slices/product-type';
import addressReducer from './slices/address';
import deliveryService from './slices/deliveryService';
import menu from './slices/menu';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

const rootReducer = combineReducers({
  mail: mailReducer,
  chat: chatReducer,
  calendar: calendarReducer,
  kanban: kanbanReducer,
  product: persistReducer(productPersistConfig, productReducer),
  productChars: productCharsReducer,
  productTypes: productTypeReducer,
  addresses:addressReducer,
  deliveryServices:deliveryService,
  menu:menu,
});

export { rootPersistConfig, rootReducer };
