import React, { useEffect, useState } from "react";
import { AllSushis, ShusiToBeChanged, Sushi, ValuesToBePassed } from "./input-types/AutonomousMapInput";
const CoralButton:React.FC<ValuesToBePassed> = (props)=>{
    let storageSushis = [props.storage.get()?.Sushi1, props.storage.get()?.Sushi2,props.storage.get()?.Sushi3]
    const basicSushi: Sushi = {HasHarvested:false, HasSeeded:false}
    let initialState: boolean = true
    const allSushis = props.sushies
    allSushis.Sushi1.HasHarvested = true
    const defineCoral = ()=>{
        switch(props.sushiToBeChanged){
            case ShusiToBeChanged.SUSHI1:{
                return storageSushis[0]?.HasSeeded ? true: false
            }
            case ShusiToBeChanged.SUSHI2:{
                return storageSushis[1]?.HasSeeded ? true: false
            }
            case ShusiToBeChanged.SUSHI3:{
                return storageSushis[2]?.HasSeeded ? true: false
            }
        }
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

    const [hasPiled, updateHasPiled] = useState(defineCoral())
    const[text, updateText] = useState(defineCoralText())
    const [color, changeColor] = useState(defineCoralColor())

    console.log(hasPiled)

    const setStorage = ()=>{
        props.storage.set({Sushi1:storageSushis[0]||basicSushi, Sushi2:storageSushis[1]||basicSushi, Sushi3:storageSushis[2]||basicSushi})
    }

    const changeSushiValueWhenUnseeded = ()=>{
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
    const changeSushiValueWhenSeeded = ()=>{
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

    const handleChange = ()=>{
        updateHasPiled(!hasPiled)
        if(!hasPiled){
            updateText("Seeded")
            changeColor("#22e025")
            changeSushiValueWhenSeeded()
        }
        else{
            updateText("Not Seeded")
            changeColor("#db1616")
            changeSushiValueWhenUnseeded()
        }
        setStorage()
    }
    const coralButton = <button style={{backgroundColor: color}} onClick={handleChange}>{text}</button>
    return<>  
    {coralButton}
    </>
}
export default CoralButton