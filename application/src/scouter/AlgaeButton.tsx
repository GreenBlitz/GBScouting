import React, { useEffect, useState } from "react";
import { AllSushis, ShusiToBeChanged, Sushi, ValuesToBePassed } from "./input-types/AutonomousMapInput";const AlgaeButton:React.FC<ValuesToBePassed> = (props)=>{
    let storage = props.storage.get()
    let storageSushis = [props.storage.get()?.Sushi1, props.storage.get()?.Sushi2,props.storage.get()?.Sushi3]
    const basicSushi: Sushi = {HasHarvested:false, HasSeeded:false}
    let initialState: boolean = true;
    const defineAlgae = ()=>{
        switch(props.sushiToBeChanged){
            case ShusiToBeChanged.SUSHI1:{
                return storageSushis[0]?.HasHarvested ? true : false
            }
            case ShusiToBeChanged.SUSHI2:{
                return storageSushis[1]?.HasHarvested ? true: false
            }
            case ShusiToBeChanged.SUSHI3:{
                return storageSushis[2]?.HasHarvested ? true: false
            }
        }
    }

    const defineAlgaeText = ()=>{
        if(defineAlgae() == true){
            return "Harvested"
        }
        else{
            return "Not Harvested"
        }
    }

    const defineCoralColor = ()=>{
        if(defineAlgae() == true){
            return "#22e025"
        }
        else{
            return "#db1616"
        }
    }

    const setStorage = ()=>{
        props.storage.set({Sushi1:storageSushis[0]||basicSushi, Sushi2:storageSushis[1]||basicSushi, Sushi3:storageSushis[2]||basicSushi})
    }
    const changeSushiValueWhenHarvested = ()=>{
        storage = props.storage.get()
        storageSushis = [props.storage.get()?.Sushi1, props.storage.get()?.Sushi2,props.storage.get()?.Sushi3]
            switch(props.sushiToBeChanged){
                case ShusiToBeChanged.SUSHI1:{
                    storageSushis[0] = {HasHarvested: true, HasSeeded: !!storageSushis[0]?.HasSeeded}
                break;
                }
                case ShusiToBeChanged.SUSHI2:{
                    storageSushis[1] = {HasHarvested: true, HasSeeded: !!storageSushis[1]?.HasSeeded}
                    break;
                }
                case ShusiToBeChanged.SUSHI3:{
                    storageSushis[2] = {HasHarvested: true, HasSeeded: !!storageSushis[2]?.HasSeeded}
                    break;
                }
            }
        }
        const changeSushiValueWhenUnHarvested = ()=>{
            storage = props.storage.get()
            storageSushis = [props.storage.get()?.Sushi1, props.storage.get()?.Sushi2,props.storage.get()?.Sushi3]
            switch(props.sushiToBeChanged){
                case ShusiToBeChanged.SUSHI1:{
                    storageSushis[0] = {HasHarvested: false, HasSeeded: !!storageSushis[0]?.HasSeeded}
                break;
                }
                case ShusiToBeChanged.SUSHI2:{
                    storageSushis[1] = {HasHarvested: false, HasSeeded: !!storageSushis[1]?.HasSeeded}
                    break;
                }
                case ShusiToBeChanged.SUSHI3:{
                    storageSushis[2] = {HasHarvested: false, HasSeeded: !!storageSushis[2]?.HasSeeded}
                    break;
                }
            }
        }


    const [hasHarvested, updateHasHarvested] = useState(defineAlgae)
    const[text, updateText] = useState(defineAlgaeText)
    const [color, changeColor] = useState(defineCoralColor)
    const handleChange = ()=>{
        updateHasHarvested(!hasHarvested)
        if(!hasHarvested){
            updateText("Harvested")
            changeColor("#22e025")
            changeSushiValueWhenHarvested()
        }
        else{
            updateText("Not Harvested")
            changeColor("#db1616")
            changeSushiValueWhenUnHarvested()
        }
        setStorage()
    }
    const algaeButton = <button style={{backgroundColor: color}} onClick={handleChange}>{text}</button>
    return<>  
    {algaeButton}
    </>
}
export default AlgaeButton;