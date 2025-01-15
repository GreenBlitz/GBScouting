import React, { useEffect, useState } from "react";
import { AllSushis, ShusiToBeChanged, Sushi, ValuesToBePassed } from "./input-types/AutonomousMapInput";
const CoralButton:React.FC<ValuesToBePassed> = (props)=>{
    const[text, updateText] = useState("Not Sedded")
    const [color, changeColor] = useState("#db1616")
    const [hasPiled, updateHasPiled] = useState(false)
    let storage = props.storage.get()
    let storageSushis = [props.storage.get()?.Sushi1, props.storage.get()?.Sushi2,props.storage.get()?.Sushi3]
    const basicSushi: Sushi = {HasHarvested:false, HasSeeded:false}
    useEffect(() => {switch(props.sushiToBeChanged){
        case ShusiToBeChanged.SUSHI1:{
            if(storageSushis[0]?.HasSeeded){
                updateHasPiled(true)
                updateText("Seeded")
                changeColor("#22e025")
            }
            else{
                updateHasPiled(false)
                updateText("Not Seeded")
                changeColor("#db1616")
            }
        }
        case ShusiToBeChanged.SUSHI2:{
            if(storageSushis[1]?.HasSeeded){
                updateHasPiled(true)
                updateText("Seeded")
                changeColor("#22e025")
            }
            else{
                updateHasPiled(false)
                updateText("Not Seeded")
                changeColor("#db1616")
            }
        }
        case ShusiToBeChanged.SUSHI3:{
            if(storageSushis[2]?.HasSeeded){
                updateHasPiled(true)
                updateText("Seeded")
                changeColor("#22e025")
            }
            else{
                updateHasPiled(false)
                updateText("Not Seeded")
                changeColor("#db1616")
            }
        }
    
    }},[])
    
    const changeSushiValueWhenSeeded = ()=>{
        storage = props.storage.get()
        storageSushis = [props.storage.get()?.Sushi1, props.storage.get()?.Sushi2,props.storage.get()?.Sushi3]
        switch(props.sushiToBeChanged){
            case ShusiToBeChanged.SUSHI1:{
                storageSushis[0] = {HasHarvested: !!storageSushis[0]?.HasHarvested, HasSeeded: true}
            break;
            }
            case ShusiToBeChanged.SUSHI2:{
                storageSushis[1] = {HasHarvested: !!storageSushis[1]?.HasHarvested, HasSeeded: true}
                break;
            }
            case ShusiToBeChanged.SUSHI3:{
                storageSushis[2] = {HasHarvested: !!storageSushis[2]?.HasHarvested, HasSeeded: true}
                break;
            }
        }
    }
    const changeSushiValueWhenUnseeded = ()=>{
        storage = props.storage.get()
        storageSushis = [props.storage.get()?.Sushi1, props.storage.get()?.Sushi2,props.storage.get()?.Sushi3]
        switch(props.sushiToBeChanged){
            case ShusiToBeChanged.SUSHI1:{
                storageSushis[0] = {HasHarvested: !!storageSushis[0]?.HasHarvested, HasSeeded: false}
            break;
            }
            case ShusiToBeChanged.SUSHI2:{
                storageSushis[1] = {HasHarvested: !!storageSushis[1]?.HasHarvested, HasSeeded: false}
                break;
            }
            case ShusiToBeChanged.SUSHI3:{
                storageSushis[2] = {HasHarvested: !!storageSushis[2]?.HasHarvested, HasSeeded: false}
                break;
            }
        }
    }

    const handleChange = ()=>{
        updateHasPiled(!hasPiled)
        if(hasPiled){
            updateText("Seeded")
            changeColor("#22e025")
            changeSushiValueWhenSeeded()
        }
        else{
            updateText("Not Seeded")
            changeColor("#db1616")
            changeSushiValueWhenUnseeded()
        }
        props.storage.set({Sushi1:storageSushis[0]||basicSushi, Sushi2:storageSushis[1]||basicSushi, Sushi3:storageSushis[2]||basicSushi})
    }

    const coralButton = <button style={{backgroundColor: color}} onClick={handleChange}>{text}</button>
    return<>  
    {coralButton}
    </>
}
export default CoralButton