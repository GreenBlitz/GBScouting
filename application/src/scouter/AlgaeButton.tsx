import React, { useEffect, useState } from "react";
import { AllSushis, SushiToBeChanged, Sushi, ValuesToBePassed } from "./input-types/AutonomousMapInput";const AlgaeButton:React.FC<ValuesToBePassed> = (props)=>{
    let allSushis = props.storage.get() 
    const defineAlgae = ()=>{
        return allSushis?.[props.sushiToBeChanged].HasHarvested
    }

    const defineAlgaeText = ()=>{
        if(defineAlgae()){
            return "Harvested"
        }
        else{
            return "Not Harvested"
        }
    }

    const defineAlgaeColor = ()=>{
        if(defineAlgae()){
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
            allSushis[props.sushiToBeChanged].HasHarvested = valueToChange
            setStorage()
        }
    }

    const [hasHarvested, updateHasHarvested] = useState(defineAlgae)
    const[text, updateText] = useState(defineAlgaeText)
    const [color, changeColor] = useState(defineAlgaeColor)
    const handleChange = ()=>{
        allSushis = props.storage.get()
        updateHasHarvested(!hasHarvested)
        if(!hasHarvested){
            updateText("Harvested")
            changeColor("#22e025")
            changeSushiValue(true)
        }
        else{
            updateText("Not Harvested")
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