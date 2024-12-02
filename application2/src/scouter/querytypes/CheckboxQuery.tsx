import React, { useEffect } from "react";
import { localStorageTabName } from "../ScouterQuery";

interface CheckboxQueryProps {
  name: string;
  required: boolean | undefined;
}

const CheckboxQuery: React.FC<CheckboxQueryProps> = ({ name, required }) => {
  const localStorageKey = localStorageTabName + name;
  function updateCheckbox() {
    const newValue =
      localStorage.getItem(localStorageKey) === "true" ? "false" : "true";
    localStorage.setItem(localStorageKey, newValue);
  }

  useEffect(() => {
    if (!localStorage.getItem(localStorageKey)) {
      localStorage.setItem(localStorageKey, "false");
    }
  });
  return (
    <input
      type="checkbox"
      id={name}
      name={name}
      required={required}
      onChange={updateCheckbox}
      defaultChecked={localStorage.getItem(localStorageKey) === "true"}
    />
  );
};

export default CheckboxQuery;
