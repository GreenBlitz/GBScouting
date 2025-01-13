import React, { useState } from "react";
import CoralButton from "./CoralButton";
import AlgaeButton from "./AlgaeButton";
import { ValuesToBePassed } from "./input-types/AutonomousMapInput";
const SushiButton: React.FC<ValuesToBePassed> = (props)=>{
    return<>
    <div className="shushiButton" style={{display:"flex", flexDirection:"row", gap:"10%", }}>
        <CoralButton sushies={props.sushies} sushiToBeChanged={props.sushiToBeChanged}  />
        <AlgaeButton sushies={props.sushies} sushiToBeChanged={props.sushiToBeChanged} />
    </div>
    </>
}
export default SushiButton;