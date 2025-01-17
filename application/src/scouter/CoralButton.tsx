import React, { useEffect, useState } from "react";
import { AllSushis, SushiToBeChanged, Sushi, ValuesToBePassed } from "./input-types/AutonomousMapInput";const AlgaeButton:React.FC<ValuesToBePassed> = (props)=>{
    let allSushis = props.storage.get()
    const defineCoral = ()=>{
        return allSushis?.[props.sushiToBeChanged].HasSeeded;
    }

    const defineCoralText = ()=>{
        if(defineCoral() == true){
            return "Seeded"
        }
        else{
            return "Not Seeded"
        }
    }

    const defineCoralColor = ()=>{
        if(defineCoral() == true){
            return "#22e025"
        }
        else{
            return "#db1616"
        }
    }

    const setStorage = ()=>{
        if(allSushis){
            props.storage.set(allSushis)
        }
    }
    const changeSushiValue = (valueToChange: boolean)=>{
        if(allSushis){
            allSushis[props.sushiToBeChanged].HasSeeded = valueToChange
            setStorage()
        }

    }

    const [hasSeeded, updateHasSeeded] = useState(defineCoral)
    const[text, updateText] = useState(defineCoralText)
    const [color, changeColor] = useState(defineCoralColor)
    const handleChange = ()=>{
        allSushis = props.storage.get()
        updateHasSeeded(!hasSeeded)
        if(!hasSeeded){
            updateText("Seeded")
            changeColor("#22e025")
            changeSushiValue(true)
        }
        else{
            updateText("Not Seeded")
            changeColor("#db1616")
            changeSushiValue(false)
        }
    }
    const algaeButton = <button style={{backgroundColor: color}} onClick={handleChange}>{text}</button>
    return<>  
    {algaeButton}
    </>
}
export default AlgaeButton;