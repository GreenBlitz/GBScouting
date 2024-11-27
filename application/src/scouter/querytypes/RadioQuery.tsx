import React, { useEffect } from "react";
import { queryFolder } from "../../utils/FolderStorage";

interface RadioQueryProps {
  name: string;
  required: boolean | undefined;
  list: string[];
}

const RadioQuery: React.FC<RadioQueryProps> = ({ name, required, list }) => {
  useEffect(() => {
    if (!queryFolder.getItem(name)) {
      queryFolder.setItem(name, "");
    }
  });
  return list.map((item, index) => (
    <React.Fragment key={index}>
      <input
        type="radio"
        id={item}
        name={name}
        value={item}
        required={required}
        onChange={() => queryFolder.setItem(name, item)}
        defaultChecked={item === queryFolder.getItem(name)}
      />
      <label htmlFor={item}>{item}</label>
    </React.Fragment>
  ));
};

export default RadioQuery;
