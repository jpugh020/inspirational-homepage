import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { fetchWeatherApi } from "openmeteo";






// Define proper types for your weather data
interface WeatherData {
    current: {
        time: string; // ISO string instead of Date
        temperature: number;
        weatherCode: number;
        windSpeed: number;
        windDirection: number;
    };
    hourly: {
        time: string[]; // ISO strings instead of Date[]
        temperature: number[]; // regular arrays instead of Float32Array
        precipitation: number[];
    };
    daily: {
        time: string[]; // ISO strings instead of Date[]
        weatherCode: number[]; // regular arrays instead of Float32Array
        temperatureMax: number[];
        temperatureMin: number[];
         
    };
}

export const getWeather = createAsyncThunk<WeatherData, void, { rejectValue: string }>(
    'weather/getWeather',
    async ({lat, lon}, { rejectWithValue }) => {
        try {
            const url = "https://api.open-meteo.com/v1/forecast";
            const params = {
                "latitude": lat,
                "longitude": lon,
                "timezone": "America/Chicago",
                "current": ["temperature_2m", "weather_code", "wind_speed_10m", "wind_direction_10m"],
                "hourly": ["temperature_2m", "precipitation"],
                "daily": ["weather_code", "temperature_2m_max", "temperature_2m_min", "sunrise", "sunset"],
                "models": "gfs_seamless"
            };
            
            const responses = await fetchWeatherApi(url, params);

            // Helper function to form time ranges
            const range = (start: number, stop: number, step: number) =>
                Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

            // Process first location
            const response = responses[0];

            // Attributes for timezone and location
            const utcOffsetSeconds = response.utcOffsetSeconds();

            const current = response.current()!;
            const hourly = response.hourly()!;
            const daily = response.daily()!;

            // Create the weather data object
            const weatherData: WeatherData = {
                current: {
                    time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000).toISOString(),
                    temperature: current.variables(0)!.value(),
                    weatherCode: current.variables(1)!.value(),
                    windSpeed: current.variables(2)!.value(),
                    windDirection: current.variables(3)!.value()
                },
                hourly: {
                    time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
                        (t) => new Date((t + utcOffsetSeconds) * 1000).toISOString()
                    ),
                    temperature: Array.from(hourly.variables(0)!.valuesArray()!),
                    precipitation: Array.from(hourly.variables(1)!.valuesArray()!),
                },
                daily: {
                    time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
                        (t) => new Date((t + utcOffsetSeconds) * 1000).toISOString()
                    ),
                    weatherCode: Array.from(daily.variables(0)!.valuesArray()!),
                    temperatureMax: Array.from(daily.variables(1)!.valuesArray()!),
                    temperatureMin: Array.from(daily.variables(2)!.valuesArray()!),
                    
                }
            };

            // Debug logging (optional)
            

            // IMPORTANT: Return the weatherData so it becomes action.payload
            return weatherData;

        } catch (error) {
            console.error('Error fetching weather data:', error);
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch weather data');
        }
    }
);

export interface WeatherType {
    lat: number | null;
    lon: number | null;
    weatherData: WeatherData | null;
    loading: boolean;
    error: string | null;
}

const initialState: WeatherType = {
    lat: 36.170669469517364,
    lon: -86.74676598332051,
    weatherData: null,
    loading: false,
    error: null
}

const weatherSlice = createSlice({
    name: 'weather',
    initialState: initialState,
    reducers: {
        clearWeatherData: (state) => {
            state.weatherData = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getWeather.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getWeather.fulfilled, (state, action) => {
                state.loading = false;
                state.weatherData = action.payload;
                state.error = null;
            })
            .addCase(getWeather.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch weather data';
            });
    }
});

export const { clearWeatherData } = weatherSlice.actions;

export const selectWeather = (state: RootState) => {
    return state.weatherReducer.weatherData;
};

export const selectWeatherLoading = (state: RootState) => {
    return state.weatherReducer.loading;
};

export const selectWeatherError = (state: RootState) => {
    return state.weatherReducer.error;
};

export default weatherSlice.reducer;