import React, { useState } from "react";
import CoralButton from "./CoralButton";
import AlgaeButton from "./AlgaeButton";
import { ValuesToBePassed } from "./input-types/AutonomousMapInput";
const SushiButton: React.FC<ValuesToBePassed> = ()=>{
    return<>
    <div className="shushiButton" style={{display:"flex", flexDirection:"row", gap:"10%", }}>
        <CoralButton />
        <AlgaeButton />
    </div>
    </>
}
export default SushiButton;