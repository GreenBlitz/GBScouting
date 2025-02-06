import React, { useState } from "react";

interface CancelConfirmationProps {
  name: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const CancelConfirmation: React.FC<CancelConfirmationProps> = ({
  name,
  onClick,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleConfirm = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    onClick(event);
    setShowConfirmation(false);
  };

  const confirmation = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="card animate-fade-in">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-dark-text">
          Are you sure?
        </h2>
        <p className="mb-6 text-gray-700 dark:text-dark-text-secondary">
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => setShowConfirmation(false)}
            className="button-bg-blue small-button"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="small-button button-bg-red"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowConfirmation(true)}
        className="small-button button-bg-red"
      >
        {name}
      </button>

      {showConfirmation && confirmation}
    </div>
  );
};

export default CancelConfirmation;
