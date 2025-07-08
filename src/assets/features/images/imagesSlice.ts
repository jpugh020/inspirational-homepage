import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {createApi} from 'unsplash-js';
import type { Photos } from 'unsplash-js/dist/methods/search/types/response';
import type { RootState } from '../../app/store';




const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

const api = createApi({ 
    accessKey: accessKey!  
});

export type Photo = {
  id: string;  
  width: number;
  height: number;
  urls: { large: string; regular: string; raw: string; small: string };
  color: string | null;
  user: {
    username: string;
    name: string;
  };
};

export interface ImagesState {
    images: Photos | null;  
    urls: Array<string> ;
    loading: boolean;
    error: string | null | object;
    currentImage: string | null;   
}

const initialState: ImagesState = {
    images: null,  // Fixed: null instead of {}
    urls: [],
    loading: false,
    error: null,
    currentImage: null
}

// Fixed async thunk with proper typing
export const getImages = createAsyncThunk<Photos, { rejectValue: string }>(
    'images/getImages', 
    async (arg, {rejectWithValue}) => {
        try {
            const photos = await api.search.getPhotos({
                query: arg.toString(), 
                orientation: "landscape"
            });

            if (photos.errors) {
                return rejectWithValue(photos.errors[0]);
            } else if (photos.response === null) {
                return rejectWithValue("No response received");
            } else {
                
                return photos.response;
            }
        } catch (error) {
            console.error(error);
            return rejectWithValue('Failed to fetch images');
        }
    }
);

const imagesSlice = createSlice({
    name: 'images',
    initialState: initialState,
    reducers: {
        clearImages: (state) => {
            state.images = null;
            state.urls = [];
        },
        nextImage: (state) => {
            const index = state.urls?.findIndex((value) => {return value === state.currentImage});
            if (index < state.urls.length - 1) {
                state.currentImage = state.urls[index+1];
            } else {
                state.currentImage = state.urls[0];
            }
        },
        prevImage: (state) => {
            const index = state.urls?.findIndex((value) => {return value === state.currentImage});
            if (index > 0) {
                state.currentImage = state.urls[index-1]
            } else {
                state.currentImage = state.urls[state.urls?.length - 1];
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getImages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getImages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Unknown error';
            })
            .addCase(getImages.fulfilled, (state, action) => {
                state.loading = false;
                state.images = action.payload;
                state.error = null;
                let urlsToAdd: Array<string> = [];
                action.payload.results.forEach((photo, index) => {
                    urlsToAdd[index] = photo.urls.regular;
                });
                state.urls = urlsToAdd;
                state.currentImage = state.urls[0];
            });
    }
});

export const { clearImages, nextImage, prevImage } = imagesSlice.actions;
export  function selectImageUrl(state: RootState)  {
    return state.imagesReducer.currentImage;
}

export const selectImages = (state: RootState) => {
    return state.imagesReducer.images?.results;
}

export const selectPhotographer = (state: RootState) => {
   const index = state.imagesReducer.images?.results.findIndex((photo) => photo.urls.regular === state.imagesReducer.currentImage);
   return state.imagesReducer.images?.results[index!].user.username;
}   


export const selectUrls = (state: RootState) => {
    return state.imagesReducer.urls;
}
export default imagesSlice.reducer;