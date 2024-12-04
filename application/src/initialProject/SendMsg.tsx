import React, { useState, useEffect } from "react";
const SendMsg: React.FC=()=>{
    const [counter, setCounter] = useState(0)

    const alertWhenPressed = ()=>{
        setCounter(counter+1)
        console.log(counter)
    }

    const title = <h2>Please Enter Messasadge {counter}</h2>
    const enterMsgField = <input onChange={() => {}} placeholder="ur mama"/>
    const submitButton = <button onClick={alertWhenPressed}>Click Me</button>
    const writtenMessages = <ul></ul>
    return(
        <>
            {title}
            {enterMsgField}
            {submitButton}
        </>
    )
}
export default SendMsg;
