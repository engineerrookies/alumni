import React from 'react';
import { FaTimes } from 'react-icons/fa'; // Import the X icon from react-icons

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-lg w-full mx-4">
        {/* Close Icon at the Top Right */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          <FaTimes size={15} />
        </button>

        {children}
      </div>
    </div>
  );
};

export default Modal;