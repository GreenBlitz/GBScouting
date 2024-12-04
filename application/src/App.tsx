import React, { useState, useEffect } from "react";
import "./App.css";
import SendMsg from "./initialProject/SendMsg";
import ToDoList from "./initialProject/ToDoList";

const App: React.FC = () => {
  const [some, setSome] = useState<number>(0);
  const names = [0, 2, 21, 34, 520];

  useEffect(() => {
    async function getFetched() {
      //look in master in MatchList
      return await fetch("http://localhost:4590/messages").then((response) =>
        response.json()
      );
    }

    setSome(getFetched());
  });

  const button = <button onClick={() => setSome(some + 1)}>sigma</button>;
  const button2 = <button onClick={() => setSome(some - 1)}>ligma</button>;

  return (
    <>
      <ToDoList></ToDoList>
    </>
  );
};
  
export default App;
