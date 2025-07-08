import {createSlice} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store.ts';


//Define the slice state type

export interface ToDosState {
    todos: Record<string, ToDoInterface>
}

export interface ToDoInterface {
    id: string,
    text: string,
    isCompleted: boolean
}


const initialState: ToDosState = {
    todos: {}
}

const todosSlice = createSlice({
    name: 'todos',
    initialState: initialState,
    reducers: {
        addTodo: (state, action: PayloadAction<ToDoInterface>) => {
             state.todos[action.payload.id] = action.payload;
        },
        toggleComplete: (state, action: PayloadAction<ToDoInterface>) => {
            state.todos[action.payload.id].isCompleted = !state.todos[action.payload.id].isCompleted;
        },
        removeTodo: (state, action: PayloadAction<ToDoInterface>) => {
            delete state.todos[action.payload.id];
        }
    }
});

export const {addTodo, toggleComplete, removeTodo} = todosSlice.actions;

export const todosSelector = (state: RootState) => {
    return state.todosReducer.todos;
}


export default todosSlice.reducer;