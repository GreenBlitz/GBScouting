import React, { useState } from "react";
const CoralButton:React.FC = ()=>{
    const [hasPiled, updateHAasPiled] = useState(false)
    const[text, updateText] = useState("Not Sedded")
    const [color, changeColor] = useState("#db1616")
    const handleChange = ()=>{
        updateHAasPiled(!hasPiled)
        if(hasPiled){
            updateText("Seeded")
            changeColor("#22e025")
        }
        else{
            updateText("Not Seeded")
            changeColor("#db1616")
        }
    }


    const coralButton = <button style={{backgroundColor: color}} onClick={handleChange}>{text}</button>
    return<>  
    {coralButton}
    </>
}
export default CoralButton;