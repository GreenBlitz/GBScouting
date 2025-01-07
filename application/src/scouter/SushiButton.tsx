import React, { useState } from "react";
import CoralButton from "./CoralButton";
import AlgaeButton from "./AlgaeButton";
const SushiButton: React.FC = ()=>{
    return<>
    <div className="shushiButton" style={{display:"flex", flexDirection:"row", gap:"10%", }}>
        <CoralButton />
        <AlgaeButton />
    </div>
    </>
}
export default SushiButton;