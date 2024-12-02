import React, { useEffect } from "react";
import { localStorageTabName } from "../ScouterQuery";

interface RadioQueryProps {
  name: string;
  required: boolean | undefined;
  list: string[];
}

const RadioQuery: React.FC<RadioQueryProps> = ({ name, required, list }) => {
  const localStorageKey = localStorageTabName + name;
  useEffect(() => {
    if (!localStorage.getItem(localStorageKey)) {
      localStorage.setItem(localStorageKey, "");
    }
  });
  return list?.map((item, index) => (
    <React.Fragment key={index}>
      <input
        type="radio"
        id={item}
        name={name}
        value={item}
        required={required}
        onChange={() => localStorage.setItem(localStorageKey, item)}
        defaultChecked={item === localStorage.getItem(localStorageKey)}
      />
      <label htmlFor={item}>{item}</label>
    </React.Fragment>
  ));
};

export default RadioQuery;
