import React, { useState } from "react";

const PasswordUpdater: React.FC<{
  storageUpdater: (value: string) => void;
}> = ({ storageUpdater }) => {
  const [password, setPassword] = useState("");

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-4 bg-dark-card rounded-lg shadow-lg">
        <div className="flex flex-col items-center bg-dark-border">
          <div className="my-5">
            <h1 className="text-2xl">Enter Password</h1>
            <h1 className="text-xl text-gray-500">To Access Data</h1>
          </div>

          <input
            type="text"
            className="h-20 rounded-lg my-5 mx-5"
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
          <button
            className="rounded-lg big-button h-20 bg-green-700 my-5 font-bold text-xl"
            onClick={() => {
              storageUpdater(password);
              setPassword("");
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordUpdater;
