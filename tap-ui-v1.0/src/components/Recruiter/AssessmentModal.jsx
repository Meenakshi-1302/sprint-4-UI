import React from 'react';

const Modal = ({ onClose, children, success, error, width }) => {
    const modalStyle = success ? 'bg-green-100 border-green-500' : error ? 'bg-red-100 border-red-500' : 'bg-white';
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-black opacity-50 absolute inset-0"></div>
            <div className={`shadow-lg rounded-lg p-6 relative ${modalStyle} border ${width}`}>
                <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>✖</button>
                {children}
            </div>
        </div>
    );
};


export default Modal;