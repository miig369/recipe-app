import React from "react";

type Props = {
  title: string;
  onClose?: () => void;
  children: React.ReactNode;
};

const Modal = ({ title, children, onClose }: Props) => {
  return (
    <>
      <div className="overlay"></div>
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>{title}</h2>
            <span className="close-btn" onClick={onClose}>
              &times;
            </span>
          </div>
          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;
