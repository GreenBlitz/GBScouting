import React, { useState, useEffect } from "react";
const SendMsg: React.FC=()=>{
    const alertWhenPressed = ()=>{

}
    const title = <h2>Please Enter Message</h2>
    const enterMsg = <input></input>
    const submitButton = <button onClick={alertWhenPressed}>Write Your message here</button>
    return(
        <>
        {title}
        {enterMsg}
        {submitButton}
        </>
    )
}
export default SendMsg;
