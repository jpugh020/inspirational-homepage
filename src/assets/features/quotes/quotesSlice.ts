import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store.ts";

export const getQuotes = createAsyncThunk(
    'quotes/getQuotes',
    async () => {
        const data = await fetch(`https://api.quotable.io/random`);
        const json = await data.json();
        return json;
    }
);

export interface QuoteState {
    
  _id: string
  // The quotation text
  content: string
  // The full name of the author
  author: string
  // The `slug` of the quote author
  authorSlug: string
  // The length of quote (number of characters)
  length: number
  // An array of tag names for this quote
  tags: string[]

}

const initialState: QuoteState = {
    _id: "",
    content: "",
    author: "",
    authorSlug: "",
    length: 0,
    tags: [""]
}
const quotesSlice = createSlice({
    name: 'quotes',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getQuotes.fulfilled, (state, action) => {
            state._id = action.payload._id;
            state.content = action.payload.content;
            state.author = action.payload.author;
            state.authorSlug = action.payload.authorSlug;
            state.length = action.payload.length;
            state.tags = action.payload.tags;
        })
    }
});

export const selectQuote = (state: RootState) => {
    return state.quotesReducer;
}


export default quotesSlice.reducer;