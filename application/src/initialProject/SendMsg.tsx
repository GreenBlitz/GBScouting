import React, { useState, useEffect } from "react";
const SendMsg: React.FC=()=>{
    const alertWhenPressed = ()=>{
        console.log("Yoni")
}
    const title = <h2>Please Enter Message</h2>
    const enterMsgField = <input placeholder="ur mama" />
    const submitButton = <button onClick={alertWhenPressed} placeholder="ur mamam2" />
    return(
        <>
            {title}
            {enterMsgField}
            {submitButton}
        </>
    )
}
export default SendMsg;
