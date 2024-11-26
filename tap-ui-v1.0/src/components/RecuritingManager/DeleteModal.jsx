import React from 'react';

const DeleteModal = ({ isOpen, onClose, onConfirm, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-4 shadow-lg">
        <h2 className="text-lg font-bold">Confirm Deletion</h2>
        <p>Are you sure you want to delete this vendor?</p>
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="mr-2 bg-gray-300 px-4 py-1 rounded">Cancel</button>
          {isDeleting ? (
            <div className="animate-spin rounded-full border-t-2 border-indigo-600 h-8 w-8"></div>
          ) : (
            <button onClick={onConfirm} className="bg-red-600 text-white px-4 py-1 rounded">Confirm</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;