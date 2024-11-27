import { useEffect, useState } from "react";
import React from "react";
import { queryFolder } from "../../utils/FolderStorage";

interface CounterQueryProps {
  name: string;
  color?: string;
}

const CounterQuery: React.FC<CounterQueryProps> = ({ name, color }) => {
  const initialValue = queryFolder.getItem(name) || "";
  const startingNumber = initialValue === "" ? 0 : parseInt(initialValue);
  const [count, setCountState] = useState(startingNumber);

  function setCount(newCount: number) {
    queryFolder.setItem(name, newCount + "");
    setCountState(newCount);
  }

  useEffect(() => {
    if (!queryFolder.getItem(name)) {
      queryFolder.setItem(name, "0");
    }
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setCount(Math.max(count - 1, 0))}
        style={{ backgroundColor: color }}
      >
        -
      </button>
      <h3>{count}</h3>
      <input type="hidden" id={name} name={name} value={count} />
      <button
        type="button"
        onClick={() => setCount(count + 1)}
        style={{ backgroundColor: color }}
      >
        +
      </button>
    </>
  );
};

export default CounterQuery;
