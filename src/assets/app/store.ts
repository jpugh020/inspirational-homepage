import {configureStore} from '@reduxjs/toolkit';
import todosReducer from '../features/ToDos/todosSlice.ts';
import imagesReducer from '../features/images/imagesSlice.ts';
import weatherReducer from '../features/weather/weatherSlice.ts';
import quotesReducer from '../features/quotes/quotesSlice.ts'




export const store = configureStore({
    reducer: {
        todosReducer: todosReducer,
        imagesReducer: imagesReducer,
        weatherReducer: weatherReducer,
        quotesReducer: quotesReducer
    },
});

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch;

export type AppStore = typeof store;

