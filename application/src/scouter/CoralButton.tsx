import React, { useState } from "react";
import { AllSushis, ShusiToBeChanged, Sushi, ValuesToBePassed } from "./input-types/AutonomousMapInput";
const CoralButton:React.FC<ValuesToBePassed> = (props)=>{
    const [hasPiled, updateHAasPiled] = useState(false)
    const[text, updateText] = useState("Not Sedded")
    const [color, changeColor] = useState("#db1616")
    const storage = props.storage.get()
    const storageSushis = [props.storage.get()?.Sushi1, props.storage.get()?.Sushi2,props.storage.get()?.Sushi3]
    const basicSushi: Sushi = {HasHarvested:false, HasSeeded:false}

    const changeSushiValueWhenSeeded = ()=>{
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
        updateHAasPiled(!hasPiled)
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