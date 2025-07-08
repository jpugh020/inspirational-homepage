import {useState, useEffect} from 'react';
import { addTodo } from '../features/ToDos/todosSlice';
import { useDispatch } from 'react-redux';
//I'm using uuids just as an "easy" id system for the tasks. 
import { v4 as uuidv4 } from 'uuid';





export default function ToDoForm() {

const [task, setTask] = useState("");
const dispatch = useDispatch();



useEffect(() => {

}, []);



    return (<>
    <form
    id="todoForm" 
    onSubmit={(e) => {
        e.preventDefault();
    if(task !== ""){
        dispatch(addTodo({id: uuidv4(), text: task, isCompleted: false}));
        setTask("");
    } else {
        alert("Please enter a task!");
    }}}>
    <input type="text" name="task" className="opacity" id="taskInput" onChange={e => setTask(e.target.value)} placeholder="Enter a task to add!" value={task} />
    <br />
    <button type="submit" id="taskSubmit" className="opacity" >Submit Task</button>
    </form>
    </>);
}