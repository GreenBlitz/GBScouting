import React, { useEffect } from "react";
import { queryFolder } from "../../utils/FolderStorage";

interface ListQueryProps {
  name: string;
  required: boolean | undefined;
  list: string[];
}

const ListQuery: React.FC<ListQueryProps> = ({ name, required, list }) => {
  useEffect(() => {
    if (!queryFolder.getItem(name)) {
      queryFolder.setItem(name, list[0]);
    }
  });
  return (
    <select
      name={name}
      id={name}
      required={required}
      defaultValue={queryFolder.getItem(name) || ""}
      onChange={(event) =>
        queryFolder.setItem(name, event.target.value)
      }
    >
      {list?.map((item, index) => (
        <option value={item} key={index}>
          {item}
        </option>
      ))}
    </select>
  );
};

export default ListQuery;
