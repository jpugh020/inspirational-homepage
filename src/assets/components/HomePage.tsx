import { useEffect } from "react";
import ToDoForm from "./TodoForm";
import ToDosList from "../features/ToDos/ToDosList";
import ImageControls from "../features/images/ImageControls";
import Weather from "../features/weather/Weather";
import Quote from '../features/quotes/Quote';
export default function HomePage(){
    useEffect(() => {

    }, []);


    return (
        <>
        <div id="weather" >
        <Weather />
        
        </div>
        <div id="addTodos">
        <ToDoForm />
        </div>

        <div id="todos">
            <ToDosList />
        </div>
        <div id="imageControlsContainer">
            <ImageControls />
        </div>

        <div id="quotes" >
        <Quote />

        </div>
        </>
    );
}