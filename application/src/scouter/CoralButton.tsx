import React, { useState } from "react";
const CoralButton:React.FC = ()=>{
    const [hasPiled, updateHAasPiled] = useState(false)
    const[text, updateText] = useState("Not Piled")
    const [color, changeColor] = useState("#db1616")
    const handleChange = (event)=>{
        updateHAasPiled(!hasPiled)
        if(hasPiled){
            updateText("Piled")
            changeColor("#22e025")
        }
        else{
            updateText("Not Piled")
            changeColor("#db1616")
        }
    }


    const coralButton = <button style={{backgroundColor: color}} onClick={handleChange}>{text}</button>
    return<>  
    {coralButton}
    </>
}
export default CoralButton;