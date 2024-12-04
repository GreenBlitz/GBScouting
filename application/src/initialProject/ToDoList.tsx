import React, { useState, useEffect } from "react";
const ToDoList: React.FC =()=>{
    const [tasks, updateTasks]  = useState([])
    const [input, updateInput] = useState("")
    const handleInpuChange = (event)=> {
        updateInput(event.target.value)
    }
    
    const addTask = ()=> { 
        updateTasks([...tasks, " "+input])
        updateInput("")
    }
    return(
        <>
        <h2>Please Enter Your Tasks</h2>
        <input type="text" placeholder="Ur MaMa" value={input} onChange={handleInpuChange}/>
        <button onClick={addTask}>Add</button>
        <ul>{tasks}</ul>
        </>
    )
}
export default ToDoList;
