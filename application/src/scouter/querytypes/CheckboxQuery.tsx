import React, { useEffect } from "react";
import { queryFolder } from "../../utils/FolderStorage";

interface CheckboxQueryProps {
  name: string;
  required: boolean | undefined;
}

const CheckboxQuery: React.FC<CheckboxQueryProps> = ({ name, required }) => {
  function updateCheckbox() {
    const newValue =
      queryFolder.getItem(name) === "true" ? "false" : "true";
    queryFolder.setItem(name, newValue);
  }

  useEffect(() => {
    if (!queryFolder.getItem(name)) {
      queryFolder.setItem(name, "false");
    }
  });
  return (
    <input
      type="checkbox"
      id={name}
      name={name}
      required={required}
      onChange={updateCheckbox}
      defaultChecked={queryFolder.getItem(name) === "true"}
    />
  );
};

export default CheckboxQuery;
