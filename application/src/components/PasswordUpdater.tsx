import React, { useState } from "react";

const PasswordUpdater: React.FC<{storageUpdater: (value: string) => void}> = ({storageUpdater}) => {

    const [password, setPassword] = useState("");

    return <>
      <h1>Enter Password</h1>
      <input
        type="text"
        onChange={(event) => setPassword(event.currentTarget.value)}
      />
      <button
        onClick={() => {
          storageUpdater(password);
          setPassword("");
        }}
      >
        Submit
      </button>
    </>
};

export default PasswordUpdater