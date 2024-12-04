import React from "react";
import { useState } from "react";

interface CancelCheck {
  name: string;
  onClick: () => void;
}

const CancelCheck: React.FC<CancelCheck> = ({ onClick, name }) => {
  const [showCheck, setShowCheck] = useState<boolean>(false);

  return (
    <>
      {showCheck ? (
        <>
          <h2>Are You Sure?</h2>
          <button type="button" onClick={onClick}>
            Yes
          </button>
          <button type="button" onClick={() => setShowCheck(false)}>
            No
          </button>
        </>
      ) : (
        <>
          <br />
          <br />
          <br />
          <button type="button" onClick={() => setShowCheck(true)}>
            {name}
          </button>
        </>
      )}
    </>
  );
};

export default CancelCheck;
