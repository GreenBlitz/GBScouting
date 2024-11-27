import React, { useEffect } from "react";
import CheckboxQuery from "./querytypes/CheckboxQuery";
import CounterQuery from "./querytypes/CounterQuery";
import ListQuery from "./querytypes/ListQuery";
import RadioQuery from "./querytypes/RadioQuery";
import { queryFolder } from "../utils/FolderStorage";
interface ScouterQueryProps {
  name: string;
  queryType: "text" | "counter" | "checkbox" | "number" | "list" | "radio";
  required?: boolean | undefined;
  list?: string[];
}

const ScouterQuery: React.FC<ScouterQueryProps> = ({
  name,
  queryType,
  required,
  list,
}) => {
  function renderInput() {
    switch (queryType) {
      case "counter":
        return <CounterQuery name={name} />;
      case "checkbox":
        return <CheckboxQuery name={name} required={required} />;
      case "list":
        return (
          <ListQuery name={name} required={required} list={list ? list : []} />
        );
      case "radio":
        return (
          <RadioQuery name={name} required={required} list={list ? list : []} />
        );
      default:
        useEffect(() => {
          if (!queryFolder.getItem(name))
            queryFolder.setItem(name, "");
        });
        return (
          <input
            type={queryType}
            id={name}
            name={name}
            required={required}
            defaultValue={queryFolder.getItem(name) || ""}
            onChange={(event) =>
              queryFolder.setItem(name, event.target.value)
            }
          />
        );
    }
  }

  return (
    <div className="scouter-query">
      <h2>{name}</h2>
      {renderInput()}
    </div>
  );
};

export default ScouterQuery;
