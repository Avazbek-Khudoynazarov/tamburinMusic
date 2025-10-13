import React from 'react';
import PropTypes from 'prop-types';
import './index.module.css';


function Modal(props) {
  const { onClose, onConfirm, type, text } = props;

  const handleConfirm = () => {
    onConfirm();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className={`modal ${type ? 'open' : ''}`}>
      <div className="modal-content">
        <div className="modal-header">
          {type === "confirm" ? (
            <span className="icon help-icon">&#63;</span> /* Question Mark Icon */
          ) : (
            <span className="icon error-icon">&#9888;</span> /* Warning Icon */
          )}
        </div>
        <div className="modal-body">
          <p>{text}</p>
        </div>
        <div className="modal-footer">
          {type === "confirm" ? (
            <>
              <button className="button" onClick={handleConfirm}>예</button>
              <button className="button" onClick={handleClose}>아니오</button>
            </>
          ) : (
            <button className="button" onClick={handleClose}>닫기</button>
          )}
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  type: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default Modal;
