import type { ToDoInterface } from "./todosSlice";
import { toggleComplete, removeTodo } from "./todosSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import Confetti from "react-dom-confetti";


//Keeping the TS compiler from yelling at me by interfacing a "Todo" type 
interface Todo {
    todo: ToDoInterface,
    index: number
}

export default function ToDo ({todo, index}: Todo) {
    const dispatch = useDispatch();
    const completed: boolean = todo.isCompleted;

    const toggle = () => {
        const item = document.getElementById(`${index}todo`);
        if (!todo.isCompleted) {
            item?.classList.add("completed");
            dispatch(toggleComplete(todo));
        } else {
            item?.classList.remove("completed");
            dispatch(toggleComplete(todo));
        }
    }

    return (
        <li key={index}>
        <div className="todo" id={`${index}todo`}>
        <p >{todo.text}</p>
        <div  className="todoActions">
            <button 
                type="button" 
                onClick={(e) => {
                e.preventDefault();
                toggle();             
            }} 
                id="completeButton" 
                
                className="todoButtons"
                    >{todo.isCompleted ? "Redo" : "Done"}<Confetti active={completed} config={{spread: 360}} /></button>
        
     
            <button type="button" 
                onClick={
                    (e) => {
                        e.preventDefault();
                        document.getElementById(`${index}todo`)?.classList.remove('completed');
                        dispatch(removeTodo(todo));
                        
                    }}
                id="deleteButton" 
                className="todoButtons"
                >Remove</button>
       </div>
        </div>
        
        </li>
    )
}