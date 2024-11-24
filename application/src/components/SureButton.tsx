import React from "react";
import { useState } from "react";

interface SureButtonProps {
    name: string;
  onClick: () => void;
}

const SureButton: React.FC<SureButtonProps> = ({ onClick, name }) => {
  const [areYouSure, setAreYouSure] = useState<boolean>(false);

  return (
    <>
      {areYouSure ? (
        <>
          <h2>Are You Sure?</h2>
          <button type="button" onClick={onClick}>
            Yes
          </button>
          <button type="button" onClick={() => setAreYouSure(false)}>
            No
          </button>
        </>
      ) : (
        <>
          <br />
          <br />
          <br />
          <button type="button" onClick={() => setAreYouSure(true)}>
            {name}
          </button>
        </>
      )}
    </>
  );
};


export default SureButton;