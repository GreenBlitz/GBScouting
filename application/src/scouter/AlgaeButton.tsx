import React, { useState } from "react";
const AutonomousButton:React.FC = ()=>{
    const [hasHarvested, updateHasHarvested] = useState(false)
    const[text, updateText] = useState("Not Harvested")
    const [color, changeColor] = useState("#1a2edb")
    const handleChange = (event)=>{
        updateHasHarvested(!hasHarvested)
        if(hasHarvested){
            updateText("Harvested")
            changeColor("#22e025")
        }
        else{
            updateText("Not Harvested")
            changeColor("#db1616")
        }
    }


    const algaeButton = <button style={{backgroundColor: color}} onClick={handleChange}>{text}</button>
    return<>  
    {algaeButton}
    </>
}
export default AutonomousButton;