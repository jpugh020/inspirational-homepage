import { useSelector } from "react-redux";
import { todosSelector } from "./todosSlice";
import type { ToDoInterface } from "./todosSlice";
import ToDo from './ToDo.tsx';



export default function ToDosList() {

    const todos = useSelector(todosSelector);
    
    return(
        <>
        <div className="flexContainer" id="todos">
            <ul style={{"listStyleType": "none", "display": "flex", "flexDirection": "row", "flexWrap": "wrap"}}>
                {
                
                    Object.values(todos).length > 0 ? Object.values(todos).map((todo: ToDoInterface, index) => {
                        return (<ToDo todo={todo} key={index} index={index}/>);
                    }) : <p 
                            id="todosPlaceholder" 
                        >Add some Tasks to get started!</p>
                }
            </ul>
        </div>
        </>
    );
}