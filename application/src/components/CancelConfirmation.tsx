import React, { useState } from "react";

interface CancelConfirmationProps {
  name: string;
  onClick: () => void;
}

const CancelConfirmation: React.FC<CancelConfirmationProps> = ({
  name,
  onClick,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleConfirm = () => {
    onClick();
    setShowConfirmation(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowConfirmation(true)}
        className="btn btn-secondary"
      >
        {name}
      </button>

      {showConfirmation && (
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
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="btn btn-primary"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CancelConfirmation;
